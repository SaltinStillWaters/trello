<template>
  <v-dialog v-model="isOpen" max-width="400">
    
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn 
        v-bind="activatorProps"
        prepend-icon="mdi-plus" 
        variant="text" 
        class="text-none w-100 justify-start text-grey-darken-1 font-weight-medium"
      >
        Add a card
      </v-btn>
    </template>

    <v-card rounded="lg" title="Add New Card">
      <v-card-text>
        <v-text-field
          v-model="newCardTitle"
          label="Card Title"
          variant="outlined"
          autofocus
          hide-details
          @keyup.enter="submitCard"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="isOpen = false">Cancel</v-btn>
        <v-btn 
          color="primary" 
          variant="flat" 
          :loading="isSaving" 
          :disabled="!newCardTitle.trim()" 
          @click="submitCard"
        >
          Add Card
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '@/axios'; // Adjust this import if your axios instance is elsewhere

// The component's props
const props = defineProps({
  boardId: { type: String, required: true },
  columnId: { type: String, required: true }
});

const emit = defineEmits(['cardCreated']);

const isOpen = ref(false);
const isSaving = ref(false);
const newCardTitle = ref('');

const submitCard = async () => {
  if (!newCardTitle.value.trim()) return;
  
  isSaving.value = true;
  try {
    const response = await api.post(`boards/${props.boardId}/columns/${props.columnId}/cards`, {
      title: newCardTitle.value
    });
    
    emit('cardCreated', response.data);
    
    newCardTitle.value = '';
    isOpen.value = false;
  } catch (error) {
    console.error('Failed to add card:', error);
  } finally {
    isSaving.value = false;
  }
};
</script>