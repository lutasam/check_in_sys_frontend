import httpUtil from "../utils/httpUtil";

/**
 * 部门
 */

export function findAllDepartments(params) {
    return httpUtil.post("api/department/find_all_departments", params);
}

export function addDepartmentPermission(params) {
    return httpUtil.post("api/department/add_department_permission", params);
}

export function deleteDepartmentPermission(params) {
    return httpUtil.post("api/department/delete_department_permission", params);
}
