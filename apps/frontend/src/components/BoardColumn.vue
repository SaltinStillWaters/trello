<template>
  <v-card
    class="column-card flex-shrink-0 mr-4 rounded-lg d-flex flex-column"
    width="280"
    color="grey-lighten-4"
    elevation="0"
    border
  >
    <v-card-title class="text-subtitle-1 font-weight-bold pt-3 pb-2 px-3 d-flex justify-space-between align-center text-grey-darken-3">
      {{ column.name }}
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-horizontal" variant="text" density="compact" size="small" v-bind="props"></v-btn>
        </template>
        <v-list density="compact">
          <v-list-item color="error" prepend-icon="mdi-delete-outline" title="Delete List" @click="deleteColumn"></v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text class="px-3 py-0 overflow-y-auto d-flex flex-column gap-2" style="max-height: calc(100vh - 250px);">
      <BoardCard 
        v-for="card in column.cards" 
        :key="card.id" 
        :card="card" 
        @click="openCardDetails"
      />
    </v-card-text>

    <v-card-actions class="px-2 pb-2 pt-1">
      <v-btn 
        prepend-icon="mdi-plus" 
        variant="text" 
        class="text-none w-100 justify-start text-grey-darken-1 font-weight-medium" 
        @click="isCardDialogOpen = true"
      >
        Add a card
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="isCardDialogOpen" max-width="400">
      <v-card rounded="lg" title="Add New Card">
        <v-card-text>
          <v-text-field
            v-model="newCardTitle"
            label="Card Title"
            variant="outlined"
            autofocus
            hide-details
            @keyup.enter="addCard"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="isCardDialogOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :loading="isSaving" :disabled="!newCardTitle.trim()" @click="addCard">Add Card</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/axios';
import BoardCard from './BoardCard.vue'; // Import the new Card component

const props = defineProps({
  column: { type: Object, required: true },
  boardId: { type: String, required: true }
});

const isCardDialogOpen = ref(false);
const isSaving = ref(false);
const newCardTitle = ref('');

const addCard = async () => {
  if (!newCardTitle.value.trim()) return;
  isSaving.value = true;
  try {
    const response = await api.post(`boards/${props.boardId}/columns/${props.column.id}/cards`, {
      title: newCardTitle.value
    });
    props.column.cards.push(response.data);
    newCardTitle.value = '';
    isCardDialogOpen.value = false;
  } catch (error) {
    console.error('Failed to add card:', error);
  } finally {
    isSaving.value = false;
  }
};

const deleteColumn = () => {
  console.log('Implement delete column logic here');
};

const openCardDetails = (card) => {
  console.log('Opening details for card:', card.title);
};
</script>