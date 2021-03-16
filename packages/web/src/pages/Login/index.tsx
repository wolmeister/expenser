import React from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../hooks/useAuth';

type FormData = {
  email: string;
  password: string;
};

export function Login() {
  const { signIn } = useAuth();
  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const onSubmit = handleSubmit(async data => {
    try {
      await signIn(data);
    } catch (err) {
      alert('Invalid credentials');
    }
  });

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <h1>Login</h1>
      <form
        onSubmit={onSubmit}
        style={{ width: '300px', display: 'flex', flexDirection: 'column' }}
      >
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          ref={register({
            required: {
              value: true,
              message: 'Required field',
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email',
            },
          })}
        />
        {errors.email?.message ? <span>{errors.email.message}</span> : null}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          ref={register({
            required: {
              value: true,
              message: 'Required field',
            },
          })}
        />
        {errors.password?.message ? <span>{errors.password.message}</span> : null}

        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
