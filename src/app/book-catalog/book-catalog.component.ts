import {AfterViewInit, Component, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
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
import {catchError, debounceTime, distinctUntilChanged, EMPTY, map, merge, Subject, takeUntil, tap} from 'rxjs';
import {BooksRequest } from '../models/books-request';
import {MatFormField} from '@angular/material/form-field';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { BookSearch } from '../models/book-search';
import {openAddBookDialog} from '../add-book-dialog/add-book-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-book-catalog',
  imports: [
    MatTableModule, MatTable, MatHeaderCell, MatCell, MatHeaderRow, MatRow,
    MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCellDef, MatPaginator,
    MatSort, MatSortModule, CommonModule, MatInputModule, MatFormFieldModule,
    AsyncPipe, MatFormField, FormsModule, ReactiveFormsModule ],
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
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);

  searchForm = this.fb.group<BookSearch>({
    title: new FormControl('', {nonNullable: true}),
    author: new FormControl('', {nonNullable: true}),
    genre: new FormControl('', {nonNullable: true}),
  });
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroyed$ = new Subject<void>();

  ngOnInit() {
    this.dataSource = new BooksDataSource(this.booksService);
    this.loadBooks();
  }
  ngAfterViewInit() {
    const triggers$ = merge(
      this.paginator.page.pipe(map(() => ({type: 'page'}))),
      this.sort.sortChange.pipe(map(() => ({type: 'sort'}))),
      this.searchForm.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        map(() => ({ type: 'search' }))
      )
    ).pipe(
      tap(async ({type}) => {
        if (type !== 'page') {
          this.paginator.pageIndex = 0;
        }
        await this.loadBooks();
      }),
      catchError(error => {
        console.error('Error loading lessons:', error);
        return EMPTY;
      }),
      takeUntil(this.destroyed$)
    );
    triggers$.subscribe();
  }

  async onAddCourse() {
    const newBookUrl= await openAddBookDialog(
      this.dialog,
      {
        id: 0,
        title: "Book 1",
        author: "",
        genre: ""
      }
    )
    if (!newBookUrl) {
      return;
    }
    await this.loadBooks();
  }

  private async loadBooks() {
    console.log("loading books")
    const sortDirection = this.sort?.direction ?? 'asc';
    const searchCriteria = this.searchForm.controls as BookSearch;
    const req: BooksRequest = {
      pageIndex: this.paginator?.pageIndex ?? 0,
      pageSize: this.paginator?.pageSize ?? 3,
      orderBy: this.sort?.active ?? 'title',
      isAscending: sortDirection === 'asc' ? true : false,
      titleSearch: searchCriteria.title?.value ?? '',
      authorSearch: searchCriteria.author?.value ?? '',
      genreSearch: searchCriteria.genre?.value ?? ''
    }
    await this.dataSource.loadBooks(req);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
