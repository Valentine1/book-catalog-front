import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-book-catalog',
  imports: [MatTableModule, MatTable, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCellDef],
  templateUrl: './book-catalog.component.html',
  standalone: true,
  styleUrl: './book-catalog.component.css'
})
export class BookCatalogComponent implements OnInit{
  dataSource!: BooksDataSource;
  displayedColumns = ['title', 'author', 'genre'];

  ngOnInit() {
    this.dataSource = new BooksDataSource();
    this.dataSource.loadBooks();
  }
}
