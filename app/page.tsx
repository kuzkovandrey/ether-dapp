import { Container, Flex } from '@radix-ui/themes';

import { BlockTable, GasTracker, Wallet } from '@/components';

function Home() {
  return (
    <main>
      <Container>
        <Flex direction="column" gap="6">
          <Wallet />
          <GasTracker />
          <BlockTable />
        </Flex>
      </Container>
    </main>
  );
}

export default Home;
