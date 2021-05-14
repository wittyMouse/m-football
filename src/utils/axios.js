import axios from "axios";
import store from "../store";
import { baseURL } from "../api/config";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  function(config) {
    config.url = `/${baseURL}${config.url}`;

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function(response) {
    if (response.data.code === 5010) {
      if (!store.state.modalVisible) {
        store.commit("SET_MODAL_CONFIG", {
          title: '提示',
          content: '登录状态已过期',
          confirmText: '重新登录'
        });
        store.commit("SET_MODAL_VISIBLE", true);
      }
      return Promise.reject(response.data.message);
    }
    return response.data;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
