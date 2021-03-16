import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Entry } from '../../../models/entry';

type EntryFormProps = {
  entry?: Entry | null;
  onSave(entry: Entry): void;
  onCancel(): void;
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

export function EntryForm({ entry, onSave, onCancel }: EntryFormProps) {
  const { register, handleSubmit, errors, setValue, reset } = useForm<EntryFormData>({
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
    <div style={{ padding: '20px' }}>
      <h3>Add entry</h3>
      <form
        onSubmit={onSubmit}
        style={{ width: '350px', display: 'flex', flexDirection: 'column' }}
      >
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          name="amount"
          id="amount"
          ref={register({
            required: {
              value: true,
              message: 'Required field',
            },
            valueAsNumber: true,
          })}
        />
        {errors.amount?.message ? <span>{errors.amount.message}</span> : null}

        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          ref={register({
            required: {
              value: true,
              message: 'Required field',
            },
          })}
        />
        {errors.category?.message ? <span>{errors.category.message}</span> : null}

        <label htmlFor="description">Description</label>
        <input type="text" name="description" id="description" ref={register()} />
        {errors.description?.message ? <span>{errors.description.message}</span> : null}

        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          ref={register({
            required: {
              value: true,
              message: 'Required field',
            },
          })}
        />
        {errors.date?.message ? <span>{errors.date.message}</span> : null}

        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
