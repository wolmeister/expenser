import React, { useMemo } from 'react';
import { Button, Tag, Spacer, Table } from '@geist-ui/react';
import { Slash, Edit2 } from '@geist-ui/react-icons';
import { TableDataSource } from '@geist-ui/react/dist/table/table';

import { Entry } from '../../models/entry';

type EntryTableProps = {
  entries?: Entry[];
  onEditEntry(entry: Entry): void;
  onDeleteEntry(entry: Entry): void;
};

export function EntryTable({ entries, onEditEntry, onDeleteEntry }: EntryTableProps) {
  const tableData = useMemo<TableDataSource<Entry>[]>(() => {
    if (!entries) {
      return [];
    }
    return entries.map(entry => ({
      source: entry,
      ...entry,
      type: entry.amount > 0 ? <Tag type="success">Income</Tag> : <Tag type="error">Expense</Tag>,
      operation: (_actions, rowData) => (
        <>
          <Button
            iconRight={<Slash />}
            auto
            size="small"
            onClick={() => {
              onDeleteEntry(rowData.rowValue.source);
            }}
          />
          <Spacer x={0.5} />
          <Button
            iconRight={<Edit2 />}
            auto
            size="small"
            onClick={() => {
              onEditEntry(rowData.rowValue.source);
            }}
          />
        </>
      ),
    }));
  }, [entries, onEditEntry, onDeleteEntry]);

  return (
    <Table data={tableData}>
      <Table.Column prop="type" label="Type" width={100} />
      <Table.Column prop="amount" label="Amount" />
      <Table.Column prop="category" label="Category" />
      <Table.Column prop="description" label="Description" />
      <Table.Column prop="date" label="Date" />
      <Table.Column prop="operation" label="Actions" width={150} />
    </Table>
  );
}
