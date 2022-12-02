import axios from "axios";
import router from "../router";
import { Loading } from "element-ui";
// 全局axios请求loading加载
let options = {
    lock: true,
    text: "",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)",
  },
  loadingPage;

const BASE_URL = "http://127.0.0.1:8081/";
let headers = {
  Accept: "application/json;charset=utf-8",
  "Content-Type": "application/json;charset=utf-8",
};
// axios配置参数
axios.defaults.baseUrl = BASE_URL;
axios.defaults.headers = headers;
axios.defaults.timeout = 5000;

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    let token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = token;
    }
    if (config.method === "get") {
      config.params = {
        t: Date.parse(new Date()) / 1000,
        ...config.params,
      };
    }
    loadingPage = Loading.service(options);
    return config;
  },
  (error) => {
    loadingPage.close();
    return Promise.reject(error);
  }
);

//  响应拦截器
axios.interceptors.response.use(
  (response) => {
    loadingPage.close();
    if (response.data.code === 200) {
      return response.data;
    } else {
      // 100006 用户未登录错误 100007 token过期
      if (
        response.data.data.code === 100006 ||
        response.data.data.code === 100007
      ) {
        router.push("/login");
      }
      return response.data;
    }
  },
  (error) => {
    loadingPage.close();
    if (
      error.response.status === 500 ||
      error.response.data.code === 100006 ||
      error.response.data.code === 100007
    ) {
      router.push("/login");
    }
    return error.response.data;
  }
);

export default axios;
