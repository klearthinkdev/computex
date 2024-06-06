import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Subject,
  catchError,
  combineLatest,
  takeUntil,
  tap,
} from 'rxjs';

// @angular/material
import { MediaMatcher } from '@angular/cdk/layout';
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

import {
  LOG_TYPE_OBJ,
  StreamLog,
  StreamLogPair,
  StreamLogPairGroup,
} from './stream-log.models';
import { Result } from '../../shared/models/result';
import { ResultCardComponent } from '../../shared/components/result-card/result-card.component';
import {
  hhmmss,
  TimeSpanPipe,
  TimeTitlePipe,
  UserAgentHTMLPipe,
} from '../../shared/pipes';
import { DataService } from '../../shared/services/data.service';
import { compareDate, compareString } from '../../shared/services/utils';

@Component({
  selector: 'app-stream-log',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    ResultCardComponent,
    TimeSpanPipe,
    TimeTitlePipe,
    UserAgentHTMLPipe,
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
  templateUrl: './stream-log.component.html',
})
export class StreamLogComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<null>();
  private viewInit$ = new Subject<null>();
  private _SMQueryListener = () => this.changeDetectorRef.detectChanges();

  SMQuery: MediaQueryList = this.media.matchMedia('(min-width: 600px)');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  acceptList: Array<string> = ['application/json'];

  // 資料
  dataSource = new MatTableDataSource<StreamLog>([]);
  displayedColumns = [
    '#',
    ...['log_account', 'ip', 'user_agent', 'log_time', 'log_type'],
  ];

  // 分組
  pairList$ = new BehaviorSubject<Array<StreamLogPair>>([]);
  pairListGrouped: Array<StreamLogPairGroup> = [];

  logTypeObj = LOG_TYPE_OBJ;

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
    // 1: 原始紀錄
    {
      title: '原始紀錄',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '共',
      suffix: '筆',
    },
    // 2: 原始紀錄 (開始)
    {
      title: '原始紀錄 (開始)',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '共',
      suffix: '筆',
    },
    // 3: 原始紀錄 (結束)
    {
      title: '原始紀錄 (結束)',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '共',
      suffix: '筆',
    },
    // 4: 有效紀錄 (開始 & 結束)
    {
      title: '有效紀錄',
      value: '',
      valueSize: 'text-7xl',
      prefix: '共',
      suffix: '組',
    },
    // 5: 使用時間總計
    {
      title: '使用時間總計',
      value: '00:00:00',
      valueSize: 'text-5xl',
    },
  ];

  fileReader = new FileReader();
  loading = false;
  selectedTabIndex = new FormControl(0);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private matSnackBar: MatSnackBar,
    private dataService: DataService
  ) {
    this.SMQuery.addEventListener('change', this._SMQueryListener);

    this.dataSource.sortData = this.sortData;
    this.fileReader.onload = (e) => {
      try {
        const data = JSON.parse(this.fileReader.result as string);

        this.dataService.streamLogList$.next(data);

        this.loading = false;
      } catch (error) {
        this.matSnackBar.open('檔案讀取失敗');

        this.clearDataAndFileInput();
      }
    };

    combineLatest([this.viewInit$, this.dataService.streamLogList$])
      .pipe(
        takeUntil(this.destroy$),
        tap(([viewInit, elementList]) => {
          const verified = this.verifyData(elementList);

          this.dataSource.data = verified;

          if (elementList.length === 0) {
            this.selectedTabIndex.setValue(0);
          }

          // 統計
          setTimeout(() => {
            this.resultList[1].value = `${elementList.length}`;
            this.resultList[2].value = `${
              elementList.filter(
                (element) => element.log_type === this.logTypeObj.Start
              ).length
            }`;
            this.resultList[3].value = `${
              elementList.filter(
                (element) => element.log_type === this.logTypeObj.End
              ).length
            }`;
          });

          this.pairList$.next(this.pairData(verified));
        }),
        catchError((err) => {
          this.matSnackBar.open('數據解析失敗');

          this.clearDataAndFileInput();

          return EMPTY;
        })
      )
      .subscribe();

    combineLatest([this.viewInit$, this.pairList$])
      .pipe(
        takeUntil(this.destroy$),
        tap(([viewInit, pairList]) => {
          this.pairListGrouped = pairList
            .reduce<Array<StreamLogPairGroup>>((grouped, pair) => {
              const { log_account, log_time_pair, log_time_diff } = pair;

              const existing = grouped.find(
                (group) => group.log_account === log_account
              );

              if (existing !== undefined) {
                existing.log_time_total += log_time_diff;
                existing.pair_list.push(pair);
              } else {
                grouped.push({
                  log_account,
                  log_time_total: log_time_diff,
                  pair_list: [pair],
                });
              }

              return grouped;
            }, [])
            .sort((a, b) => compareString(a.log_account, b.log_account));

          // 統計
          setTimeout(() => {
            this.resultList[0].value = `${this.pairListGrouped.length}`;
            this.resultList[4].value = `${this.pairListGrouped.reduce(
              (sum, group) => sum + group.pair_list.length,
              0
            )}`;
            this.resultList[5].value = hhmmss(
              this.pairListGrouped.reduce(
                (sum, group) => sum + group.log_time_total,
                0
              )
            );
          });
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
    this.dataService.streamLogList$.next([]);
  }

  clearDataAndFileInput(): void {
    this.clearData();

    this.fileInput.nativeElement.value = '';
  }

  sortData(
    data: Array<StreamLog>,
    { active, direction }: MatSort
  ): Array<StreamLog> {
    if (active === undefined || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let value = 0;

      switch (active) {
        case 'log_account':
          value = compareString(a.log_account, b.log_account);
          break;
        case 'log_time':
          value = compareDate(a.log_time.$date, b.log_time.$date);
          break;
        case 'ip':
          value = compareString(a.ip ?? '', b.ip ?? '');
          break;
        case 'user_agent':
          value = compareString(a.user_agent ?? '', b.user_agent ?? '');
          break;
      }

      return value * (direction === 'asc' ? 1 : -1);
    });
  }

  verifyData(data: Array<StreamLog>): Array<StreamLog> {
    data.sort((a, b) => compareDate(a.log_time.$date, b.log_time.$date));

    const pairedIndexList: Array<number> = [];
    const valid: Array<StreamLog> = [];

    for (let i = 0; i < data.length; i++) {
      const { log_account, log_type, ip, user_agent } = data[i];

      if (log_type === 'end') {
        let pairedIndex = -1;

        for (let j = 0; j < i; j++) {
          if (
            !pairedIndexList.includes(j) &&
            data[j].log_type === 'start' &&
            log_account === data[j].log_account &&
            ip === data[j].ip &&
            user_agent === data[j].user_agent
          ) {
            pairedIndex = j;
          }
        }

        if (pairedIndex !== -1) {
          pairedIndexList.push(pairedIndex);
          valid.push(data[pairedIndex], data[i]);
        }
      }
    }

    const diff = data.length - valid.length;

    if (diff > 0) {
      this.matSnackBar.open(`${diff} 筆無法配對的資料已剔除`);
    }

    return valid;
  }

  pairData(verified: Array<StreamLog>): Array<StreamLogPair> {
    verified.sort((a, b) => compareDate(a.log_time.$date, b.log_time.$date));

    const pairedIndexList: Array<number> = [];
    const pairList: Array<StreamLogPair> = [];

    for (let i = 0; i < verified.length; i++) {
      const { _id, log_account, log_time, log_type, ip, user_agent } =
        verified[i];

      if (log_type === 'start') {
        let pairedIndex = -1;

        for (let j = i + 1; j < verified.length; j++) {
          if (
            !pairedIndexList.includes(j) &&
            verified[j].log_type === 'end' &&
            log_account === verified[j].log_account &&
            ip === verified[j].ip &&
            user_agent === verified[j].user_agent
          ) {
            pairedIndex = j;

            break;
          }
        }

        if (pairedIndex !== -1) {
          pairedIndexList.push(pairedIndex);
          pairList.push({
            $_id_pair: [_id, verified[pairedIndex]._id],
            log_account,
            log_time_pair: [log_time, verified[pairedIndex].log_time],
            log_time_diff:
              new Date(verified[pairedIndex].log_time.$date).valueOf() -
              new Date(log_time.$date).valueOf(),
            ip,
            user_agent,
          });
        }
      }
    }

    return pairList;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();

    this.SMQuery.removeEventListener('change', this._SMQueryListener);
  }
}
