<template>
  <div class="apply-title">
    <el-button type="primary">添加审批</el-button>
    <el-space>
      <el-input placeholder="请输入搜索关键词" v-model="searchWord"></el-input>
      <el-button type="primary" icon="search">搜索</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-radio-group v-model="approverType">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="待审批"></el-radio-button>
        <el-radio-button label="已通过"></el-radio-button>
        <el-radio-button label="未通过"></el-radio-button>
      </el-radio-group>
    </el-space>
  </div>

  <div class="apply-table">
    <el-table border style="width: 100%" :data="pageApplyList">
      <el-table-column prop="applicantname" label="申请人" width="180" />
      <el-table-column prop="reason" label="审批事由" width="180" />
      <el-table-column prop="time" label="时间">
        <template #default="scope">{{ scope.row.time.join("-") }} </template>
      </el-table-column>

      <el-table-column prop="note" label="备注" />
      <el-table-column prop="approvername" label="审批人" width="180" />
      <el-table-column prop="state" label="状态" width="180" />
    </el-table>

    <!-- page-size 就是一页几条数据 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="applyList.length"
      :page-size="pageSize"
      @current-change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/store";

const store = useStore();

// 要操作的表格数据
const applyList = computed(() =>
  store.state.checks.applyList.filter(
    (v) =>
      // 如果状态===自己定义的 approverType状态  或者defaultType===全部
      (v.state === approverType.value || defaultType === approverType.value) &&
      // 搜索  输入的状态如果有包含v-model输入的
      (v.note as string).includes(searchWord.value)
  )
);

const searchWord = ref("");
const defaultType = "全部";
const approverType = ref(defaultType);

const pageCurrent = ref(1); //当前从第一页开始
const pageSize = ref(10); //一页几个数据 就是个数 10个做一页

// 表格数据
const pageApplyList = computed(() =>
  applyList.value.slice(
    (pageCurrent.value - 1) * pageSize.value,
    pageCurrent.value * pageSize.value
  )
);

const handleChange = (value: number) => {
  pageCurrent.value = value;
};
</script>

<style scoped lang="scss">
.apply-title {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}

.apply-table {
  margin: 10px;
}

.el-pagination {
  float: right;
  margin: 10px;
}
</style>
