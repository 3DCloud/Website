import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'djsDuration',
})
export class DjsDurationPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    if (args[0]) {
      if (value > 1_000 * 60 * 60) {
        return dayjs.duration(value).format('H [hours], m [minutes]');
      } else if (value >= 1_000 * 60) {
        return dayjs.duration(value).format('m [minutes]');
      } else {
        return 'Less than 1 minute';
      }
    } else {
      if (value > 1_000 * 60 * 60) {
        return dayjs.duration(value).format('H[h] m[m] s[s]');
      } else if (value > 1_000 * 60) {
        return dayjs.duration(value).format('m[m] s[s]');
      } else {
        return dayjs.duration(value).format('s[s]');
      }
    }
  }
}
