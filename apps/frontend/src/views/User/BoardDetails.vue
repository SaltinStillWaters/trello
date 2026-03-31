<template>
  <v-container fluid class="fill-height pa-0 d-flex flex-column bg-blue-grey-lighten-5">
    
    <v-overlay :model-value="isLoading" class="align-center justify-center" persistent>
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <template v-if="board.id">
      <div class="w-100 px-6 py-4 bg-white border-b d-flex align-center justify-space-between flex-shrink-0">
        <div>
          <h1 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">{{ board.name }}</h1>
          <p v-if="board.description" class="text-caption text-grey-darken-1 mb-0">{{ board.description }}</p>
        </div>
        <v-btn icon="mdi-cog-outline" variant="text" color="grey-darken-1"></v-btn>
      </div>

      <div class="board-canvas flex-grow-1 w-100 pa-4 d-flex align-start overflow-x-auto">
        
        <v-card
          v-for="column in board.columns"
          :key="column.id"
          class="column-card flex-shrink-0 mr-4 rounded-lg d-flex flex-column"
          width="280"
          color="grey-lighten-4"
          elevation="0"
          border
        >
          <v-card-title class="text-subtitle-1 font-weight-bold pt-3 pb-2 px-3 d-flex justify-space-between align-center text-grey-darken-3">
            {{ column.name }}
            <v-btn icon="mdi-dots-horizontal" variant="text" density="compact" size="small"></v-btn>
          </v-card-title>

          <v-card-text class="px-3 py-0 overflow-y-auto d-flex flex-column gap-2" style="max-height: calc(100vh - 250px);">
            <v-card v-for="card in column.cards" :key="card.id" class="mb-2 rounded border" elevation="0" hover>
              <v-card-text class="pa-3 text-body-2 text-grey-darken-3">
                {{ card.title }}
              </v-card-text>
            </v-card>
          </v-card-text>

          <v-card-actions class="px-2 pb-2 pt-1">
            <v-btn prepend-icon="mdi-plus" variant="text" class="text-none w-100 justify-start" @click="openAddCard(column.id)">
              Add a card
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-btn
          class="flex-shrink-0 text-none justify-start font-weight-medium"
          width="280"
          height="48"
          prepend-icon="mdi-plus"
          variant="flat"
          color="white"
          elevation="0"
          border
          @click="openAddColumn" 
        >
          Add another list
        </v-btn>
      </div>
    </template>

    <v-dialog v-model="isColumnDialogOpen" max-width="400">
      <v-card rounded="lg" title="Create New List">
        <v-card-text>
          <v-text-field
            v-model="newColumnName"
            label="List Title"
            variant="outlined"
            autofocus
            @keyup.enter="addColumn"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="isColumnDialogOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :loading="isSavingColumn" @click="addColumn">Add List</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/axios';

const route = useRoute();
const isLoading = ref(false);
const board = ref({ id: '', name: '', description: '', columns: [] });

// UI State
const isColumnDialogOpen = ref(false);
const isSavingColumn = ref(false);
const newColumnName = ref('');

const fetchBoardData = async (id) => {
  if (!id) return;
  isLoading.value = true;
  try {
    const response = await api.get(`boards/${id}`);
    board.value = response.data;
  } catch (error) {
    console.error('Failed to fetch board:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchBoardData(route.params.id));
watch(() => route.params.id, (newId) => fetchBoardData(newId));

// Logic
const openAddColumn = () => {
  isColumnDialogOpen.value = true;
};

const addColumn = async () => {
  if (!newColumnName.value.trim()) return;
  isSavingColumn.value = true;
  try {
    const response = await api.post(`boards/${board.value.id}/columns`, {
      name: newColumnName.value
    });
    
    board.value.columns.push({ ...response.data, cards: [] });
    
    newColumnName.value = '';
    isColumnDialogOpen.value = false;
  } catch (error) {
    console.error('Column creation failed:', error);
  } finally {
    isSavingColumn.value = false;
  }
};

const openAddCard = (columnId) => {
  console.log('Next step: Implement Add Card for column', columnId);
};
</script>