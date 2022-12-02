import httpUtil from "../utils/httpUtil";

/**
 * 登录
 */
export function doLogin(params) {
  return httpUtil.post("api/login/do_login", params);
}

export function doRegister(params) {
  return httpUtil.post("api/login/do_register", params);
}

export function activeUser(params) {
  return httpUtil.post("api/login/active_user", params);
}