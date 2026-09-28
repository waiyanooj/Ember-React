import axios from "axios";

export function createPaymentIntent(data, config) {
  return axios.post(
    "http://127.0.0.1:8000/api/user/payment/intent",
    data,
    config,
  );
}

export function finalizePayment(data, config) {
  return axios.post(
    "http://127.0.0.1:8000/api/user/payment/finalize",
    data,
    config,
  );
}
