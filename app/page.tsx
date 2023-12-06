import { Container, Flex } from '@radix-ui/themes';

import { BlockTable, GasTracker } from '@/components';

function Home() {
  return (
    <main>
      <Container>
        <Flex direction="column" gap="6">
          <GasTracker />
          <BlockTable />
        </Flex>
      </Container>
    </main>
  );
}

export default Home;
