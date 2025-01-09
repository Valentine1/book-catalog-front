import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BooksResponse} from '../models/books-response';
import {BooksRequest} from '../models/books-request';

@Injectable()
export class BooksService {
  http = inject(HttpClient);

  loadBooks(req: BooksRequest):  Observable<BooksResponse> {

    console.log("http start: ");
    return this.http.get<BooksResponse>('books', {
      params: new HttpParams()
        .set('PageIndex', req.pageIndex.toString())
        .set('PageSize', req.pageSize.toString())
    });
  }
}
