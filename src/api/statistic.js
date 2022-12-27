import httpUtil from "../utils/httpUtil";

/**
 * 统计
 */

export function takeUserStatistic(params) {
    return httpUtil.post("api/statistic/take_user_statistic", params);
}

export function takeAdminStatistic(params) {
    return httpUtil.post("api/statistic/take_admin_statistic", params);
}