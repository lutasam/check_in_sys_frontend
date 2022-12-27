import httpUtil from "../utils/httpUtil";

/**
 * 通知
 */

export function findAllNotices(params) {
    return httpUtil.post("api/notice/find_all_notices", params);
}

export function uploadNotice(params) {
    return httpUtil.post("api/notice/upload_notice", params);
}

export function deleteNotice(params) {
    return httpUtil.post("api/notice/delete_notice", params);
}