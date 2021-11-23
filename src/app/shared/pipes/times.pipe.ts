import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'times' })
export class TimesPipe implements PipeTransform {
  public transform(maximum: number): Iterable<number> {
    return <Iterable<number>>{
      [Symbol.iterator]: function* () {
        let n = 0;
        while (n < maximum) {
          yield n++;
        }
      },
    };
  }
}
