import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appStopClickPropagation]',
  standalone: true,
})
export class StopClickPropagationDirective {
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('dblclick', ['$event'])
  onDblClick(event: Event): void {
    event.stopPropagation();
  }
}
