export type CreateEntry = {
  userId: number;
  amount: number;
  category: number;
  description?: number | null;
  date: string;
};

export type UpdateEntry = {
  amount: number;
  category: number;
  description?: number | null;
  date: string;
};

export type Entry = {
  id: number;
  userId: number;
  amount: number;
  category: number;
  description?: number | null;
  date: string;
};
