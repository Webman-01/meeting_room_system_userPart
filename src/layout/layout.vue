<template>
  <div class="layout">
    <div class="header">
      <h1>会议室预订系统</h1>
      <router-link to="/update_info"><UserOutlined class="icon"/></router-link>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 40px;
    border-bottom: 1px solid #e6e8eb;
    height: 60px;
    .icon{
      font-size: 40px;
      color: black;
    }
  }
}
</style>
