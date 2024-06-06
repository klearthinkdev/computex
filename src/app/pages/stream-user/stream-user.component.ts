import {
  AfterViewInit,
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
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { StreamUser } from './stream-user.models';
import { Result } from '../../shared/models/result';
import { ResultCardComponent } from '../../shared/components/result-card/result-card.component';
import { TimeTitlePipe } from '../../shared/pipes';
import { DataService } from '../../shared/services/data.service';
import { compareDate, compareString } from '../../shared/services/utils';

@Component({
  selector: 'app-stream-user',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    ResultCardComponent,
    TimeTitlePipe,
    MatBadgeModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './stream-user.component.html',
})
export class StreamUserComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<null>();
  private viewInit$ = new Subject<null>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  acceptList: Array<string> = ['application/json'];

  // 資料
  dataSource = new MatTableDataSource<StreamUser>([]);
  displayedColumns = ['#', ...['account', 'create_time']];

  // 統計
  resultList: Array<Result> = [
    // 0: 新建帳戶
    {
      title: '新建帳戶',
      value: '0',
      valueSize: 'text-7xl',
      prefix: '共',
      suffix: '組',
    },
  ];

  fileReader = new FileReader();
  loading = false;
  selectedTabIndex = new FormControl(0);

  constructor(
    private matSnackBar: MatSnackBar,
    private dataService: DataService
  ) {
    this.dataSource.sortData = this.sortData;
    this.fileReader.onload = (e) => {
      try {
        const data = JSON.parse(this.fileReader.result as string);

        this.dataService.streamUserList$.next(data);

        this.loading = false;
      } catch (error) {
        this.matSnackBar.open('檔案讀取失敗');

        this.clearDataAndFileInput();
      }
    };

    combineLatest([this.viewInit$, this.dataService.streamUserList$])
      .pipe(
        takeUntil(this.destroy$),
        tap(([viewInit, elementList]) => {
          this.dataSource.data = elementList.sort((a, b) =>
            compareDate(a.create_time.$date, b.create_time.$date)
          );

          if (elementList.length === 0) {
            this.selectedTabIndex.setValue(0);
          }

          // 統計
          setTimeout(() => {
            this.resultList[0].value = `${elementList.length}`;
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
    this.dataService.streamUserList$.next([]);
  }

  clearDataAndFileInput(): void {
    this.clearData();

    this.fileInput.nativeElement.value = '';
  }

  sortData(
    data: Array<StreamUser>,
    { active, direction }: MatSort
  ): Array<StreamUser> {
    if (active === undefined || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let value = 0;

      switch (active) {
        case 'account':
          value = compareString(a.account, b.account);
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
