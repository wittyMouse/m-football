import Vue from "vue";
import Vuex from "vuex";
import {
  SET_TOKEN,
  SET_USER_INFO,
  SET_MODAL_VISIBLE,
  SET_MODAL_CONFIG,
} from "./mutation-types";
import { requestLogout } from "@/api";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: "",
    userInfo: {},
    modalVisible: false,
    modalConfig: {},
  },
  mutations: {
    [SET_TOKEN](state, data) {
      state.token = data;
    },
    [SET_USER_INFO](state, data) {
      state.userInfo = data;
    },
    [SET_MODAL_VISIBLE](state, data) {
      state.modalVisible = data;
    },
    [SET_MODAL_CONFIG](state, data) {
      state.modalConfig = data;
    },
  },
  actions: {
    updateToken({ commit }, data) {
      commit(SET_TOKEN, data);
      window.localStorage.setItem("token", data);
    },
    updateUserInfo({ commit }, data) {
      commit(SET_USER_INFO, data);
      window.localStorage.setItem("userInfo", JSON.stringify(data));
    },
    logout({ commit, state }) {
      requestLogout({ token: state.token }).finally(() => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userInfo");
        commit(SET_TOKEN, "");
        commit(SET_USER_INFO, {});
      });
    },
    updateModalVisible({ commit }, data) {
      commit(SET_MODAL_VISIBLE, data);
      if (!data) {
        commit(SET_MODAL_CONFIG, {});
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userInfo");
        commit(SET_TOKEN, "");
        commit(SET_USER_INFO, {});
      }
    },
    updateModalConfig({ commit }, data) {
      commit(SET_MODAL_CONFIG, data);
    },
  },
  modules: {},
});

export function useStore() {
  return store
}

export default store;
