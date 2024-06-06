import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userAgentHTML',
  standalone: true,
})
export class UserAgentHTMLPipe implements PipeTransform {
  transform(value: string | null): string {
    return (value ?? '').replace(/\) /g, ') <br />');
  }
}
