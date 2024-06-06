export interface StreamLog {
  _id: { $oid: string };
  log_account: string;
  log_time: { $date: Date };
  log_type: string;
  ip: string | null;
  user_agent: string | null;
}

export interface StreamLogPair {
  $_id_pair: [{ $oid: string }, { $oid: string }];
  log_account: string;
  log_time_pair: [{ $date: Date }, { $date: Date }];
  log_time_diff: number;
  ip: string | null;
  user_agent: string | null;
}

export interface StreamLogPairGroup {
  log_account: string;
  log_time_total: number;
  pair_list: Array<StreamLogPair>;
}

export enum LogType {
  Start = 'start',
  End = 'end',
}
export const LOG_TYPE_OBJ = {
  Start: LogType.Start,
  End: LogType.End,
};
