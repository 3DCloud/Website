import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'isInvalid',
  pure: false,
})
export class IsInvalidPipe implements PipeTransform {
  public transform(value: AbstractControl | null | undefined): boolean {
    if (!value) {
      return true;
    }

    return value.invalid && (value.touched || value.dirty);
  }
}
