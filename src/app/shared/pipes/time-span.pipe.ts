import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeSpan',
  standalone: true,
})
export class TimeSpanPipe implements PipeTransform {
  transform(value: number, fractionDigits = 1, alignEnd = false): string {
    let result = '';
    const seconds = value / 1000;

    const m = `${Math.floor(seconds / 60)}`
      .padStart(3, 'x')
      .replaceAll('x', alignEnd ? '&nbsp;' : '');
    const s = (seconds % 60)
      .toFixed(fractionDigits)
      .padStart(3 + fractionDigits, 'x')
      .replaceAll('x', alignEnd ? '&nbsp;' : '');

    result =
      m === (alignEnd ? '&nbsp;&nbsp;0' : '0')
        ? `${
            alignEnd ? '&nbsp;&nbsp;&nbsp;&nbsp;&#12288;&nbsp;' : ''
          }${s}&nbsp;秒`
        : `${m}&nbsp;分&nbsp;${s}&nbsp;秒`;

    return result;
  }
}
