<template>
  <div class="apply-title">
    <el-button type="primary" @click="handleOpen">添加审批</el-button>
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

  <!-- 弹出层 -->
  <el-dialog
    v-model="dialogVisible"
    title="添加审批"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="审批人" prop="approvername">
        <el-select v-model="ruleForm.approvername">
          <el-option
            v-for="item in approver"
            :key="item._id"
            placeholder="请输入审批人"
            :value="item.name"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批事由" prop="reason">
        <el-select v-model="ruleForm.reason" placeholder="请输入审批事由">
          <el-option value="年假" label="年假"></el-option>
          <el-option value="事假" label="事假"></el-option>
          <el-option value="病假" label="病假"></el-option>
          <el-option value="外出" label="外出"></el-option>
          <el-option value="补签卡" label="补签卡"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-date-picker
          v-model="ruleForm.time"
          type="datetimerange"
          start-placeholder="起始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="ruleForm.note"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button
        type="primary"
        @click="submitForm(ruleFormRef)"
        auto-insert-space
        >提交</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
import { FormInstance, FormRules } from "element-plus";
import moment from "moment";
const store = useStore();
interface ApplyList {
  applicantid: string;
  applicantname: string;
  approverid: string;
  approvername: string;
  note: string;
  reason: string;
  time: string[];
}

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
const userInfos = computed(() => store.state.users.infos);
console.log("userInfos", userInfos.value);

const approver = computed(
  () => userInfos.value.approver as { [index: string]: unknown }[]
);
const pageCurrent = ref(1); //当前从第一页开始
const pageSize = ref(10); //一页几个数据 就是个数 10个做一页

const dialogVisible = ref(false);

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

// 弹出层逻辑
const ruleFormRef = ref<FormInstance>(); //表单实例
const ruleForm = reactive<ApplyList>({
  applicantid: "",
  applicantname: "",
  approverid: "",
  approvername: "",
  note: "",
  reason: "",
  time: ["", ""],
});
// 自定义校验
const validatorTime = (rule: any, value: any, callback: any) => {
  if (!value[0] && !value[1]) {
    callback(new Error("请选择审批时间"));
  } else {
    callback();
  }
  // console.log("rule", rule);
  // console.log("value", value);
};

const rules = reactive<FormRules>({
  approvername: [{ required: true, message: "请选择审批人", trigger: "blur" }],
  reason: [{ required: true, message: "请选择请假事由", trigger: "blur" }],
  time: [
    { validator: validatorTime, message: "请选择审批时间", trigger: "blur" },
  ],
  note: [{ required: true, message: "请选择审批备注", trigger: "blur" }],
});
const handleClose = () => {
  dialogVisible.value = false;
};

const handleOpen = () => {
  dialogVisible.value = true;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      ruleForm.applicantid = userInfos.value._id as string;
      ruleForm.applicantname = userInfos.value.name as string;
      ruleForm.approverid = (
        approver.value.find((v) => v.name === ruleForm.approvername) as {
          [index: string]: unknown;
        }
      )._id as string;
      ruleForm.time[0] = moment(ruleForm.time[0]).format("YYYY-MM-DD hh:mm:ss");
      ruleForm.time[1] = moment(ruleForm.time[1]).format("YYYY-MM-DD hh:mm:ss");
      store.dispatch("checks/postApply", ruleForm).then((res) => {
        // 添加之后页面更新
        if (res.data.errcode === 0) {
          store
            .dispatch("checks/getApply", { applicantid: userInfos.value._id })
            .then((res) => {
              if (res.data.errcode === 0) {
                store.commit("check/updateApplyList", res.data.rets);
              }
            });
          ElMessage.success("添加成功");
          resetForm(ruleFormRef.value);
          handleClose();
        }
      });
    } else {
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
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
