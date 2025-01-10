import {Book} from './book';

export interface BookCreateRequest {
  book: Partial<Book>;
}
