import httpUtil from "../utils/httpUtil";

/**
 * 文件
 */

export function uploadImage(params) {
    return httpUtil.post("api/file/upload_image", params);
}

export function uploadFile(params) {
    return httpUtil.post("api/file/upload_file", params);
}

export function downloadFile(params) {
    return httpUtil.download("api/file/download_file", params);
}