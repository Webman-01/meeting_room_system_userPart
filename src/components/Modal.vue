<!-- 二次封装一个modal组件 -->
<template>
  <a-config-provider :locale="locale">
    <a-tag color="cyan" @click="showModal">预订</a-tag>
    <!-- eslint-disable vue/no-v-model-argument -->
    <a-modal
      ref="modalRef"
      v-model:open="open"
      :wrap-style="{ overflow: 'hidden' }"
      @ok="handleOk(Number($attrs.meetingRoomId))"
      okText="创建"
      cancelText="取消"
    >
      <a-form
        :model="booking"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
      >
        <a-form-item label="会议室名称" name="name">
          {{ $attrs.name }}
        </a-form-item>
        <a-form-item label="预订开始时间" name="location">
          <a-date-picker
            placeholder="请选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            v-model:value="booking.rangeStartTime"
            :disabled-date="disabledDate"
            :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
          />
        </a-form-item>
        <a-form-item label="预订结束时间" name="endTime">
          <a-date-picker
            placeholder="请选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            v-model:value="booking.rangeEndTime"
            :disabled-date="disabledDate"
            :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
          />
        </a-form-item>
        <a-form-item label="备注" name="description">
          <a-textarea v-model:value="booking.text" allow-clear />
        </a-form-item>
      </a-form>
      <template #title>
        <div ref="modalTitleRef" style="width: 100%; cursor: move">
          预订会议室
        </div>
      </template>
      <template #modalRender="{ originVNode }">
        <div :style="transformStyle">
          <component :is="originVNode" />
        </div>
      </template>
    </a-modal>
  </a-config-provider>
</template>
<script lang="ts" setup>
import {
  ref,
  computed,
  type CSSProperties,
  watch,
  watchEffect,
  reactive,
} from "vue";
import { useDraggable } from "@vueuse/core";
import dayjs, { Dayjs } from "dayjs";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { bookingAdd } from "../utils/interfaces";
import type { CreateBooking } from "@/types/booking.types";
import { message } from "ant-design-vue";
//中文化
const locale = ref(zhCN);
dayjs.locale("zh-cn");
const disabledDate = (current: Dayjs) => {
  //禁用今天之前的日期
  return current && current < dayjs().startOf("day");
};
const booking = reactive<CreateBooking>({
  text: "",
});
const open = ref<boolean>(false);
const modalTitleRef = ref<HTMLElement>(null!);
//使用非空断言（!）表示你确信变量在后续的使用中不会为 null
const showModal = () => {
  Object.assign(booking, {
    rangeStartTime: "",
    rangeEndTime: "",
    text: "",
  });
  open.value = true;
};
const { x, y, isDragging } = useDraggable(modalTitleRef);
//点击确定的回调
const handleOk = async (meetingRoomId: number) => {
  booking.meetingRoomId = meetingRoomId;
  //从localStorage获取用户id
  const userInfo = JSON.parse(localStorage.getItem('user_info') as string)
  const userId = userInfo.id
  const res = await bookingAdd(booking,userId);
  if (res.status == 200 || res.status == 201) {
    message.success("预订成功");
  } else {
    message.error("请正确填写信息");
  }
  open.value = false;
};
const startX = ref<number>(0);
const startY = ref<number>(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value;
    startY.value = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = modalTitleRef.value.getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag.value = true;
});
watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
      preTransformX.value +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      startX.value;
    transformY.value =
      preTransformY.value +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      startY.value;
  }
});
const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});
</script>
