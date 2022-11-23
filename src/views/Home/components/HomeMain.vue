<template>
  <div class="home-main">
    <!-- 二级路由出口 -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.home-main {
  margin-top: 20px;
  background: #fff;
  flex-grow: 1;
  position: relative;
}
</style>
