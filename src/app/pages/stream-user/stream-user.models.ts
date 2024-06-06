export interface StreamUser {
  _id: { $oid: string };
  account: string;
  create_time: { $date: Date };
}
