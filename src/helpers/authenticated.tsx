import { useStore } from '@/helpers/state';
import { Button, Center, Stack, Title } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

export function withAuthentication(Component: React.FC<any>, admin: boolean = false) {
  const AuthenticatedComponent: React.FC<any> = observer((props) => {
    const [isClient, setIsClient] = React.useState(false);
    const router = useRouter();

    const store = useStore();

    React.useEffect(() => {
      setIsClient(true);

      store?.fetchUserInfo().then(() => {
        if (!store?.userData) {
          router.push('/login');
        }
      });
    }, [store, router]);

    if (!store?.userData || !isClient) {
      return <></>;
    }

    if (admin && !store?.userData?.admin) {
      return <Center>
        <Stack align="center">
          <Title>Not Authorized</Title>
          <Link href={`/`}>
            <Button leftSection={<IconHome />}>Home</Button>
          </Link>
        </Stack>
      </Center>;
    }

    return <Component {...props} />;
  });

  return AuthenticatedComponent;
}