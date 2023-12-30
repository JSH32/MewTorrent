import { Container, Stack, Title, Text } from "@mantine/core"

const HomePage = () => {
  return (
    <Container size={700} my={40}>
      <Stack gap="lg">
        <Title size="h1">
          Open-source, web-based{' '}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: 'pink.2', to: 'pink.4' }}
            inherit
          >
            torrent
          </Text>{' '}
          client.
        </Title>

        <Text size="xl" c="dimmed">
          Download and share torrents with your friends from the web browser.
          No VPN required.
        </Text>
      </Stack>
    </Container>
  )
}

export default HomePage;