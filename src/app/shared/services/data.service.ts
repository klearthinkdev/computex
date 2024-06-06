import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StreamUser } from '../../pages/stream-user/stream-user.models';
import { Feedback } from '../../pages/feedback/feedback.models';
import { StreamLog } from '../../pages/stream-log/stream-log.models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  streamUserList$ = new BehaviorSubject<Array<StreamUser>>([]);
  feedbackList$ = new BehaviorSubject<Array<Feedback>>([]);
  streamLogList$ = new BehaviorSubject<Array<StreamLog>>([]);

  constructor() {}
}
