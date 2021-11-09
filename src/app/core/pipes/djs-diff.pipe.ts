import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'djsDiff',
})
export class DjsDiffPipe implements PipeTransform {
  public transform(
    value: string | Date | dayjs.Dayjs,
    ...args: unknown[]
  ): number {
    if (!args.length) {
      throw new Error('Missing argument');
    }

    if (
      typeof args[0] !== 'string' &&
      !(args[0] instanceof Date) &&
      !(args[0] instanceof dayjs.Dayjs)
    ) {
      throw new Error('Expected first argument to be string, Date, or Dayjs');
    }

    return dayjs(args[0]).diff(value);
  }
}
