import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BookCatalogComponent} from './book-catalog/book-catalog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BookCatalogComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
