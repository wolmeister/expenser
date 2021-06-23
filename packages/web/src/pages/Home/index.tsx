import React, { useCallback, useState } from 'react';
import { Button, Divider, Spacer, Text, useToasts } from '@geist-ui/react';
import { Zap, Power, Plus } from '@geist-ui/react-icons';

import { Entry } from '../../models/entry';
import { EntryForm } from './EntryForm';
import { useAuth } from '../../hooks/useAuth';
import { useEntries } from '../../hooks/api/entry/useEntries';
import { useCreateEntry } from '../../hooks/api/entry/useCreateEntry';
import { useUpdateEntry } from '../../hooks/api/entry/useUpdateEntry';
import { useDeleteEntry } from '../../hooks/api/entry/useDeleteEntry';
import { EntryTable } from './EntryTable';

export function Home() {
  const { signOut, user } = useAuth();

  const { entries } = useEntries();
  const { createEntry } = useCreateEntry();
  const { updateEntry } = useUpdateEntry();
  const { deleteEntry } = useDeleteEntry();

  const [, setToast] = useToasts();

  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [entryFormVisible, setEntryFormVisible] = useState(false);

  const onAddEntry = () => {
    setSelectedEntry(null);
    setEntryFormVisible(true);
  };

  const onEditEntry = useCallback((entry: Entry) => {
    setSelectedEntry(entry);
    setEntryFormVisible(true);
  }, []);

  const onDeleteEntry = useCallback(
    (entry: Entry) => {
      // eslint-disable-next-line no-alert
      if (window.confirm('Do you really want to delete this entry?')) {
        deleteEntry(entry, {
          onSuccess() {
            setToast({
              text: 'Entry deleted successfully!',
              type: 'success',
              delay: 3500,
            });
          },
          onError() {
            setToast({
              text: 'An error occurred while deleting the entry, please try again.',
              type: 'error',
              delay: 3500,
            });
          },
        });
      }
    },
    [deleteEntry, setToast]
  );

  const onSaveEntry = async (entry: Entry) => {
    const onSuccess = () => {
      setToast({
        text: 'Entry saved successfully!',
        type: 'success',
        delay: 3500,
      });
      setEntryFormVisible(false);
    };

    const onError = () => {
      setToast({
        text: 'An error occurred while saving the entry, please try again.',
        type: 'error',
        delay: 3500,
      });
    };

    if (entry.id) {
      updateEntry(entry, { onSuccess, onError });
    } else {
      createEntry(entry, { onSuccess, onError });
    }
  };

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
        <Text small type="secondary" style={{ marginLeft: 'auto' }}>
          {user?.email}
        </Text>
        <Spacer x={0.5} />
        <Button
          auto
          iconRight={<Power />}
          size="small"
          onClick={signOut}
          data-testid="logout-button"
        />
        <Spacer inline x={1.5} />
      </div>
      <Spacer inline y={0.5} />
      <Divider y={0} />

      <EntryForm
        open={entryFormVisible}
        entry={selectedEntry}
        onSave={onSaveEntry}
        onClose={() => setEntryFormVisible(false)}
      />

      <div style={{ padding: '25pt' }}>
        <Button
          auto
          icon={<Plus />}
          type="secondary-light"
          onClick={onAddEntry}
          style={{ display: 'block', marginLeft: 'auto' }}
        >
          Add new
        </Button>

        <Spacer y={1} />

        <EntryTable entries={entries} onEditEntry={onEditEntry} onDeleteEntry={onDeleteEntry} />
      </div>
    </div>
  );
}
