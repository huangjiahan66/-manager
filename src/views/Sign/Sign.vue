<template>
  <el-descriptions border direction="vertical" :column="9">
    <el-descriptions-item label="月份">11月</el-descriptions-item>
    <el-descriptions-item
      v-for="(value, key) in DetailKey"
      :key="key"
      :label="value"
      >{{ detailValue[key] }}</el-descriptions-item
    >

    <el-descriptions-item label="操作">
      <el-button type="primary" plain size="small" @click="handleToException"
        >查看详情
      </el-button>
    </el-descriptions-item>

    <el-descriptions-item label="考勤状态">
      <el-tag :type="detailState.type" size="small">{{
        detailState.text
      }}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
  <el-calendar v-model="date">
    <template #header>
      <el-button type="primary" @click="handlePutTime">在线签到</el-button>
      <el-space>
        <el-button plain>{{ year }}年</el-button>
        <el-select v-model="month" @change="handleChange">
          <el-option
            v-for="item in 12"
            :key="item"
            :value="item"
            :label="item + '月'"
          />
        </el-select>
      </el-space>
    </template>

    <template #date-cell="{ data }">
      <div>{{ renderData(data.day) }}</div>
      <div class="show-time">{{ renderTime(data.day) }}</div>
    </template>
  </el-calendar>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
import { toZero } from "@/utils/common";
const router = useRouter();
const store = useStore();
const date = ref(new Date());
const year = date.value.getFullYear(); //年
const month = ref(date.value.getMonth() + 1); //月

// 用户打卡信息
const signsInfos = computed(() => store.state.signs.infos);
// 用户信息
const userInfos = computed(() => store.state.users.infos);
enum DetailKey {
  normal = "正常出勤",
  absent = "旷工",
  miss = "漏打卡",
  late = "迟到",
  early = "早退",
  lateAndEarly = "迟到并早退",
}
const detailValue = reactive({
  normal: 0, //正常
  absent: 0, //矿工
  miss: 0, //漏打卡
  late: 0, //迟到
  early: 0, // 早退
  lateAndEarly: 0, //迟到并早退
});

const detailState = reactive({
  type: "success" as "success" | "danger",
  text: "正常" as "正常" | "异常",
});

watchEffect((reset) => {
  const detailMonth = (signsInfos.value.detail as { [index: string]: unknown })[
    toZero(month.value)
  ] as { [index: string]: unknown };

  for (const attr in detailMonth) {
    switch (detailMonth[attr]) {
      case DetailKey.normal:
        detailValue.normal++;
        break;
      case DetailKey.absent:
        detailValue.absent++;
        break;
      case DetailKey.miss:
        detailValue.miss++;
        break;
      case DetailKey.late:
        detailValue.late++;
        break;
      case DetailKey.early:
        detailValue.early++;
        break;
      case DetailKey.lateAndEarly:
        detailValue.lateAndEarly++;
        break;
    }
  }

  for (const attr in detailValue) {
    if (
      attr !== "normal" &&
      detailValue[attr as keyof typeof detailValue] !== 0
    ) {
      detailState.type = "danger";
      detailState.text = "异常";
    }
  }

  reset(() => {
    detailState.type = "success";
    detailState.text = "正常";

    for (const attr in detailValue) {
      detailValue[attr as keyof typeof detailValue] = 0;
    }
  });
});

const handleChange = () => {
  date.value = new Date(`${year}.${month.value}`);
};
const handleToException = () => {
  router.push({
    path: "/exception",
    query: { month: month.value },
  });
};

// 渲染日期
const renderData = (day: string) => {
  return day.split("-")[2];
};

// 打卡时间
const renderTime = (day: string) => {
  const [year, month, date] = day.split("-"); //拿到年月日
  const ret = (
    (signsInfos.value.time as { [index: string]: unknown })[month] as {
      [index: string]: unknown;
    }
  )[date];

  if (Array.isArray(ret)) {
    return ret.join("-");
  }
};

// 在线签到
const handlePutTime = () => {
  store
    .dispatch("signs/putTime", { userid: userInfos.value._id })
    .then((res) => {
      if (res.data.errcode == 0) {
        store.commit("signs/updateInfos", res.data.infos);
        ElMessage.success("更新成功");
      }
    });
};
</script>

<style scoped lang="scss">
.el-descriptions {
  margin: 10px;
}
.el-select {
  width: 80px;
}
.show-time {
  text-align: center;
  line-height: 40px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
