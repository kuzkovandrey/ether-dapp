import { Button, Flex, Text } from '@radix-ui/themes';

type PaginationProps = {
  page: number;
  pages: number;
  onNext: () => void;
  onPrev: () => void;
};

function Pagination({ page, pages, onNext, onPrev }: PaginationProps) {
  const isDisabledPrev = page === 1 || pages <= 1;
  const isDisabledNext = pages <= 1 || page === pages;

  return (
    <Flex align="center" gap="4">
      <Button disabled={isDisabledPrev} onClick={onPrev}>
        {'<'}
      </Button>
      <Text>
        {page} / {pages}
      </Text>
      <Button disabled={isDisabledNext} onClick={onNext}>
        {'>'}
      </Button>
    </Flex>
  );
}

export default Pagination;
