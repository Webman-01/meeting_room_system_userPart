import nprogress from "nprogress";
import "nprogress/nprogress.css";
import router from "./router";
import type { RouteLocationNormalized } from "vue-router";
import { message } from "ant-design-vue";
import { refreshToken } from "./utils/interfaces";
//导航发生前执行
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: Function
  ) => {
    nprogress.start();
    const access_token = localStorage.getItem("access_token");
    // 1.如果用户未登录且不是要去登录或注册页面就跳到登录页面
    if (!access_token) {
      if (to.path == "/login" || to.path == "/register") {
        next();
      } else {
        next("/login");
      }
    } else {
      const res = await refreshToken();
      if (res.status == 401) {
        message.error("登录过期");
        localStorage.clear();
        next("/login");
      } else {
        if (to.path == "/register" || to.path == "/login") {
          next("/menu/meeting_room_list");
        } else {
          next();
        }
      }
    }
  }
);
router.afterEach(() => {
  nprogress.done();
});
