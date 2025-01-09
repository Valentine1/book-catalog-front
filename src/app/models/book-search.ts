import {FormControl} from '@angular/forms';

export interface BookSearch {
  title?: FormControl<string>;
  author?: FormControl<string>;
  genre?: FormControl<string>;
}
