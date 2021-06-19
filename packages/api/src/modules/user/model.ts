export enum UserConstraints {
  UNIQUE_EMAIL = 'users_email_unique',
}

export type CreateUser = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};
