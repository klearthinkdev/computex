import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { MatTooltipModule } from '@angular/material/tooltip';

import { Feedback } from '../feedback.models';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [NgClass, MatTooltipModule],
  templateUrl: './score.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent implements OnChanges {
  @Input() name!:
    | 'experience'
    | 'speed_and_accuracy'
    | 'user_interface'
    | 'business_comm'
    | 'exhibitions'
    | 'potential_revenue';
  @Input() feedback!: Feedback;

  classList: string = '';
  tooltip: string = '';
  score: number = 0;
  showScore: boolean = true;

  classListObjA: { [key: string]: string } = {
    [1]: 'bg-red-300',
    [2]: 'bg-red-100',
    [3]: 'bg-gray-100',
    [4]: 'bg-green-100',
    [5]: 'bg-green-300',
  };
  classListObjB: { [key: string]: string } = {
    [0]: 'bg-red-500',
    [1]: 'bg-green-500',
  };
  classListObjC: { [key: string]: string } = {
    [0]: 'bg-red-300',
    [1]: 'bg-red-100',
    [2]: 'bg-gray-100',
    [3]: 'bg-green-100',
    [4]: 'bg-green-300',
    [5]: 'bg-green-500',
  };

  tooltipObjA: { [key: string]: string } = {
    [1]: '非常不滿意',
    [2]: '不滿意',
    [3]: '一般',
    [4]: '滿意',
    [5]: '非常滿意',
  };
  tooltipObjB: { [key: string]: string } = {
    [1]: '非常複雜',
    [2]: '複雜',
    [3]: '一般',
    [4]: '簡便',
    [5]: '非常簡便',
  };
  tooltipObjC: { [key: string]: string } = {
    [1]: '非常不同意',
    [2]: '不同意',
    [3]: '一般',
    [4]: '同意',
    [5]: '非常同意',
  };
  tooltipObjD: { [key: string]: string } = {
    [0]: '否',
    [1]: '是',
  };
  tooltipObjE: { [key: string]: string } = {
    [0]: '低於 10 萬美元',
    [1]: '10 萬美元',
    [2]: '50 萬美元',
    [3]: '100 萬美元',
    [4]: '500 萬美元',
    [5]: '高於 1,000 萬美元',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name'] || changes['feedback']) {
      this.update(
        changes['name'].currentValue,
        changes['feedback'].currentValue
      );
    }
  }

  update(name: typeof this.name, feedback: Feedback): void {
    switch (name) {
      case 'experience':
      case 'speed_and_accuracy':
        this.score = feedback[name];
        this.classList = this.classListObjA[this.score];
        this.tooltip = this.tooltipObjA[this.score];
        break;
      case 'user_interface':
        this.score = feedback[name];
        this.classList = this.classListObjA[this.score];
        this.tooltip = this.tooltipObjB[this.score];
        break;
      case 'business_comm':
        this.score = feedback[name];
        this.classList = this.classListObjA[this.score];
        this.tooltip = this.tooltipObjC[this.score];
        break;
      case 'exhibitions':
        this.score = +feedback[name];
        this.classList = this.classListObjB[this.score];
        this.tooltip = this.tooltipObjD[this.score];

        this.showScore = false;
        break;
      case 'potential_revenue':
        this.score = feedback[name];
        this.classList = this.classListObjC[this.score];
        this.tooltip = this.tooltipObjE[this.score];
        break;
      default:
        this.showScore = true;
    }
  }
}
