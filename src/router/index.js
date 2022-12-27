import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/",
      component: () => import("../components/Home.vue"),
      meta: { title: "home" },
      children: [
        {
          path: "dashboard",
          component: () => import("../pages/dashboard"),
          meta: { title: "系统首页" },
        },
        {
          path: "record_manage",
          component: () => import("../pages/record_manage"),
          meta: { title: "打卡管理" },
        },
        {
          path: "userinfo",
          component: () => import("../pages/userinfo"),
          meta: { title: "个人信息管理" },
        },
        {
          path: "user_manage",
          component: () => import("../pages/user_manage"),
          meta: { title: "用户管理" },
        },
        {
          path: "department",
          component: () => import("../pages/department"),
          meta: { title: "权限管理" },
        },
        {
          path: "notice",
          component: () => import("../pages/notice"),
          meta: { title: "通知发布" },
        },
        {
          path: "403",
          component: () => import("../pages/403"),
          meta: { title: "禁止访问" },
        },
        // {
        //   path: "table",
        //   component: () => import("../pages/table"),
        //   meta: { title: "基本表格" },
        // },
        // {
        //   path: "form",
        //   component: () => import("../pages/form"),
        //   meta: { title: "复杂表单" },
        // },
        // {
        //   path: "form-detail",
        //   component: () => import("../pages/form-detail"),
        //   meta: { title: "表单详情" },
        // },
        // {
        //   path: "markdown",
        //   component: () => import("../pages/markdown"),
        //   meta: { title: "markdown编辑器" },
        // },
        // {
        //   path: "upload",
        //   component: () => import("../pages/upload"),
        //   meta: { title: "文件上传" },
        // },
        // {
        //   path: "charts",
        //   component: () => import("../pages/charts"),
        //   meta: { title: "vchart图表" },
        // },
      ],
    },
    {
      path: "/login",
      component: () => import("../pages/login"),
      meta: { title: "登录" },
    },
  ],
});
