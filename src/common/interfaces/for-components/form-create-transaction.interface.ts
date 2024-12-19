import dayjs from "dayjs";

export interface formCreateTransaction {
  amount: number;
  date: dayjs.Dayjs; // type of date in the ant design's date picker
  description?: string;
}
