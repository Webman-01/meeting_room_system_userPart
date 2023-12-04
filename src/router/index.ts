import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/layout',
      name:'layout',
      component:()=>import('@/layout/layout.vue'),
      children:[
        {
          //配置二级路由不加/
          path:'update_info',
          name:'update_info',
          component:()=>import('../views/updateInfo.vue')
        }
      ]
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/index.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/register.vue"),
    },
    {
      path: "/update_password",
      name: "update_password",
      component: () => import("../views/updatePassword.vue"),
    },
    {
      path: "/404",
      name: "404",
      component: () => import("../views/404.vue"),
    },
    {
      //任意路由重定向到404
      path: "/:pathMatch(.*)*", //匹配所有路径
      redirect: "/404",
      name: "any",
    },
  ],
});

export default router;
