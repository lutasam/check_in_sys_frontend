import httpUtil from "../utils/httpUtil";

/**
 * 用户
 */

export function findAllUserStatus(params) {
    return httpUtil.post("api/user/find_all_user_status", params);
}

export function findAllUsers(params) {
    return httpUtil.post("api/user/find_all_users", params);
}

export function addUser(params) {
    return httpUtil.post("api/user/add_user", params);
}

export function updateUserInfo(params) {
    return httpUtil.post("api/user/update_user_info", params);
}

export function deleteUser(params) {
    return httpUtil.post("api/user/delete_user", params);
}

export function takeUserInfo(params) {
    return httpUtil.post("api/user/take_user_info", params)
}

export function findAllAdmins(params) {
    return httpUtil.post("api/user/find_all_admins", params)
}