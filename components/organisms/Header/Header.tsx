'use client';

import { Flex, Heading, Switch, Text } from '@radix-ui/themes';

import { useAppStore } from '@/store';

function Header() {
  const { theme, setTheme } = useAppStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header>
      <Flex gap="4" justify="between" align="center" width="100%">
        <Heading color="amber">Eth App</Heading>
        <Text as="label" size="2">
          <Flex gap="2">
            {theme} <Switch onClick={toggleTheme} color="amber" checked={theme === 'dark'} />
          </Flex>
        </Text>
      </Flex>
    </header>
  );
}

export default Header;
