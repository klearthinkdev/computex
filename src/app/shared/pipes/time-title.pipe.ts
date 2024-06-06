import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'timeTitle',
  standalone: true,
})
export class TimeTitlePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: string | number | Date): string {
    return formatDate(value, 'yyyy年M月d日 HH:mm:ss z', this.locale);
  }
}
