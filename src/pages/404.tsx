import { Button, Center, Stack, Title } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import Link from 'next/link';

export default function Mew404() {
  return (
    <Center>
      <Stack align="center">
        <Title>Page Not Found</Title>
        <Link href={`/`}>
          <Button leftSection={<IconHome />}>Home</Button>
        </Link>
      </Stack>
    </Center>
  );
}