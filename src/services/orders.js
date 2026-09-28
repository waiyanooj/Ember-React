import axios from "axios";

export function getOrderHistory(config) {
  return axios.get("http://127.0.0.1:8000/api/user/order/history", config);
}
