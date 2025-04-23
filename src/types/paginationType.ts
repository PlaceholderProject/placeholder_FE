export interface PaginationButtonProps {
  page: number;
  startPage: number;
  endPage: number;
  hasPreviousGroup: boolean;
  hasNextGroup: boolean;
  onPageButtonClick: () => void;
  onPreviousGroupButtonClick: () => void;
  onNextGroupButtonClick: () => void;
}
