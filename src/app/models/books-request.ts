export interface BooksRequest {
  pageIndex: number;
  pageSize: number;
  orderBy: string;
  isAscending: boolean;
}
