import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'djsDateFormat',
})
export class DjsDateFormatPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string {
    if (args.length !== 1 || typeof args[0] !== 'string') {
      throw new Error('Expected format to be a string');
    }

    return dayjs().format(args[0] as string);
  }
}