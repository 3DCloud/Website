import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'isInvalid',
  pure: false,
})
export class IsInvalidPipe implements PipeTransform {
  transform(value: FormControl): boolean {
    return value.invalid && (value.touched || value.dirty);
  }
}
