import httpUtil from "../utils/httpUtil";

/**
 * 商品
 */
export function addCommodity(params) {
  return httpUtil.post("api/commodity/add_commodity", params);
}

export function updateCommodity(params) {
  return httpUtil.post("api/commodity/update_commodity", params);
}

export function deleteCommodity(params) {
  return httpUtil.post("api/commodity/delete_commodity", params);
}

export function findCommodities(params) {
  return httpUtil.get("api/commodity/find_commodities", params);
}
