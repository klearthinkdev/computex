import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, formatNumber } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  EMPTY,
  Subject,
  catchError,
  combineLatest,
  takeUntil,
  tap,
} from 'rxjs';

// @angular/material
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { Feedback, FeedbackGroup, QUESTIONS } from './feedback.models';
import { Result } from '../../shared/models/result';
import { ResultCardComponent } from '../../shared/components/result-card/result-card.component';
import { TimeTitlePipe } from '../../shared/pipes';
import { DataService } from '../../shared/services/data.service';
import { compareDate, compareString } from '../../shared/services/utils';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    ResultCardComponent,
    TimeTitlePipe,
    MatBadgeModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './feedback.component.html',
})
export class FeedbackComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<null>();
  private viewInit$ = new Subject<null>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  acceptList: Array<string> = ['application/json'];

  // 資料
  dataSource = new MatTableDataSource<Feedback>([]);
  displayedColumns = [
    '#',
    ...[
      'create_account',
      'experience',
      'speed_and_accuracy',
      'user_interface',
      'business_comm',
      'exhibitions',
      'potential_revenue',
      'email',
      'create_time',
    ],
  ];

  // 分組
  feedbackListGrouped: Array<FeedbackGroup> = [];

  // 統計
  resultList: Array<Result> = [
    // 0: 使用帳戶
    {
      title: '使用帳戶',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '共',
      suffix: '組',
    },
    // 1: 問卷回覆
    {
      title: '問卷回覆',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '共',
      suffix: '筆',
    },
    // 2: 問卷得分
    {
      title: '問卷得分',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '平均',
      suffix: '分',
    },
    // 3: 使用體驗
    {
      title: '使用體驗',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '平均',
      suffix: '分',
      tooltip: QUESTIONS[0],
    },
    // 4: 速度與準確度
    {
      title: '速度與準確度',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '平均',
      suffix: '分',
      tooltip: QUESTIONS[1],
    },
    // 5: 介面操作
    {
      title: '介面操作',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '平均',
      suffix: '分',
      tooltip: QUESTIONS[2],
    },
    // 6: 商洽溝通
    {
      title: '商洽溝通',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '平均',
      suffix: '分',
      tooltip: QUESTIONS[3],
    },
    // 7: 參觀展覽
    {
      title: '參觀展覽',
      value: '0%',
      valueSize: 'text-7xl',
      tooltip: QUESTIONS[4],
    },
    // 8: 潛在營收
    {
      title: '潛在營收',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '平均',
      suffix: '分',
      tooltip: QUESTIONS[5],
    },
  ];

  scoreMapA: { [key: string]: string } = {
    [1]: 'bg-red-300',
    [2]: 'bg-red-100',
    [3]: 'bg-gray-100',
    [4]: 'bg-green-100',
    [5]: 'bg-green-300',
    [6]: 'bg-green-500',
  };
  scoreMapB: { [key: string]: string } = {
    [1]: 'bg-green-500',
    [0]: 'bg-red-500',
  };

  questions = QUESTIONS;
  questionTitleList = [
    '使用體驗',
    '速度與準確度',
    '介面操作',
    '商洽溝通',
    '參觀展覽',
    '潛在營收',
  ];

  fileReader = new FileReader();
  loading = false;
  selectedTabIndex = new FormControl(0);

  constructor(
    private matSnackBar: MatSnackBar,
    private dataService: DataService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.dataSource.sortData = this.sortData;
    this.fileReader.onload = (e) => {
      try {
        const data = JSON.parse(this.fileReader.result as string);

        this.dataService.feedbackList$.next(data);

        this.loading = false;
      } catch (error) {
        this.matSnackBar.open('檔案讀取失敗');

        this.clearDataAndFileInput();
      }
    };

    combineLatest([this.viewInit$, this.dataService.feedbackList$])
      .pipe(
        takeUntil(this.destroy$),
        tap(([viewInit, elementList]) => {
          elementList.forEach((element) => {
            element.experience += 3;
            element.speed_and_accuracy += 3;
            element.user_interface += 3;
            element.business_comm += 3;
            element.potential_revenue -= 1;
          });

          this.dataSource.data = elementList;

          if (elementList.length === 0) {
            this.selectedTabIndex.setValue(0);
          }

          this.feedbackListGrouped = elementList
            .reduce<Array<FeedbackGroup>>((grouped, element) => {
              const {
                create_account,
                experience,
                speed_and_accuracy,
                user_interface,
                business_comm,
                exhibitions,
                potential_revenue,
              } = element;

              const existing = grouped.find(
                (group) => group.create_account === create_account
              );

              if (existing !== undefined) {
                existing.experience_total += experience;
                existing.speed_and_accuracy_total += speed_and_accuracy;
                existing.user_interface_total += user_interface;
                existing.business_comm_total += business_comm;
                existing.exhibitions_total += exhibitions ? 1 : 0;
                existing.potential_revenue_total += potential_revenue;
                existing.feedback_list.push(element);
              } else {
                grouped.push({
                  create_account,
                  experience_total: experience,
                  speed_and_accuracy_total: speed_and_accuracy,
                  user_interface_total: user_interface,
                  business_comm_total: business_comm,
                  exhibitions_total: exhibitions ? 1 : 0,
                  potential_revenue_total: potential_revenue,
                  feedback_list: [element],
                });
              }

              return grouped;
            }, [])
            .sort((a, b) => compareString(a.create_account, b.create_account));

          // 統計
          setTimeout(() => {
            const totalCount = elementList.length;
            const totalObj = this.feedbackListGrouped.reduce(
              (obj, group) => {
                obj.experience += group.experience_total;
                obj.speed_and_accuracy += group.speed_and_accuracy_total;
                obj.user_interface += group.user_interface_total;
                obj.business_comm += group.business_comm_total;
                obj.exhibitions += group.exhibitions_total;
                obj.potential_revenue += group.potential_revenue_total;

                return obj;
              },
              {
                experience: 0,
                speed_and_accuracy: 0,
                user_interface: 0,
                business_comm: 0,
                exhibitions: 0,
                potential_revenue: 0,
              }
            );

            const averageObj = {
              experience: totalObj.experience / totalCount,
              speed_and_accuracy: totalObj.speed_and_accuracy / totalCount,
              user_interface: totalObj.user_interface / totalCount,
              business_comm: totalObj.business_comm / totalCount,
              potential_revenue: totalObj.potential_revenue / totalCount,
            };

            this.resultList[0].value = `${this.feedbackListGrouped.length}`;
            this.resultList[1].value = `${totalCount}`;
            this.resultList[2].value = `${formatNumber(
              (averageObj.experience +
                averageObj.speed_and_accuracy +
                averageObj.user_interface +
                averageObj.business_comm +
                averageObj.potential_revenue) /
                5,
              this.locale,
              '1.2-2'
            )}`;
            this.resultList[3].value = `${formatNumber(
              averageObj.experience,
              this.locale,
              '1.2-2'
            )}`;
            this.resultList[4].value = `${formatNumber(
              averageObj.speed_and_accuracy,
              this.locale,
              '1.2-2'
            )}`;
            this.resultList[5].value = `${formatNumber(
              averageObj.user_interface,
              this.locale,
              '1.2-2'
            )}`;
            this.resultList[6].value = `${formatNumber(
              averageObj.business_comm,
              this.locale,
              '1.2-2'
            )}`;
            this.resultList[7].value = `${formatNumber(
              (totalObj.exhibitions / totalCount) * 100,
              this.locale,
              '1.2-2'
            )}%`;
            this.resultList[8].value = `${formatNumber(
              averageObj.potential_revenue,
              this.locale,
              '1.2-2'
            )}`;
          });
        }),
        catchError((err) => {
          this.matSnackBar.open('數據解析失敗');

          this.clearDataAndFileInput();

          return EMPTY;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.viewInit$.next(null);
    this.viewInit$.complete();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.item(0);

    if (file === undefined || file === null) {
      this.clearData();

      return;
    }

    if (!this.acceptList.includes(file.type)) {
      this.matSnackBar.open('非法的檔案格式，請重新選擇檔案');

      this.clearDataAndFileInput();

      return;
    }

    this.loading = true;
    this.fileReader.readAsText(file);
  }

  clearData(): void {
    this.dataService.feedbackList$.next([]);
  }

  clearDataAndFileInput(): void {
    this.clearData();

    this.fileInput.nativeElement.value = '';
  }

  sortData(
    data: Array<Feedback>,
    { active, direction }: MatSort
  ): Array<Feedback> {
    if (active === undefined || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let value = 0;

      switch (active) {
        case 'experience':
          value = a.experience - b.experience;
          break;
        case 'speed_and_accuracy':
          value = a.speed_and_accuracy - b.speed_and_accuracy;
          break;
        case 'user_interface':
          value = a.user_interface - b.user_interface;
          break;
        case 'business_comm':
          value = a.business_comm - b.business_comm;
          break;
        case 'exhibitions':
          value = +a.exhibitions - +b.exhibitions;
          break;
        case 'potential_revenue':
          value = a.potential_revenue - b.potential_revenue;
          break;
        case 'email':
          value = compareString(a.email ?? '', b.email ?? '');
          break;
        case 'create_account':
          value = compareString(a.create_account, b.create_account);
          break;
        case 'create_time':
          value = compareDate(a.create_time.$date, b.create_time.$date);
          break;
      }

      return value * (direction === 'asc' ? 1 : -1);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
