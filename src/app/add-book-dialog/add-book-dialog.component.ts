import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {Book} from '../models/book';
import {BooksService} from '../services/books.service';
import {catchError, firstValueFrom, map, of} from 'rxjs';
import {BookCreateRequest} from '../models/book-create-request';

@Component({
  selector: 'app-add-book-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './add-book-dialog.component.html',
  standalone: true,
  styleUrl: './add-book-dialog.component.scss'
})
export class AddBookDialogComponent {
  dialogRef = inject(MatDialogRef);
  booksService =inject(BooksService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    title: [''],
    author: [''],
    genre: ['']
  });

  async createBook() {
    const bookReq: BookCreateRequest = {
        book: this.form.value as Partial<Book>
    };

    const bookUrl = await firstValueFrom(
      this.booksService.createBook(bookReq).pipe(
        map(resp =>  resp.headers.get('Location')),
        catchError((error) => {
          console.log(error);
          return of('');
        } )
      )
    );
    this.dialogRef.close(bookUrl);
  }

  close() {
    this.dialogRef.close();
  }

}

export async function openAddBookDialog(
  dialog: MatDialog) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width  = "400px";

  const result$ = dialog.open(
    AddBookDialogComponent,
    config)
    .afterClosed();

  return firstValueFrom(result$);
}
