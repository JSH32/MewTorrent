import { ActionIcon, AppShell, Button, Group, Menu, Title, useMantineColorScheme } from '@mantine/core'
import React from 'react'
import classes from './App.module.css';
import Link from 'next/link';
import { IconFolderBolt, IconLogout, IconMoonStars, IconSettings, IconSettingsAutomation, IconSun } from '@tabler/icons-react';
import { Text } from "@mantine/core"
import Image from "next/image"
import { observer } from 'mobx-react-lite';
import { useStore } from '@/helpers/state';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <>
      <main>
        <AppShell header={{ height: 60 }} padding="md">
          <AppShell.Header>
            <Group style={{ height: '100%' }} px="20" justify="space-between">
              <Link href="/">
                <Group>
                  <Image src={'/mew.png'} alt="Mew" width={50} height={50} />
                  <Title order={2}>
                    <Text
                      component="span"
                      variant="gradient"
                      gradient={{ from: 'pink.2', to: 'pink.4' }}
                      inherit>
                      MewTorrent
                    </Text>
                  </Title>
                </Group>
              </Link>
              <Group>
                <ActionIcon
                  variant="default"
                  onClick={() => toggleColorScheme()}
                  size={30}
                >
                  {colorScheme === 'dark' ? (
                    <IconSun size="1rem" />
                  ) : (
                    <IconMoonStars size="1rem" />
                  )}
                </ActionIcon>
                <UserNavigator />
              </Group>
            </Group>

          </AppShell.Header>
          <AppShell.Main className={classes.main}>
            {children}
          </AppShell.Main>
        </AppShell>
      </main>
    </>
  )
}

const UserNavigator = observer(() => {
  const store = useStore();
  const router = useRouter();

  const logout = React.useCallback(() => {
    localStorage.removeItem('token');
    store?.setUserInfo(undefined);
  }, [store]);

  return store?.userData ? (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Text style={{ cursor: 'pointer' }} fw={700}>
          {store.userData.username}
        </Text>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => router.push('/torrents')}
          leftSection={<IconFolderBolt size={14} />}
        >
          Torrents
        </Menu.Item>
        <Menu.Item
          onClick={() => router.push('/settings')}
          leftSection={<IconSettings size={14} />}
        >
          Settings
        </Menu.Item>
        {store?.userData.admin && (
          <Menu.Item
            onClick={() => router.push('/admin')}
            leftSection={<IconSettingsAutomation size={14} />}
          >
            Admin
          </Menu.Item>
        )}
        <Menu.Divider />
        <Menu.Item
          color="red"
          onClick={logout}
          leftSection={<IconLogout size={14} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : (
    <Link href="/login">
      <Button>Login</Button>
    </Link>
  );
});