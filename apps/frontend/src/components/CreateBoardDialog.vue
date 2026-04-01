<template>
  <v-dialog v-model="isOpen" max-width="500px" persistent>
    <v-card class="pa-2 rounded-lg">
      <v-card-title class="text-h5 font-weight-bold d-flex align-center justify-space-between pt-4 px-4">
        Create New Board
        <v-btn icon="mdi-close" variant="text" density="comfortable" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="px-4 pt-4 pb-0">
        <v-form ref="formRef" @submit.prevent="submit">
          <v-text-field
            v-model="formData.name"
            label="Board Name"
            placeholder="e.g., Marketing Campaign, MVP Launch"
            variant="outlined"
            color="primary"
            :rules="[v => !!v || 'Board name is required']"
            required
            class="mb-2"
          ></v-text-field>

          <v-textarea
            v-model="formData.description"
            label="Description (Optional)"
            placeholder="What is this board for?"
            variant="outlined"
            color="primary"
            rows="3"
            auto-grow
            hide-details="auto"
            class="mb-4"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-4 pb-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn 
          color="grey-darken-1" 
          variant="text" 
          class="text-none font-weight-bold px-4"
          @click="close"
          :disabled="isLoading"
        >
          Cancel
        </v-btn>
        
        <v-btn 
          color="primary" 
          variant="flat" 
          class="text-none font-weight-bold px-6"
          @click="submit"
          :loading="isLoading"
        >
          Create Board
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import api from '@/axios';
import axios from 'axios';
import { ref, reactive } from 'vue';

const isOpen = ref(false);
const isLoading = ref(false);
const formRef = ref(null);

const formData = reactive({
  name: '',
  description: ''
});

const emit = defineEmits(['board-created']);

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  formData.name = '';
  formData.description = '';
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;

  try {
    // Simulating backend call
    console.log('Submitting new board:', formData);
    const result = await api.post('boards', {
      ...formData
    })

    emit('board-created', { ...formData, ...result.data });
    close();
  } catch (error) {
    console.error('Failed to create board:', error);
  } finally {
    isLoading.value = false;
  }
};

defineExpose({ open, close });
</script>