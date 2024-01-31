<template>
    <div class="menu-container">
      <div class="menu">
        <a-menu
          :openKeys="state.openKeys"
          :selectedKeys="state.selectedKeys"
          mode="inline"
          theme="light"
          :inline-collapsed="state.collapsed"
          :items="items"
          @click="changeRoute"
        >
        </a-menu>
      </div>
      <div class="userMange">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive, watch, h, watchEffect } from "vue";
  import { PieChartOutlined, DesktopOutlined } from "@ant-design/icons-vue";
  import { useRoute, useRouter } from "vue-router";
  const state = reactive({
    collapsed: false,
    selectedKeys: ["0"],
    openKeys: ["sub0"],
    preOpenKeys: ["sub0"],
  });
  const items = reactive([
    {
      key: "0",
      icon: () => h(PieChartOutlined),
      label: "会议室列表",
      title: "会议室列表",
    },
    {
      key: "1",
      icon: () => h(DesktopOutlined),
      label: "预订历史",
      title: "预订历史",
    },
  ]);
  watch(
    () => state.openKeys,
    (_val, oldVal) => {
      state.preOpenKeys = oldVal;
    }
  );
  const $router = useRouter();
  const $route = useRoute();
  //挂载后根据路由来渲染选中的是菜单栏中哪个
  watchEffect(() => {
    state.selectedKeys = $route.path == "/menu/meeting_room_list" ? ["0"] : ["1"];
  });
  //点击左边栏跳转路由
  const changeRoute = (e: any) => {
    //获取事件对象
    // console.log(e);
    state.selectedKeys[0] = e.key;
    if (e.key == "0") {
      $router.push("/menu/meeting_room_list");
    } else {
      $router.push("/menu/booking_history");
    }
  };
  </script>
 <style lang="scss" scoped>
 .menu-container {
   display: flex;
   .menu {
     width: 256px;
   }
   .userMange {
     padding: 25px;
   }
 }
 </style>
 