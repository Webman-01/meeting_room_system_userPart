<template>
  <div>
    <!-- 搜索栏 -->
    <div class="top">
      <a-form
        :model="searchBookingData"
        name="search"
        layout="inline"
        autocomplete="off"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="会议室名称" name="name">
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="searchBookingData.meetingRoomName">
            <template #prefix>
              <HomeOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="会议室位置" name="location">
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="searchBookingData.meetingRoomPosition">
            <template #prefix>
              <TeamOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="开始时间" name="startTime">
          <a-date-picker
            placeholder="请选择"
            v-model:value="searchBookingData.rangeStartTime"
            format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
            :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
          />
        </a-form-item>

        <a-form-item label="结束时间" name="endTime">
          <a-date-picker
            placeholder="请选择"
            v-model:value="searchBookingData.rangeEndTime"
            format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
            :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
          />
        </a-form-item>
        <a-form-item class="last-item">
          <a-button type="primary" @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 会议室列表 -->
    <div>
      <PageList
        :columns="columns"
        :data-source="bookingResult"
        :pagination="false"
        v-model:current="pageNo"
        :total="(totalCount / pageSize) * 10"
      >
        <template v-slot:bodyCell="{ column, record }">
          <!-- 会议室名称 -->
          <template v-if="column.dataIndex === 'name'">
            <div>{{ record.room.name }}</div>
          </template>
          <!-- 会议室位置 -->
          <template v-if="column.dataIndex === 'location'">
            <div>{{ record.room.location }}</div>
          </template>
          <!-- 审批状态 -->
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="changeColor(record.status)">{{
              record.status
            }}</a-tag>
          </template>
          <!-- 开始时间 -->
          <template v-if="column.dataIndex === 'startTime'">
            <div>{{ formatTime(record.startTime) }}</div>
          </template>
          <!-- 结束时间 -->
          <template v-if="column.dataIndex === 'endTime'">
            <div>{{ formatTime(record.endTime) }}</div>
          </template>
          <!-- 预订时间 -->
          <template v-if="column.dataIndex === 'createTime'">
            <div>{{ formatTime(record.createTime) }}</div>
          </template>
          <!-- 备注 -->
          <template v-if="column.dataIndex === 'note'">
            <div>{{ record.note }}</div>
          </template>
          <!-- 描述 -->
          <template v-if="column.dataIndex === 'description'">
            <div>{{ record.room.description }}</div>
          </template>
          <!-- 操作 -->
          <template v-if="column.dataIndex === 'operate'">
            <a-popconfirm
              title="你确定要取消申请吗"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirm(record.id)"
              @cancel="cancel"
            >
              <a-tag color="cyan">取消申请</a-tag>
            </a-popconfirm>
          </template>
        </template>
      </PageList>
    </div>
  </div>
</template>
<script lang="ts" setup>
import moment from "moment";
import { onMounted, reactive, ref, watch, watchEffect } from "vue";
import { message } from "ant-design-vue";
import { TeamOutlined, HomeOutlined } from "@ant-design/icons-vue";
import dayjs, { Dayjs } from "dayjs";
import { bookingList, unbind } from "../utils/interfaces";
import type { MeetingRoomSearchResult } from "../views/meetingRoomList.vue";
import { debounce } from "@/utils/debounce_throttle/debounce";
import PageList from "@/components/PageList.vue";
const disabledDate = (current: Dayjs) => {
  //禁用今天之前的日期
  return current && current < dayjs().startOf("day");
};
//当传入的status状态不同时展示不同的颜色
const changeColor = (status: string) => {
  let color;
  if (status == "审批通过") color = "green";
  else if (status == "申请中") color = "orange";
  else if (status == "审批驳回") color = "red";
  else if (status == "已解除") color = "purple";
  return color;
};
export interface SearchBookingData {
  username: string;
  meetingRoomName: string;
  meetingRoomPosition: string;
  rangeStartTime?: Dayjs;
  rangeEndTime?: Dayjs;
}
//搜索框数据
const searchBookingData = reactive<SearchBookingData>({
  username: "",
  meetingRoomName: "",
  meetingRoomPosition: "",
});
//用户列表相关数据
const pageNo = ref(1);
const pageSize = ref(6);
const totalCount = ref(0);
const bookingResult = ref([]);
//预订列表返回的数据
interface BookingSearchResult {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  createTime: string;
  updateTime: string;
  room: MeetingRoomSearchResult;
}
//调用接口获取预订列表
const getBookingList = async () => {
  if (searchBookingData.rangeEndTime && searchBookingData.rangeStartTime) {
    if (searchBookingData.rangeEndTime < searchBookingData.rangeStartTime) {
      message.error("开始时间不能晚于结束时间");
      return;
    }
  }
  const res = await bookingList(
    searchBookingData,
    pageNo.value,
    pageSize.value
  );
  const { data } = res.data;
  if (res.status == 200 || res.status == 201) {
    totalCount.value = data.totalCount;

    bookingResult.value = data.bookings.map((item: BookingSearchResult) => {
      return {
        key: item.id,
        ...item,
      };
    });
  } else {
    message.error(data || "系统繁忙，请稍后再试");
  }
};
//监视页面信息的变化
const getData = debounce(getBookingList, 300);
watch([searchBookingData, pageNo], () => {
  getData();
});
onMounted(() => {
  getBookingList();
});

//格式化时间
function formatTime(date: Date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
//操作部分弹出框
const confirm = async (id: number) => {
  const res = await unbind(id);
  if (res.status == 200 || res.status == 201) {
    message.success("取消成功");
  } else {
    message.error(res.data.data);
  }
  //操作之后再次发起请求获取最新的页面数据展示
  getBookingList();
};

const cancel = () => {
  message.warning("取消操作");
};
//重制功能
const reset = () => {
  searchBookingData.username = "";
  searchBookingData.meetingRoomName = "";
  searchBookingData.meetingRoomPosition = "";
  (searchBookingData.rangeStartTime = undefined),
    (searchBookingData.rangeEndTime = undefined);
};
let columns = [
  {
    title: "会议室名称",
    dataIndex: "name",
  },
  {
    title: "位置",
    dataIndex: "location",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
  },
  {
    title: "审批状态",
    dataIndex: "status",
    filters: [
      {
        text: "审批通过",
        value: "审批通过",
      },
      {
        text: "审批驳回",
        value: "审批驳回",
      },
      {
        text: "申请中",
        value: "申请中",
      },
      {
        text: "已解除",
        value: "已解除",
      },
    ],
    //筛选以传入的值为字符串开头的选项
    onFilter: (value: string, record: BookingSearchResult) =>
      record.status.startsWith(value),
  },
  {
    title: "预订时间",
    dataIndex: "createTime",
  },
  {
    title: "备注",
    dataIndex: "note",
  },
  {
    title: "描述",
    dataIndex: "description",
  },
  {
    title: "操作",
    dataIndex: "operate",
  },
];
</script>
<style lang="scss" scoped>
.top {
  padding-bottom: 20px;
  .ant-form-item {
    width: 283px;
    margin-bottom: 15px;
    margin-left: 15px;
  }
}
.last-item {
  display: flex;
  justify-content: flex-end;
  .else {
    display: flex;
    align-items: center;
  }
}
.pagination {
  margin-top: 20px;
}
.ant-modal {
  .ant-modal-body {
    .ant-form {
      margin-top: 25px;
    }
  }
}
.ant-table {
  .ant-table-content {
    .ant-table-row {
      .ant-tag-red {
        cursor: pointer;
      }
      .ant-tag-blue {
        cursor: pointer;
      }
    }
  }
}
</style>
