import { Container, Flex } from '@radix-ui/themes';

import { BlockTable, GasTracker, TokenEvents, Wallet } from '@/components';

function Home() {
  return (
    <main>
      <Container>
        <Flex direction="column" gap="6">
          <Wallet />
          <GasTracker />
          <BlockTable />
          <TokenEvents />
        </Flex>
      </Container>
    </main>
  );
}

export default Home;
