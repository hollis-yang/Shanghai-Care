<template>
  <Components />
</template>
<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  Components: String,
})
const { Components } = toRefs(props)
</script>