<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref } from 'vue'
import { computed } from 'vue'

// 一个使用getSQLAPI的例子
const sqlResult = ref([])
const startQuery = async () => {
  const sql = "SELECT * FROM nursing_workers"
  const res = await getSQLAPI(sql)
  console.log(res)
  sqlResult.value = res
}
onMounted(() => startQuery())  // 挂载

// 选出前10条结果进行测试
const filteredResult = computed(() => {
  return sqlResult.value.slice(0, 10);
})
</script>

<template>
  <ul>
    <li v-for="item in filteredResult" :key="item.id">
      {{ item[1] }} --- {{ item[2] }} --- {{ item[3] }} --- {{ item[4] }}
    </li>
  </ul>
</template>

<style scoped></style>