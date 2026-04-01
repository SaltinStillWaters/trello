<template>
  <v-card
    class="mb-3 cursor-pointer border"
    elevation="0"
    hover
    :loading="isLoadingDetails"
    @click="fetchCardDetails"
  >
    <v-card-text class="pa-3">
      <h3 class="text-subtitle-2 font-weight-medium text-grey-darken-4 mb-0">
        {{ card.title }}
      </h3>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '@/axios';
import { Color, useUIStore } from '@/stores/ui';

const props = defineProps<{
  card: {
    id: string;
    title: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  boardId: string;
  columnId: string;
}>();

const emit = defineEmits(['openDetails']);

const isLoadingDetails = ref(false);

const uiStore = useUIStore()

const fetchCardDetails = async () => {
  if (isLoadingDetails.value) return; 
  
  isLoadingDetails.value = true;
  try {
    const response = await api.get(
      `boards/${props.boardId}/columns/${props.columnId}/cards/${props.card.id}`
    );
    
    emit('openDetails', { ...response.data, columnId: props.columnId });
  } catch (error) {
    uiStore.queueMessage(Color.ERROR, error?.response?.data?.message ?? 'Failed to fetch full card details:')
    emit('openDetails', { ...props.card, columnId: props.columnId });
  } finally {
    isLoadingDetails.value = false;
  }
};
</script>