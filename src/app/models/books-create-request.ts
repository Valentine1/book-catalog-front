import {Book} from './book';

export interface BooksCreateRequest {
  books: Partial<Book>[];
}
