export interface BooksRequest {
  pageIndex: number;
  pageSize: number;
  orderBy: string;
  isAscending: boolean;
  titleSearch: string;
  authorSearch: string;
  genreSearch: string;
}
