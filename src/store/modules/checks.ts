import http from "@/utils/http";
import type { MutationTree, ActionTree, GetterTree } from "vuex";
import type { State } from "../index";

interface Infos {
  [index: string]: unknown;
}
export interface ChecksState {
  [x: string]: any;
  applyList: Infos[];
  checkList: Infos[];
}

const state: ChecksState = {
  applyList: [], //申请人
  checkList: [], //审批人
};

const mutations: MutationTree<ChecksState> = {
  updateApplyList(state, payload) {
    state.applyList = payload;
  },
  updateCheckList(state, payload) {
    state.checkList = payload;
  },
};
const actions: ActionTree<ChecksState, State> = {
  // 获取用户审批信息详情。
  getApply(context, payload) {
    return http.get("/checks/apply", payload);
  },

  postApply(context, payload) {
    return http.post("/checks/apply", payload);
  },
  putApply(context, payload) {
    return http.put("/checks/apply", payload);
  },
};
const getters: GetterTree<ChecksState, State> = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
