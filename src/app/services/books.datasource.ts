import {Book} from '../models/book';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable} from 'rxjs';
export class BooksDataSource implements DataSource<Book> {

  private booksSubject = new BehaviorSubject<Book[]>([]);

  constructor() {

  }

  public loadBooks() {
    console.log(BOOKS);
    this.booksSubject.next(BOOKS)
  }

  connect(collectionViewer: CollectionViewer): Observable<Book[]> {
    console.log("Connecting data source");
    return this.booksSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.booksSubject.complete();
  }

}

const BOOKS: Book[] = [
  {
    id: 1,
    title: "A Hero of Our Time",
    author: "Mikhail Lermontov",
    genre: "Literary Fiction"
  },
  {
    id: 2,
    title: "Aelita",
    author: "Alexey Tolstoy",
    genre: "Science Fiction"
  },
  {
    id: 3,
    title: "The Novice",
    author: "Mikhail Lermontov",
    genre: "Thriller"
  },
  {
    id: 4,
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    genre: "Classic Romance"
  },
  {
    id: 5,
    title: "Solaris",
    author: "Stanislav Lem",
    genre: "Science Fiction"
  },
  {
    id: 6,
    title: "The Master and Margarita",
    author: "Mikhail Bulgakov",
    genre: "Classic Romance"
  },
  {
    id: 7,
    title: "Doctor Zhivago",
    author: "Boris Pasternak",
    genre: "Classic Romance"
  },
  {
    id: 8,
    title: "Dog’s Heart",
    author: "Mikhail Bulgakov",
    genre: "Science Fiction"
  },
  {
    id: 9,
    title: "From Russia with Love (James Bond)",
    author: "Ian Fleming",
    genre: "Thriller"
  },
  {
    id: 10,
    title: "War and Peace",
    author: "Leo Tolstoy",
    genre: "Classic Romance"
  }
]
