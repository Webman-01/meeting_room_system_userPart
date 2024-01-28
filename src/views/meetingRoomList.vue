<template>
  <div>
    <!-- 搜索栏 -->
    <div class="top">
      <a-form
        :model="searchMeetingRoomData"
        name="search"
        layout="inline"
        autocomplete="off"
      >
        <a-form-item label="会议室名称" name="name">
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="searchMeetingRoomData.name">
            <template #prefix>
              <HomeOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="可容纳人数" name="capacity">
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="searchMeetingRoomData.capacity">
            <template #prefix>
              <TeamOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="设备" name="equipment">
          <a-input v-model:value="searchMeetingRoomData.equipment">
            <template #prefix>
              <EditOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </div>
    <!-- 会议室列表 -->
    <div>
      <a-table
        :columns="columns"
        :data-source="meetingRoomResult"
        :pagination="false"
      >
        <!-- 预订状态 -->
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'isBooked'">
            <a-tag color="green">可预定</a-tag>
          </template>
          <!-- 创建时间 -->
          <template v-if="column.dataIndex === 'createTime'">
            <div>{{ formatTime(record.createTime) }}</div>
          </template>
          <!-- 更新时间 -->
          <template v-if="column.dataIndex === 'updateTime'">
            <div @click="print(record)">{{ formatTime(record.updateTime) }}</div>
          </template>
          <!-- 操作 -->
          <template v-else-if="column.dataIndex === 'operate'">
            <Modal :name="record.name" :meetingRoomId="record.id"/>
          </template>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination
          v-model:current="pageNo"
          :total="(totalCount / pageSize) * 10"
          show-less-items
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
//测试
const print = (record:any)=>{
  console.log(record);
  console.log(JSON.parse((localStorage.getItem('user_info')) as string).id);
  
  
}
import Modal from "../components/Modal.vue";
import moment from "moment";
import { reactive, ref, watchEffect } from "vue";
import { message } from "ant-design-vue";
import {
  EditOutlined,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons-vue";
import { meetingRoomList } from "../utils/interfaces";
interface SearchMeetingRoomData {
  name: string;
  capacity: string;
  equipment: string;
}
//搜索框数据
const searchMeetingRoomData = reactive<SearchMeetingRoomData>({
  name: "",
  capacity: "",
  equipment: "",
});
//用户列表相关数据
const pageNo = ref(1);
const pageSize = ref(6);
const totalCount = ref(0);
const meetingRoomResult = ref([]);
//会议室列表返回的数据
export interface MeetingRoomSearchResult {
  id: number;
  name: string;
  capacity: string;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
  createTime: Date;
  updateTime: Date;
}
//调用接口获取会议室列表
const getMeetingRoomList = async () => {
  const res = await meetingRoomList(
    searchMeetingRoomData.name,
    searchMeetingRoomData.capacity,
    searchMeetingRoomData.equipment,
    pageNo.value,
    pageSize.value
  );
  const { data } = res.data;

  if (res.status == 200 || res.status == 201) {
    totalCount.value = data.totalCount;

    meetingRoomResult.value = data.meetingRooms.map(
      (item: MeetingRoomSearchResult) => {
        return {
          key: item.id,
          ...item,
        };
      }
    );
  } else {
    message.error(data || "系统繁忙，请稍后再试");
  }
};
//监视页面信息的变化
watchEffect(async () => {
  //调用接口函数获取页面信息
  getMeetingRoomList();
});

//格式化时间
function formatTime(date: Date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
let columns = [
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "容纳人数",
    dataIndex: "capacity",
  },
  {
    title: "位置",
    dataIndex: "location",
  },
  {
    title: "设备",
    dataIndex: "equipment",
  },
  {
    title: "描述",
    dataIndex: "description",
  },
  {
    title: "添加时间",
    dataIndex: "createTime",
  },
  {
    title: "上次更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "预订状态",
    dataIndex: "isBooked",
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
}
.pagination {
  margin-top: 20px;
}
.ant-modal {
  .ant-modal-body {
    .ant-form {
      margin-top: 25px;
      padding-right: 50px;
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
