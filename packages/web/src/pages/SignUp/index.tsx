import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'wouter';
import { http } from '../../api/http';

import { useAuth } from '../../hooks/useAuth';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export function SignUp() {
  const { signIn } = useAuth();
  const { register, handleSubmit, errors, watch } = useForm<SignUpFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const onSubmit = handleSubmit(async data => {
    try {
      await http.post('/api/users', {
        json: data,
      });

      try {
        signIn(data);
      } catch (err) {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Email is not unique');
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
      <h1>Sign up</h1>
      <form
        onSubmit={onSubmit}
        style={{ width: '300px', display: 'flex', flexDirection: 'column' }}
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          ref={register({
            required: {
              value: true,
              message: 'Required field',
            },
          })}
        />
        {errors.email?.message ? <span>{errors.email.message}</span> : null}

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

        <label htmlFor="passwordConfirmation">Password Confirmation</label>
        <input
          type="password"
          name="passwordConfirmation"
          id="passwordConfirmation"
          ref={register({
            required: {
              value: true,
              message: 'Required field',
            },
            validate: value => value === watch('password') || 'The passwords do not match',
          })}
        />
        {errors.passwordConfirmation?.message ? (
          <span>{errors.passwordConfirmation.message}</span>
        ) : null}

        <button type="submit">Create account</button>
      </form>

      <Link href="/login">Already have an account? Sign in here</Link>
    </div>
  );
}
