import React, { useCallback, useEffect, useState } from 'react';
import { Button, Divider, Spacer, Table, Tag, Text, useToasts } from '@geist-ui/react';
import { Zap, Edit2, Slash, Plus } from '@geist-ui/react-icons';
import { TableDataSource } from '@geist-ui/react/dist/table/table';
import { TableOperation } from '@geist-ui/react/dist/table/table-cell';

import { http } from '../../api/http';

import { Entry } from '../../models/entry';
import { EntryForm } from './EntryForm';
import { useAuth } from '../../hooks/useAuth';

export function Home() {
  const { signOut } = useAuth();

  const [, setToast] = useToasts();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [entryFormVisible, setEntryFormVisible] = useState(false);

  const addNewEntry = () => {
    setSelectedEntry(null);
    setEntryFormVisible(true);
  };

  const editEntry = (entry: Entry) => {
    setSelectedEntry(entry);
    setEntryFormVisible(true);
  };

  const deleteEntry = useCallback(
    async (entry: Entry) => {
      console.log('changed');
      // eslint-disable-next-line no-alert
      if (window.confirm('Do you really want to delete this entry?')) {
        try {
          await http.delete(`/api/entries/${entry.id}`);
          setEntries(entries.filter(e => entry.id !== e.id));
          setToast({ text: 'Entry deleted successfully!', type: 'success', delay: 3500 });
        } catch (err) {
          alert('An error ocurred');
        }
      }
    },
    [entries, setToast]
  );

  const saveEntry = async (entry: Entry) => {
    try {
      let addedEntry: Entry;
      if (entry.id) {
        addedEntry = await http
          .put(`/api/entries/${entry.id}`, {
            json: entry,
          })
          .json<Entry>();
      } else {
        addedEntry = await http
          .post('/api/entries', {
            json: entry,
          })
          .json<Entry>();
      }
      if (entry.id) {
        setEntries(entries.map(e => (e.id === addedEntry.id ? addedEntry : e)));
      } else {
        setEntries([addedEntry, ...entries]);
      }

      setEntryFormVisible(false);
      setToast({ text: 'Entry saved successfully!', type: 'success', delay: 3500 });
    } catch (err) {
      alert('An error ocurred');
    }
  };

  const [tableData, setTableData] = useState<TableDataSource<Entry>[]>();
  // const operation: TableOperation = (actions, rowData) => (
  //   <>
  //     <Button
  //       iconRight={<Slash />}
  //       auto
  //       size="small"
  //       onClick={() => {
  //         deleteEntry(rowData.rowValue);
  //       }}
  //     />
  //     <Spacer x={0.5} />
  //     <Button
  //       iconRight={<Edit2 />}
  //       auto
  //       size="small"
  //       onClick={() => {
  //         editEntry(rowData.rowValue);
  //       }}
  //     />
  //   </>
  // );

  useEffect(() => {
    http.get('/api/entries').json<Entry[]>().then(setEntries);
  }, []);

  useEffect(() => {
    console.log('entries changed');
    setTableData(
      entries.map(entry => ({
        ...entry,
        type: entry.amount > 0 ? <Tag type="success">Income</Tag> : <Tag type="error">Expense</Tag>,
        operation: (actions, rowData) => (
          <>
            <Button
              iconRight={<Slash />}
              auto
              size="small"
              onClick={() => {
                deleteEntry(rowData.rowValue);
              }}
            />
            <Spacer x={0.5} />
            <Button
              iconRight={<Edit2 />}
              auto
              size="small"
              onClick={() => {
                editEntry(rowData.rowValue);
              }}
            />
          </>
        ),
      }))
    );
  }, [entries]);

  return (
    <div>
      <Spacer inline y={0.5} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Spacer inline x={1.5} />
        <Zap fill="black" />
        <Spacer x={0.5} />
        <Text h4 style={{ margin: 0 }}>
          Expenser
        </Text>
        <Text small style={{ cursor: 'pointer', marginLeft: 'auto' }} onClick={signOut}>
          Logout
        </Text>
        <Spacer inline x={1.5} />
      </div>
      <Spacer inline y={0.5} />
      <Divider y={0} />

      <EntryForm
        open={entryFormVisible}
        entry={selectedEntry}
        onSave={saveEntry}
        onClose={() => setEntryFormVisible(false)}
      />

      <div style={{ padding: '25pt' }}>
        <Button
          auto
          icon={<Plus />}
          type="secondary-light"
          onClick={addNewEntry}
          style={{ display: 'block', marginLeft: 'auto' }}
        >
          Add new
        </Button>

        <Spacer y={1} />

        <Table data={tableData}>
          <Table.Column prop="type" label="Type" width={100} />
          <Table.Column prop="amount" label="Amount" />
          <Table.Column prop="category" label="Category" />
          <Table.Column prop="description" label="Description" />
          <Table.Column prop="date" label="Date" />
          <Table.Column prop="operation" label="Actions" width={150} />
        </Table>
      </div>
    </div>
  );
}
