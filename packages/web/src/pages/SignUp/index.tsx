import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Divider, Input, Note, Spacer, Text } from '@geist-ui/react';
import { User, Lock, Zap, Mail } from '@geist-ui/react-icons';
import { Link } from 'wouter';

import { useAuth } from '../../hooks/useAuth';
import { useCreateUser } from '../../hooks/api/user/useCreateUser';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export function SignUp() {
  const { signIn } = useAuth();
  const { createUserAsync } = useCreateUser();

  const [signUpError, setSignUpError] = useState(false);

  const { register, handleSubmit, errors, watch } = useForm<SignUpFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = handleSubmit(async data => {
    try {
      setSignUpError(false);

      await createUserAsync(data);

      signIn(data);
    } catch (err) {
      // TODO: Handle other errors, like connection
      setSignUpError(true);
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
          Sign up to Expenser
        </Text>
        <Spacer y={1.5} />
        {signUpError && (
          <>
            <Note type="error" label={false} data-testid="signup-error">
              There&apos;s already an account associated with that email.
              <br />
              <Text>
                <Link href="/login">Click here to sign in.</Link>
              </Text>
            </Note>
            <Spacer y={1.5} />
          </>
        )}
        <form onSubmit={onSubmit}>
          {/* Name */}
          <Input
            icon={<User />}
            placeholder="Name"
            width="100%"
            name="name"
            data-testid="name-input"
            ref={register({
              required: {
                value: true,
                message: 'Field is required',
              },
            })}
          />
          {errors.name?.message ? (
            <>
              <Spacer y={0.2} />
              <Text small type="error" data-testid="name-error">
                {errors.name.message}
              </Text>
            </>
          ) : null}
          <Spacer y={0.5} />
          {/* Email */}
          <Input
            icon={<Mail />}
            placeholder="Email"
            width="100%"
            name="email"
            data-testid="email-input"
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
              <Text small type="error" data-testid="email-error">
                {errors.email.message}
              </Text>
            </>
          ) : null}
          <Spacer y={0.5} />
          {/* Password */}
          <Input
            icon={<Lock />}
            type="password"
            placeholder="Password"
            width="100%"
            name="password"
            data-testid="password-input"
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
              <Text small type="error" data-testid="password-error">
                {errors.password.message}
              </Text>
            </>
          ) : null}
          <Spacer y={0.5} />
          {/* Password confirmation */}
          <Input
            icon={<Lock />}
            type="password"
            placeholder="Password confirmation"
            width="100%"
            name="passwordConfirmation"
            data-testid="password-confirmation-input"
            ref={register({
              required: {
                value: true,
                message: 'Field is required',
              },
              validate: value => value === watch('password') || 'The passwords do not match',
            })}
          />
          {errors.passwordConfirmation?.message ? (
            <>
              <Spacer y={0.2} />
              <Text small type="error" data-testid="password-confirmation-error">
                {errors.passwordConfirmation.message}
              </Text>
            </>
          ) : null}
          {/* Buttons */}
          <Spacer y={1} />
          <Button type="secondary-light" htmlType="submit" style={{ width: '100%' }}>
            Create account
          </Button>
          <Spacer y={1} />
          <Link href="/login" style={{ textAlign: 'center', display: 'block' }}>
            Already have an account? Sign in here
          </Link>
        </form>
      </div>
    </div>
  );
}
