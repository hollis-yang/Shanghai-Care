<template>
    <Components/>
</template>
<script setup lang="ts">
import { ref, toRefs, inject } from 'vue';

const props = defineProps({
  Components: String,
})
const { Components } = toRefs(props)
</script>