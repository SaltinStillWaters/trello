<template>
    <v-snackbar-queue v-model="UIStore.queue" :total-visible="3" :timeout="3000" location="top" closable />
</template>

<script setup lang=ts>
import { useUIStore } from '@/stores/ui';

const UIStore = useUIStore()

</script>