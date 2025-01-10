import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BooksResponse} from '../models/books-response';
import {BooksRequest} from '../models/books-request';
import {Book} from '../models/book';
import {BookCreateRequest} from '../models/book-create-request';
import {BookUpdateRequest} from '../models/book-update-request';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  http = inject(HttpClient);

  loadBooks(req: BooksRequest):  Observable<BooksResponse> {

    console.log("http start: ");
    return this.http.get<BooksResponse>('books', {
      params: new HttpParams()
        .set('pageIndex', req.pageIndex.toString())
        .set('pageSize', req.pageSize.toString())
        .set('orderBy', req.orderBy)
        .set('isAscending', req.isAscending)
        .set('titleSearch', req.titleSearch)
        .set('authorSearch', req.authorSearch)
        .set('genreSearch', req.genreSearch)
    });
  }

  createBook(req: BookCreateRequest) : Observable<HttpResponse<any>> {
    return this.http.post<any>('books', req, { observe: 'response' });
  }

  updateBook(req: BookUpdateRequest) : Observable<HttpResponse<any>> {
    return this.http.put<any>('books', req, { observe: 'response' });
  }

}
