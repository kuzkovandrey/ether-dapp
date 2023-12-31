import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { Flex, IconButton, Text } from '@radix-ui/themes';

export type PaginationProps = {
  page: number;
  pages: number;
  onNext: () => void;
  onPrev: () => void;
};

function Pagination({ page, pages, onNext, onPrev }: PaginationProps) {
  const isDisabledPrev = page === 1 || pages <= 1;
  const isDisabledNext = pages <= 1 || page === pages;

  return (
    <Flex data-testid="pagination" align="center" gap="4">
      <IconButton data-testid="prev-button" size="2" disabled={isDisabledPrev} onClick={onPrev}>
        <ArrowLeftIcon />
      </IconButton>
      <Text data-testid="pages-text" size="2" weight="bold">
        {page} / {pages}
      </Text>
      <IconButton data-testid="next-button" size="2" disabled={isDisabledNext} onClick={onNext}>
        <ArrowRightIcon />
      </IconButton>
    </Flex>
  );
}

export default Pagination;
