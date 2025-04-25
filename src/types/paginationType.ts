export interface PaginationButtonProps {
  page: number;
  startPage: number;
  endPage: number;
  hasPreviousGroup: boolean;
  hasNextGroup: boolean;
  onPageButtonClick: (page: number) => void;
  onPreviousGroupButtonClick: () => void;
  onNextGroupButtonClick: () => void;
}
