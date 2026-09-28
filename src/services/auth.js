import axios from "axios";

export function login(data, config) {
  return axios.post("http://127.0.0.1:8000/api/user/login", data, config);
}

export function register(data, config) {
  return axios.post("http://127.0.0.1:8000/api/user/register", data, config);
}

export function exchangeGoogleCode(data, config) {
  return axios.post(
    "http://127.0.0.1:8000/api/user/google/exchange",
    data,
    config,
  );
}

export function logout(data, config) {
  return axios.post("http://127.0.0.1:8000/api/user/logout", data, config);
}
