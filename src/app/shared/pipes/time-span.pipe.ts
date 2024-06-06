import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeSpan',
  standalone: true,
})
export class TimeSpanPipe implements PipeTransform {
  transform(value: number, fractionDigits = 1): string {
    const seconds = value / 1000;

    const mmm = `${Math.floor(seconds / 60)}`.padStart(3, ' ');
    const ss_s = (seconds % 60).toFixed(fractionDigits).padStart(4, ' ');

    return mmm === '  0' ? `${ss_s} 秒` : `${mmm} 分 ${ss_s} 秒`;
  }
}
