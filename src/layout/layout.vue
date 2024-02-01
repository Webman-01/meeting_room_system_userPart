<template>
  <div class="layout">
    <div class="header">
      <router-link to="/menu/meeting_room_list"><h1 :style="{ color: themeColor.themeColor }">会议室预订系统</h1></router-link>
      <router-link to="/update_info">
        <!-- 头像组件 -->
        <a-dropdown placement="bottom">
          <!-- 头像组件 -->
          <a-avatar class="icon" :src="getImageUrl()" :size="50"> </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;" @click="logout">退出登录</a>
              </a-menu-item>
              <a-menu-item>
                <router-link to="/update_password">修改密码</router-link>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </router-link>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/themeToggle";

//获取图片静态路径
function getImageUrl() {
  if (localStorage.getItem("user_info") == null) {
    return;
  }
  const avatarInfo = JSON.parse(localStorage.getItem("user_info") as string);
  const avatar = avatarInfo.avatar;
  return "http://localhost:3000/" + avatar;
}
const router = useRouter();
//登出
const logout = () => {
  message.success("退出登录成功");
  //清空所有本地数据
  localStorage.clear();
  router.push("/login");
};
const themeColor = useThemeStore();
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 40px;
    border-bottom: 1px solid #e6e8eb;
    height: 60px;
    h1 {
      text-decoration: none;
      color: #000;
    }
    .icon {
      font-size: 40px;
      color: black;
    }
    a {
      text-decoration: none;
    }
  }
}
</style>
