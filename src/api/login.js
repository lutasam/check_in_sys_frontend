import httpUtil from "../utils/httpUtil";

/**
 * 登录
 */
export function login(params) {
  return httpUtil.post("api/login/login", params);
}

export function applyRegister(params) {
  return httpUtil.post("api/login/apply_register", params);
}

export function activeUser(params) {
  return httpUtil.post("api/login/active_user", params);
}

export function resetPassword(params) {
  return httpUtil.post("api/login/reset_password", params);
}

export function activeResetPassword(params) {
  return httpUtil.post("api/login/active_reset_password", params);
}

export function applyChangeUserEmail(params) {
  return httpUtil.post("api/login/apply_change_user_email", params);
}

export function activeChangeUserEmail(params) {
  return httpUtil.post("api/login/active_change_user_email", params);
}