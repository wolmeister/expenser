import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Divider, Input, Note, Spacer, Text } from '@geist-ui/react';
import { Mail, Lock, Zap } from '@geist-ui/react-icons';
import { Link } from 'wouter';

import { useAuth } from '../../hooks/useAuth';

type FormData = {
  email: string;
  password: string;
};

export function Login() {
  const { signIn } = useAuth();
  const [signInError, setSignInError] = useState(false);

  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = handleSubmit(async data => {
    try {
      setSignInError(false);
      await signIn(data);
    } catch (err) {
      // TODO: Handle other errors, like connection
      setSignInError(true);
    }
  });

  return (
    <div style={{ height: '100vh' }}>
      <Spacer inline y={0.5} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Spacer x={1.5} />
        <Zap fill="black" />
        <Spacer x={0.5} />
        <Text h4 style={{ margin: 0 }}>
          Expenser
        </Text>
      </div>
      <Spacer inline y={0.5} />
      <Divider y={0} />
      <div
        style={{
          maxWidth: '430px',
          width: '80%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
      >
        <Text h1 style={{ textAlign: 'center' }}>
          Sign in to Expenser
        </Text>
        <Spacer y={1.5} />
        {signInError && (
          <>
            <Note type="error" label={false}>
              The email address or password is incorrect.
            </Note>
            <Spacer y={1.5} />
          </>
        )}
        <form onSubmit={onSubmit}>
          <Input
            icon={<Mail />}
            placeholder="Email"
            width="100%"
            name="email"
            ref={register({
              required: {
                value: true,
                message: 'Field is required',
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email is invalid',
              },
            })}
          />
          {errors.email?.message ? (
            <>
              <Spacer y={0.2} />
              <Text small type="error">
                {errors.email.message}
              </Text>
            </>
          ) : null}
          <Spacer y={0.5} />
          <Input
            icon={<Lock />}
            placeholder="Password"
            type="password"
            width="100%"
            name="password"
            ref={register({
              required: {
                value: true,
                message: 'Field is required',
              },
            })}
          />
          {errors.password?.message ? (
            <>
              <Spacer y={0.2} />
              <Text small type="error">
                {errors.password.message}
              </Text>
            </>
          ) : null}
          <Spacer y={1} />
          <Button type="secondary-light" htmlType="submit" style={{ width: '100%' }}>
            Log in
          </Button>
          <Spacer y={1} />
          <Link href="/signup" style={{ textAlign: 'center', display: 'block' }}>
            Don&apos;t have an account yet? Sign up here
          </Link>
        </form>
      </div>
    </div>
  );
}
