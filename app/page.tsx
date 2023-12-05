import { Container } from '@radix-ui/themes';

import { GasTracker } from '@/components';

function Home() {
  return (
    <main>
      <Container>
        <GasTracker />
      </Container>
    </main>
  );
}

export default Home;
