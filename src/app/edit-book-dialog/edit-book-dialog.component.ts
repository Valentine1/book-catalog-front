import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {Book} from '../models/book';
import {BooksService} from '../services/books.service';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {catchError, firstValueFrom, map, of, tap} from 'rxjs';
import {BookUpdateRequest} from '../models/book-update-request';

@Component({
  selector: 'app-edit-book-dialog',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './edit-book-dialog.component.html',
  styleUrl: './edit-book-dialog.component.scss'
})
export class EditBookDialogComponent {
  dialogRef = inject(MatDialogRef);
  data: Book = inject(MAT_DIALOG_DATA);
  booksService =inject(BooksService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    title: [''],
    author: [''],
    genre: ['']
  });

  constructor() {
    this.form.patchValue({
      title: this.data?.title,
      author: this.data?.author,
      genre: this.data?.genre
    });
  }

  async updateBook() {
    const bookReq: BookUpdateRequest = {
      book: {
        ...this.form.value,
        id: this.data.id
      } as Book
    }

    const bookEditStatus = await firstValueFrom(
      this.booksService.updateBook(bookReq).pipe(
        tap(resp => {
          if(resp.status === 404) {
            console.error("Book not found, request status " + resp.status)
          }
        }),
        map(resp => resp.body['isSuccess']),
        catchError((error) => {
          console.error(error);
          return of(false);
        } )
      )
    );
    this.dialogRef.close(bookEditStatus);
  }

  close() {
    this.dialogRef.close();
  }
}

export async function openEditBookDialog(
  dialog: MatDialog,
  data: Book) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width  = "400px";
  config.data = data;

  const result$ = dialog.open(
    EditBookDialogComponent,
    config)
    .afterClosed();

  return firstValueFrom(result$);
}
