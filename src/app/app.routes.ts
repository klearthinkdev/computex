import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { StreamUserComponent } from './pages/stream-user/stream-user.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { StreamLogComponent } from './pages/stream-log/stream-log.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'COMPUTEX - 首頁',
    data: {
      name: '首頁',
    },
  },
  {
    path: 'stream-user',
    component: StreamUserComponent,
    title: 'COMPUTEX - 帳戶紀錄',
    data: {
      name: '帳戶紀錄',
    },
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
    title: 'COMPUTEX - 問卷回覆',
    data: {
      name: '問卷回覆',
    },
  },
  {
    path: 'stream-log',
    component: StreamLogComponent,
    title: 'COMPUTEX - 使用紀錄',
    data: {
      name: '使用紀錄',
    },
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
