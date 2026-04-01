<template>
  <v-container fluid class="fill-height bg-grey-lighten-4 d-flex align-center justify-center">
    
    <div class="text-center">
      <v-icon size="120" color="grey-lighten-1" class="mb-6">
        mdi-view-column-outline
      </v-icon>

      <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-3">
        Welcome to your Workspace
      </h1>
      
      <p class="text-body-1 text-grey-darken-1 mb-8 mx-auto" style="max-width: 450px;">
        Select a board from the sidebar to view its details, manage your tasks, and collaborate with your team.
      </p>

      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        variant="flat"
        rounded="lg"
        class="font-weight-bold px-6"
        @click="handleCreateBoard"
      >
        Create New Board
      </v-btn>
    </div>

    <CreateBoardDialog 
      ref="createDialogRef" 
      @board-created="onBoardCreated" 
    />

  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import CreateBoardDialog from '@/components/CreateBoardDialog.vue'; // Update this path to match your folder structure
import { useBoardStore } from '@/stores/board';
import { useRouter } from 'vue-router';

// 1. Create a reference to the child component
const createDialogRef = ref(null);

// 2. Trigger the exposed 'open' method when the button is clicked
const handleCreateBoard = () => {
  if (createDialogRef.value) {
    createDialogRef.value.open();
  }
};

const boardStore = useBoardStore()
const router = useRouter()

// 3. Handle the data when the dialog successfully submits
const onBoardCreated = (newBoardData) => {
  console.log('Success! The board data caught by the parent is:', newBoardData);
  boardStore.fetchBoards()  
  createDialogRef.value.close()
  router.push(`/boards/${newBoardData.id}`);
};
</script>