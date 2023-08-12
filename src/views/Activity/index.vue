<script setup>
import ActivityHeader from './components/ActivityHeader.vue'
import detail from './components/detail.vue'
import mytable from './components/tabel.vue'
import actAlert from './components/actAlert.vue'
import { useActStore } from '../../stores/activity'
let actStore = useActStore()
</script>

<template>
  <div class="activity-container">
    <div class="activity-header">
      <ActivityHeader></ActivityHeader>
    </div>
    <div class="activity-content">
      <div class="activity-nav">
        <div class="activity-nav-search">
          <!-- 查询筛选 -->
          <detail></detail>
        </div>
      </div>
      <div class="activity-tabel">
        <!-- 表格、分页、新增 -->
        <mytable></mytable>
      </div>
    </div>
    <div v-if="actStore.alertflag">
      <actAlert></actAlert>
    </div>
  </div>
</template>

<style scoped lang="less">
.activity-header {
  width: 100%;
  height: 10vh;
}

.activity-tabel {
  width: 90%;
  height: 500px;
  margin: 0 auto;
  background-color: #0000006b;
  position: relative;
  top: -15px;
}

input {
  outline: none;
}
</style>