import * as React from 'react';
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import api, { errorForm, showError } from '@/helpers/api';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useStore } from '@/helpers/state';

export default function Register() {
  const router = useRouter();
  const store = useStore();

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      registrationCode: '',
    },

    validate: {
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords don't match",
    },
  });

  // Go to user info if logged in
  React.useEffect(() => {
    if (store?.userData) router.push('/projects');
  }, [store, router]);

  const createAccount = React.useCallback(
    (values: any) => {
      const body: any = {
        username: values.username,
        email: values.email,
        password: values.password,
        registrationCode: values.registrationCode
      };

      api
        .register(body)
        .then(() => {
          notifications.show({
            title: 'Account created!',
            message: 'Please login to your account',
          });

          router.push('/login');
        })
        .catch((err) => errorForm(err, form));
    },
    [router, form],
  );

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create an account!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Have an account already?{' '}
        <Link href="/login" passHref>
          <Anchor size="sm" component="button">
            Login
          </Anchor>
        </Link>
      </Text>

      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        component="form"
        onSubmit={form.onSubmit(createAccount)}
      >
        <TextInput
          label="Username"
          placeholder="Username"
          required
          {...form.getInputProps('username')}
        />
        <TextInput
          label="Email"
          placeholder="you@email.com"
          required
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          {...form.getInputProps('password')}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Your password"
          required
          mt="md"
          {...form.getInputProps('confirmPassword')}
        />
        <TextInput
          label="Registration code"
          placeholder="Your registration code"
          mt="md"
          required
          {...form.getInputProps('registrationCode')}
        />
        <Button fullWidth mt="xl" type="submit">
          Sign up
        </Button>
      </Paper>
    </Container>
  );
}