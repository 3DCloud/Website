import { Pipe, PipeTransform } from '@angular/core';
import { ForcedSubject, subject } from '@casl/ability';

@Pipe({
  name: 'subject',
})
export class SubjectPipe<
  T extends string,
  U extends Record<PropertyKey, unknown>
> implements PipeTransform
{
  public transform(object: U, type: T): U & ForcedSubject<T> {
    return subject<T, U>(type, object);
  }
}
