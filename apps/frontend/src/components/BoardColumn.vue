<template>
  <v-card class="column-card flex-shrink-0 mr-4 rounded-lg d-flex flex-column pb-2" width="280" color="grey-lighten-4" elevation="0" border>
    
    <v-card-title class="text-subtitle-1 font-weight-bold pt-3 pb-2 px-3 d-flex justify-space-between align-center text-grey-darken-3">
      
      <v-text-field
        v-if="isEditingName"
        v-model="editName"
        density="compact"
        variant="underlined"
        hide-details
        autofocus
        color="primary"
        @blur="saveColumnName"
        @keyup.enter="saveColumnName"
        @keyup.esc="cancelEdit"
      ></v-text-field>

      <span 
        v-else 
        class="text-truncate mr-2" 
        style="cursor: pointer; width: 100%;" 
        @click="startEdit"
      >
        {{ column.name }}
      </span>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-horizontal" variant="text" density="compact" size="small" v-bind="props"></v-btn>
        </template>
        <v-list density="compact">
          <v-list-item prepend-icon="mdi-pencil-outline" title="Edit List Name" @click="startEdit"></v-list-item>
          <v-divider></v-divider>
          <v-list-item color="error" prepend-icon="mdi-delete-outline" title="Delete List" @click="$emit('columnDeleted', column.id)"></v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text class="px-3 py-0 overflow-y-auto d-flex flex-column gap-2" style="max-height: calc(100vh - 250px);">
      <draggable
        :list="column.cards"
        group="cards"
        item-key="id"
        class="d-flex flex-column gap-2"
        style="min-height: 50px;" 
        @change="handleDragChange"
      >
        <template #item="{ element }">
          <Card :card="element" @click="$emit('cardClicked', element)" />
        </template>
      </draggable>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from './Card.vue';
import draggable from 'vuedraggable';

const props = defineProps({
  column: { type: Object, required: true },
  boardId: { type: String, required: true }
});

// Added 'columnUpdated' to the emits array
const emit = defineEmits(['columnDeleted', 'cardClicked', 'cardMoved', 'columnUpdated']);

// --- Edit Column Logic ---
const isEditingName = ref(false);
const editName = ref('');

const startEdit = () => {
  editName.value = props.column.name;
  isEditingName.value = true;
};

const cancelEdit = () => {
  isEditingName.value = false;
};

const saveColumnName = () => {
  const trimmedName = editName.value.trim();
  
  // Only emit if the name is valid and actually changed
  if (trimmedName && trimmedName !== props.column.name) {
    emit('columnUpdated', {
      columnId: props.column.id,
      newName: trimmedName
    });
  }
  
  isEditingName.value = false;
};

// --- Drag Logic ---
const handleDragChange = (event: any) => {
  if (event.moved) {
    emit('cardMoved', {
      cardId: event.moved.element.id,
      oldColumnId: props.column.id,
      newColumnId: props.column.id,
      newIndex: event.moved.newIndex
    });
  } 
  else if (event.added) {
    emit('cardMoved', {
      cardId: event.added.element.id,
      oldColumnId: event.added.element.columnId,
      newColumnId: props.column.id,
      newIndex: event.added.newIndex
    });
    event.added.element.columnId = props.column.id;
  }
};
</script>