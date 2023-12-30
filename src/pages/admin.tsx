import { withAuthentication } from '../helpers/authenticated';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Pagination,
  Stack,
  Table,
  Title,
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import api, { Page, RegistrationCode, showError } from '@/helpers/api';
import { IconCopy, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useClipboard, useDisclosure } from '@mantine/hooks';

const Admin = () => {
  const [codes, setCodes] = useState<Page<RegistrationCode> | null>(null);

  const codePage = useCallback((page: number) => {
    api.listCodes(page).then(setCodes).catch(showError);
  }, []);

  const deleteCode = useCallback(
    (code: RegistrationCode) => {
      api
        .deleteCode(code.id)
        .then(() => {
          notifications.show({
            title: 'Deleted code!',
            message: `Deleted code: ${code.code}`,
          });

          codePage(1);
        })
        .catch(showError);
    },
    [codePage],
  );

  useEffect(() => {
    codePage(1);
  }, [codePage]);

  const [codeModalOpened, codeModalControl] = useDisclosure(false);

  const createCode = useCallback(
    (uses: number) => {
      api
        .createCode(uses)
        .then(() => {
          notifications.show({
            title: 'Created code!',
            message: `Created code with ${uses ? uses : 'unlimited'} uses`,
          });

          codeModalControl.close();
          codePage(1);
        })
        .catch(showError);
    },
    [codeModalControl, codePage],
  );

  const clipboard = useClipboard();

  return (
    <Stack>
      <Title>Admin</Title>
      <Divider />
      <Stack>
        <Title order={2}>Registration Codes</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Code</Table.Th>
              <Table.Th>Uses</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(codes as any)?.items?.map((code: RegistrationCode) => (
              <Table.Tr key={code.id}>
                <Table.Td>{code.code}</Table.Td>
                <Table.Td>{code.uses || '∞'}</Table.Td>
                <Table.Td>{code.createdAt}</Table.Td>
                <Table.Td>
                  <Group>
                    <ActionIcon
                      variant="default"
                      onClick={() => deleteCode(code)}
                      size={30}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                    <ActionIcon
                      variant="default"
                      onClick={() => {
                        clipboard.copy(code.code);
                        notifications.show({
                          title: 'Copied',
                          message: `Copied ${code.code} to clipboard.`,
                        });
                      }}
                      size={30}
                    >
                      <IconCopy size="1rem" />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Pagination
          value={codes?.page}
          onChange={codePage}
          total={codes?.totalPages || 1}
        />
        <CreateRegistrationModal
          onSubmit={createCode}
          onClose={codeModalControl.close}
          opened={codeModalOpened}
        />
        <Button w={'120px'} onClick={() => codeModalControl.open()}>
          Create Code
        </Button>
      </Stack>
    </Stack>
  );
};

const CreateRegistrationModal: React.FC<{
  onSubmit: (uses: number) => void;
  onClose: () => void;
  opened: boolean;
}> = ({ onSubmit, onClose, opened }) => {
  const [uses, setUses] = useState<number>(1);

  return (
    <Modal opened={opened} onClose={onClose} title="Create registration code">
      <NumberInput
        placeholder="Uses"
        label="Code uses"
        withAsterisk
        value={uses}
        onChange={(value) => setUses(Number(value))}
      />

      <Group align="right" mt="md">
        <Button
          type="submit"
          onClick={() => {
            onSubmit(uses);
            onClose();
          }}
        >
          Create Code
        </Button>
      </Group>
    </Modal>
  );
};

export default withAuthentication(Admin, true);