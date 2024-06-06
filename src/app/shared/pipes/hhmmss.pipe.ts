import { Pipe, PipeTransform } from '@angular/core';

export function hhmmss(value: number): string {
  const seconds = value / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;

  const hh = `${Math.floor(hours)}`;
  const mm = (minutes % 60).toFixed(0).padStart(2, '0');
  const ss = (seconds % 60).toFixed(0).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}

@Pipe({
  name: 'hhmmss',
  standalone: true,
})
export class HhmmssPipe implements PipeTransform {
  transform(value: number): string {
    return hhmmss(value);
  }
}
