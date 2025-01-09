import {Book} from './book';

export interface BooksResponse {
  books: Book[];
  totalCount: number;
}
