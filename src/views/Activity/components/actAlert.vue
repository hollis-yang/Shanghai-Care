<script setup>
import { computed } from "vue";
import { useActStore } from "../../../stores/activity";
import { Timer, Grid, HelpFilled, MoreFilled } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/stores/admin'
let adminStore = useAdminStore()
let actStore = useActStore();
const onSave = () => {
  if (
    !actStore.alert.time ||
    !actStore.alert.name ||
    !actStore.alert.community ||
    !actStore.alert.address
  ) {
    ElMessage({
    showClose: false,
    message: '请输入完整内容',
    type: 'error'
  })
    return;
  }
  actStore.add(actStore.alert.id);
};
const addflag = computed(() => actStore.addflag);
const editflag = computed(() => actStore.editflag);
</script>

<template>
  <div class="activity-alert">
    <div class="actAlert">
      <p>
        <span>
          <el-icon> <timer /> </el-icon>时间：
        </span>
        <el-date-picker
          v-model="actStore.alert.time"
          type="datetime"
          placeholder="请输入"
          :readonly="actStore.addEdit"
          format="YYYY-MM-DD HH:mm:ss"
        />
      </p>
      <p>
        <span>
          <el-icon> <Grid /> </el-icon>活动名称：
        </span>
        <input
          :readonly="actStore.addEdit"
          type="text"
          class="border"
          placeholder="请输入"
          v-model="actStore.alert.name"
        />
      </p>
      <p>
        <span>
          <el-icon> <HelpFilled /> </el-icon>所属社区：
        </span>
        <input
          :readonly="actStore.addEdit"
          type="text"
          class="border"
          placeholder="请输入"
          v-model="actStore.alert.community"
        />
      </p>
      <p>
        <span>
          <el-icon> <MoreFilled /> </el-icon>活动地址：
        </span>
        <input
          :readonly="actStore.addEdit"
          type="text"
          class="border"
          placeholder="请输入"
          v-model="actStore.alert.address"
        />
      </p>
      <p class="actAlert-but">
        <el-button v-if="addflag" @click="onSave" type="primary"
          >保存</el-button
        >
        <el-button
          v-if="editflag && adminStore.isadmin"
          @click="actStore.editBut"
          type="primary"
          >编辑</el-button
        >
        <el-button
          @click="actStore.endalert"
          type="primary"
          >关闭</el-button
        >
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
input {
  outline: none;
}

.activity-alert {
  z-index: 9;
  position: fixed;
  top: calc(50% - 120px);
  left: calc(50% - 260px);

  .actAlert {
    width: 380px;
    height: 200px;
    padding: 20px;
    background-color: #fff;
    color: #272827;
    border: 2px solid;

    p {
      width: 100%;
      display: flex;

      .el-input__wrapper {
        box-shadow: 0 0 0 1px #fff;
      }

      input {
        flex: 1;
        border: 0;
        box-shadow: none;
      }

      span {
        display: flex;
        align-items: center;
        .el-icon {
          padding-right: 5px;
        }
      }
    }

    .actAlert-but {
      display: flex;
      justify-content: end;
      margin-top: 25px;
    }
  }
  .border {
    border-bottom: 1px solid #ccc !important;
  }
}
</style>