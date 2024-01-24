//预订相关数据
import { Dayjs } from "dayjs";
export interface CreateBooking {
  meetingRoomId?: number;
  rangeStartTime?: Dayjs;
  rangeEndTime?: Dayjs;
  text: string;
}
