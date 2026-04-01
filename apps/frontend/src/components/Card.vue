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

// Fetch full details from API before opening the modal
const fetchCardDetails = async () => {
  if (isLoadingDetails.value) return; 
  
  isLoadingDetails.value = true;
  try {
    const response = await api.get(
      `boards/${props.boardId}/columns/${props.columnId}/cards/${props.card.id}`
    );
    
    // Pass along the columnId so the parent knows exactly where this card lives
    emit('openDetails', { ...response.data, columnId: props.columnId });
  } catch (error) {
    console.error('Failed to fetch full card details:', error);
    emit('openDetails', { ...props.card, columnId: props.columnId });
  } finally {
    isLoadingDetails.value = false;
  }
};
</script>