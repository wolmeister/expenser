create table entries (
  id serial not null constraint entries_pkey primary key,
  "userId" integer constraint entries_userid_foreign references public.users,
  amount numeric(13, 2) not null,
  category text not null,
  description text,
  date date not null
);