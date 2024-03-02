import { getBookingByMeetingRoomName } from "@/utils/interfaces";
import { defineStore } from "pinia";
import { ref } from "vue";
import dayjs from "dayjs";
import type { ListDataType, BookingsType } from "@/types/booking.types";


export const useBookingStore = defineStore("bookingSituation", {
  state: () => ({
    //要展示在calendar组件中的数组数据
    result: ref(new Map()),
  }),
  actions: {
    async getList(meetingRoomName: string) {
      const res = await getBookingByMeetingRoomName(meetingRoomName);
      const { data } = res.data;
      let map:Map<string,ListDataType[]> = new Map(); //总的数据结构(键为日期{年-月-日}，值为存储内容的数组listData)
      let listData: ListDataType[] = [];
      let type: string; //展示的数据类型(success,error,warning)

      if (res.status == 200 || res.status == 201) {
        // console.log(data.bookings, "ssss");
        data.bookings.map((item: BookingsType) => {
          
          switch (item.status) {
            case "审批通过":
              type = "success";
              break;
            case "审批驳回":
              type = "error";
              break;
            case "申请中":
              type = "processing";
              break;
            case "已解除":
              type = "warning";
              break;
          }
          
          //计算bookings数组的长度,每次处理后--，到0时返回map
          //如果map中有这天，就加到hash表中
          if (map.has(dayjs(item.startTime).format("YYYY-MM-DD"))) {
            listData.push({
              type: type,
              content: `${item.room.name}在${dayjs(
                item.startTime
              ).format("HH:mm")}到${dayjs(item.endTime).format("HH:mm")}已被预订`,
            });
            map.set(dayjs(item.startTime).format("YYYY-MM-DD"), listData);
          } else {
            //出现新的日期，listData数组先置空，再添加内容，然后加进map
            listData=[];
            listData.push({
              type: type,
              content: `${item.room.name}在${dayjs(
                item.startTime
              ).format("HH:mm")}到${dayjs(item.endTime).format("HH:mm")}已被预订`,
            });
            map.set(dayjs(item.startTime).format("YYYY-MM-DD"), listData);
        }
        });
        
        //map的最终形态就是结果
        this.result = map;
        // console.log(this.result, "result");
      } else {
        throw new Error(data);
      }
    },
  },
});
