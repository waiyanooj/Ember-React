import axios from "axios";

export function getProfile(config) {
  return axios.get("http://127.0.0.1:8000/api/user/profile", config);
}

export function updateProfile(data, config) {
  return axios.post(
    "http://127.0.0.1:8000/api/user/profile/update",
    data,
    config,
  );
}

export function changePassword(data, config) {
  return axios.post(
    "http://127.0.0.1:8000/api/user/passwordChange",
    data,
    config,
  );
}
