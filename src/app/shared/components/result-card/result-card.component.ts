import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// @angular/material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Result } from '../../models/result';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [NgClass, MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './result-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultCardComponent {
  @Input() result!: Result;
}
