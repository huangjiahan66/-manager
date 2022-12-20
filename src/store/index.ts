import { createStore, useStore as baseUseStore } from "vuex";
import type { Store } from "vuex";
import type { UsersState } from "./modules/users";
import type { SignsState } from "./modules/signs";
import type { ChecksState } from "./modules/checks";
import type { NewsState } from "./modules/news";
import type { InjectionKey } from "vue";
import VuexPersistence from "vuex-persist";

import users from "./modules/users"; //users模块
import signs from "./modules/signs"; //打卡模块
import checks from "./modules/checks";
import news from "./modules/news";

export interface State {}
export interface StateAll extends State {
  users: UsersState;
  signs: SignsState;
  checks: ChecksState;
  news: NewsState;
}

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
  reducer: (state) => ({
    users: { token: (state as StateAll).users.token },
  }),
});

export const key: InjectionKey<Store<StateAll>> = Symbol();
export function useStore() {
  return baseUseStore(key);
}

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    users,
    signs,
    checks,
    news,
  },
  plugins: [vuexLocal.plugin],
});
