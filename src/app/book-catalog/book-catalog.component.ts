import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable, MatTableModule
} from '@angular/material/table';
import {BooksDataSource} from '../services/books.datasource';
import {BooksService} from '../services/books.service';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort, MatSortModule } from "@angular/material/sort";
import {AsyncPipe, CommonModule} from '@angular/common';
import {catchError, EMPTY, map, merge, Subject, takeUntil, tap} from 'rxjs';
import {BooksRequest } from '../models/books-request';

@Component({
  selector: 'app-book-catalog',
  imports: [
    MatTableModule, MatTable, MatHeaderCell, MatCell, MatHeaderRow, MatRow,
    MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCellDef, MatPaginator,
    MatSort, MatSortModule, CommonModule,
    AsyncPipe],
  templateUrl: './book-catalog.component.html',
  providers: [
    { provide: BooksService, useClass: BooksService }
  ],
  standalone: true,
  styleUrl: './book-catalog.component.css'
})
export class BookCatalogComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource!: BooksDataSource;
  displayedColumns = ['title', 'author', 'genre'];

  booksService = inject(BooksService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroyed$ = new Subject<void>();

  ngOnInit() {

    this.dataSource = new BooksDataSource(this.booksService);
    this.loadBooks();
  }

  ngAfterViewInit() {
    const triggers$ = merge(
      this.paginator.page.pipe(map(() => ({type: 'page'})))
    ).pipe(
      tap(({type}) => {
        if (type !== 'page') {
          this.paginator.pageIndex = 0;
        }
        this.loadBooks();
      }),
      catchError(error => {
        console.error('Error loading lessons:', error);
        return EMPTY;
      }),
      takeUntil(this.destroyed$)
    );
    triggers$.subscribe();
  }
  private loadBooks() {
    console.log("loading books")
    if (this.paginator) {
      console.log("page index " + this.paginator.pageIndex);
    }
    const req: BooksRequest = {
      pageIndex: this.paginator?.pageIndex ?? 0,
      pageSize: this.paginator?.pageSize ?? 3
    }
    this.dataSource.loadBooks(req);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
