import { appRoutes } from "@/shared";
import { Container, Flex, Heading, Link } from "@radix-ui/themes";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

const routes = Object.values(appRoutes);

function Template({ children }: PropsWithChildren) {
  return (
    <Container style={{ padding: "1rem" }}>
      <Flex direction="column" gap="6">
        <header>
          <Flex gap="4" justify="between" align="center" width="100%">
            <Heading color="amber">Eth DApp</Heading>
            <Flex gap="4">
              {routes.map(({ href, name }, key) => (
                <Link color="yellow" key={key} href={href}>
                  {name}
                </Link>
              ))}
            </Flex>
          </Flex>
        </header>
        {children}
      </Flex>
    </Container>
  );
}

export default Template;
