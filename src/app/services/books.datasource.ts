import {Book} from '../models/book';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, catchError, firstValueFrom, Observable, of} from 'rxjs';
import {BooksService} from './books.service';
import {BooksResponse} from '../models/books-response';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BooksRequest} from '../models/books-request';
export class BooksDataSource implements DataSource<Book> {

  private booksSubject = new BehaviorSubject<Book[]>([]);
  private totalCountSubject = new BehaviorSubject<number>(0);

  public totalCount$ = this.totalCountSubject.asObservable();
  constructor(private booksService: BooksService) {
  }

  public async loadBooks(req: BooksRequest) {
    const resp = await firstValueFrom(
      this.booksService.loadBooks(req).pipe(
        catchError((error) => {
          console.log(error);
          return of({books: [], totalCount: 0});
        })
      )
    );
    this.totalCountSubject.next(resp.totalCount);
    this.booksSubject.next(resp.books);
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
