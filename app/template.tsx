import { Container, Flex, Heading } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';

function Template({ children }: PropsWithChildren) {
  return (
    <Container style={{ padding: '1rem' }}>
      <Flex direction="column" gap="6">
        <header>
          <Flex gap="4" justify="between" align="center" width="100%">
            <Heading color="amber">Eth DApp</Heading>
          </Flex>
        </header>
        {children}
      </Flex>
    </Container>
  );
}

export default Template;
