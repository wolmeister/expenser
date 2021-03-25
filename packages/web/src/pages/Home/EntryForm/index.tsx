import React, { useEffect } from 'react';
import { Input, Modal, Spacer, Text } from '@geist-ui/react';
import { Calendar, DollarSign, Info, Tag } from '@geist-ui/react-icons';
import { Controller, useForm } from 'react-hook-form';
import { Entry } from '../../../models/entry';

type EntryFormProps = {
  open: boolean;
  entry?: Entry | null;
  onSave(entry: Entry): void;
  onClose(): void;
};

type EntryFormData = {
  amount: number;
  category: string;
  description?: string | null;
  date: string;
};

function formatDate(date: string) {
  // TODO: Remove this
  const nativeDate = new Date(date);

  const year = nativeDate.getFullYear();
  const month = nativeDate.getMonth() + 1;
  const day = nativeDate.getDate();

  return [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('-');
}

export function EntryForm({ open, entry, onSave, onClose }: EntryFormProps) {
  const { register, handleSubmit, errors, setValue, reset, control } = useForm<EntryFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const onSubmit = handleSubmit(async data => {
    onSave({
      ...entry,
      ...data,
      date: new Date(data.date).toISOString(),
    });
  });

  useEffect(() => {
    if (entry) {
      setValue('amount', entry.amount);
      setValue('category', entry.category);
      setValue('description', entry.description);
      setValue('date', formatDate(entry.date));
    } else {
      reset();
    }
  }, [entry, reset, setValue]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Title>{entry ? 'Edit entry' : 'Add entry'}</Modal.Title>
      <Modal.Content>
        <form onSubmit={onSubmit}>
          {/* Amount */}
          <Controller
            as={<Input icon={<DollarSign />} placeholder="Amount" width="100%" />}
            control={control}
            name="amount"
            defaultValue={entry?.amount || ''}
            rules={{
              required: {
                value: true,
                message: 'Field is required',
              },
              valueAsNumber: true,
            }}
          />
          {errors.amount?.message ? (
            <>
              <Spacer y={0.2} />
              <Text small type="error">
                {errors.amount.message}
              </Text>
            </>
          ) : null}
          <Spacer y={0.5} />
          {/* Category */}
          <Controller
            as={<Input icon={<Tag />} placeholder="Category" width="100%" />}
            control={control}
            name="category"
            defaultValue={entry?.category || ''}
            rules={{
              required: {
                value: true,
                message: 'Field is required',
              },
            }}
          />
          {errors.category?.message ? (
            <>
              <Spacer y={0.2} />
              <Text small type="error">
                {errors.category.message}
              </Text>
            </>
          ) : null}
          <Spacer y={0.5} />
          {/* Description */}
          <Controller
            as={<Input icon={<Info />} placeholder="Description" width="100%" />}
            control={control}
            name="description"
            defaultValue={entry?.description || ''}
          />
          {errors.description?.message ? (
            <>
              <Spacer y={0.2} />
              <Text small type="error">
                {errors.description.message}
              </Text>
            </>
          ) : null}
          <Spacer y={0.5} />
          {/* Date */}
          <Controller
            as={<Input icon={<Calendar />} type="date" placeholder="Date" width="100%" />}
            control={control}
            name="date"
            defaultValue={entry?.date ? formatDate(entry.date) : ''}
            rules={{
              required: {
                value: true,
                message: 'Field is required',
              },
            }}
          />
          {errors.date?.message ? (
            <>
              <Spacer y={0.2} />
              <Text small type="error">
                {errors.date.message}
              </Text>
            </>
          ) : null}
        </form>
      </Modal.Content>
      <Modal.Action passive onClick={onClose}>
        Cancel
      </Modal.Action>
      <Modal.Action onClick={onSubmit}>Save</Modal.Action>
    </Modal>
  );
}
