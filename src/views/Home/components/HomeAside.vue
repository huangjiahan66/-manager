<template>
  <el-menu :default-active="route.path" router>
    <el-sub-menu v-for="item in menus" :key="item.path" :index="item.path">
      <!-- 一级路由 -->
      <template #title>
        <el-icon><component :is="item.meta?.icon"></component></el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <el-menu-item
        v-for="itemChild in item.children"
        :key="item.path + itemChild.path"
        :index="item.path + itemChild.path"
      >
        <el-icon><component :is="itemChild.meta?.icon"></component></el-icon>
        <span>{{ itemChild.meta?.title }}</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import _ from "lodash"; // lodash库
import { useRouter, useRoute } from "vue-router";
import type { RouteRecordName } from "vue-router";
import { useStore } from "@/store";

const router = useRouter(); //路由方法
const route = useRoute();
const store = useStore();
const permission = store.state.users.infos.permission;

// console.log("router.options.routes", router.options.routes);

// 动态渲染菜单menu
const menus = _.cloneDeep(router.options.routes).filter((v) => {
  // console.log("cloneDeep", v);
  v.children = v.children?.filter(
    (v) =>
      v.meta?.menu &&
      (permission as (RouteRecordName | undefined)[]).includes(v.name)
  );

  return (
    v.meta?.menu &&
    (permission as (RouteRecordName | undefined)[]).includes(v.name)
  );
});
</script>

<style scoped lang="scss">
.el-menu {
  height: calc(100vh - 60px);
  border: none;
  padding-top: 30px;
}
.el-menu-item.is-active {
  background: #e6f7ff;
  border-right: 3px solid #1890ff;
}
</style>
