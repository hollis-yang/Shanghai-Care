<template>
    <Components/>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps({
  Components: String,
})
const { Components } = toRefs(props)
</script>