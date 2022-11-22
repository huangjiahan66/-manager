import http from "@/utils/http";
import type { MutationTree, ActionTree, GetterTree } from "vuex";
import type { State } from "../index";

// 不确定后端返回哪些
interface Infos {
  [index: string]: unknown;
}
export interface UsersState {
  token: string;
  infos: Infos;
}

const state: UsersState = {
  token: "", //token
  infos: {}, //用户信息
};

const mutations: MutationTree<UsersState> = {
  updateToken(state, payload) {
    state.token = payload;
  },
  updateInfos(state, payload) {
    state.infos = payload;
  },
  clearToken(state) {
    // state.token=''
    state.token = "";
  },
};

const actions: ActionTree<UsersState, State> = {
  // 登录接口
  login(context, payload) {
    return http.post("/users/login", payload);
  },
  // 获取用户信息
  infos() {
    return http.get("/users/infos");
  },
};
const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
