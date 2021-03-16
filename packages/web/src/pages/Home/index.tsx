import React, { useCallback, useEffect, useState } from 'react';
import { http } from '../../api/http';
import { Dialog } from '../../components/Dialog';

import { Entry } from '../../models/entry';
import { EntryForm } from './EntryForm';

export function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [entryFormVisible, setEntryFormVisible] = useState(false);

  const addNewEntry = useCallback(() => {
    setSelectedEntry(null);
    setEntryFormVisible(true);
  }, []);

  const editEntry = useCallback((entry: Entry) => {
    setSelectedEntry(entry);
    setEntryFormVisible(true);
  }, []);

  const deleteEntry = useCallback(async (entry: Entry) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Do you really want to delete this entry?')) {
      try {
        await http.delete(`/api/entries/${entry.id}`);
        setEntries(entries.filter(e => entry.id !== e.id));
      } catch (err) {
        alert('An error ocurred');
      }
    }
  }, []);

  const saveEntry = useCallback(
    async (entry: Entry) => {
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
      } catch (err) {
        alert('An error ocurred');
      }
    },
    [entries]
  );

  useEffect(() => {
    http.get('/api/entries').json<Entry[]>().then(setEntries);
  }, []);

  return (
    <div>
      <h1>Expenser</h1>

      {entryFormVisible && (
        <Dialog>
          <EntryForm
            entry={selectedEntry}
            onSave={saveEntry}
            onCancel={() => setEntryFormVisible(false)}
          />
        </Dialog>
      )}

      <button type="button" onClick={addNewEntry}>
        Adicionar
      </button>
      <table>
        <thead>
          <tr>
            <th>Actions</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    editEntry(entry);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteEntry(entry);
                  }}
                >
                  Delete
                </button>
              </td>
              <td>{entry.amount}</td>
              <td>{entry.category}</td>
              <td>{entry.description}</td>
              <td>{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
