import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'djsTimeAgo',
})
export class DjsTimeAgoPipe implements PipeTransform {
  public transform(value: Date | dayjs.Dayjs, ...args: unknown[]): string {
    let withoutSuffix = false;

    if (args.length >= 1) {
      withoutSuffix = Boolean(args[0]);
    }

    return dayjs(value).fromNow(withoutSuffix);
  }
}
