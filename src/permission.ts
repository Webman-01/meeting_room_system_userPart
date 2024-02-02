import nprogress from "nprogress";
import "nprogress/nprogress.css";
import router from "./router";
import type { RouteLocationNormalized } from "vue-router";
//导航发生前执行
router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: Function
  ) => {
    nprogress.start();
    const access_token = localStorage.getItem("access_token");
    //1.如果用户未登录且不是要去登录或注册页面就跳到登录页面
    if (!access_token && to.path !== "/login") {
      next( { path: "/login" });
    }
    //2.如果登录成功就不再前往登录注册页面
    if(access_token && (to.path=='login' || to.path=='/register')){
        console.log('ok2');
        
        return false
    }
  }
);
