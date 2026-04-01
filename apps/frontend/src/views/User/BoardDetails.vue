<template>
  <v-container
    fluid
    class="fill-height pa-0 d-flex flex-column bg-blue-grey-lighten-5"
  >
    <v-overlay
      :model-value="isLoading"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <template v-if="board.id">
      <div
        class="w-100 px-6 py-4 bg-white border-b d-flex align-center justify-space-between flex-shrink-0"
      >
        <div class="d-flex align-center gap-3">
          <h1 class="text-h5 font-weight-bold text-grey-darken-3 mb-0">
            {{ board.name }}
          </h1>
          
          <template v-if="board.description">
            <v-divider vertical class="mx-1" inset></v-divider>
            <p class="text-body-2 text-grey-darken-1 mb-0">
              {{ board.description }}
            </p>
          </template>
        </div>

        <div class="d-flex align-center gap-2">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            elevation="0"
            :disabled="!hasColumns"
            @click="isCardDialogOpen = true"
            class="mr-2"
          >
            Add Card
          </v-btn>

          <v-divider vertical class="mx-1 my-2" inset></v-divider>

          <v-btn
            variant="text"
            color="grey-darken-2"
            prepend-icon="mdi-pencil-outline"
            @click="editBoard"
          >
            Edit
          </v-btn>

          <v-btn
            variant="text"
            color="error"
            prepend-icon="mdi-delete-outline"
            @click="deleteBoard"
          >
            Delete
          </v-btn>
        </div>
      </div>

      <div
        class="board-canvas flex-grow-1 w-100 pa-4 d-flex align-start overflow-x-auto"
      >
        <BoardColumn 
          v-for="column in board.columns" 
          :key="column.id" 
          :column="column" 
          :board-id="board.id"
          @columnDeleted="handleColumnDeleted"
          @columnUpdated="handleColumnUpdated" 
          @cardClicked="openCardDetails"
          @cardMoved="syncCardPosition" 
        />

        <v-btn
          class="flex-shrink-0 text-none justify-start font-weight-medium"
          width="280"
          height="48"
          prepend-icon="mdi-plus"
          variant="flat"
          color="white"
          elevation="0"
          border
          @click="isColumnDialogOpen = true"
        >
          Add another list
        </v-btn>
      </div>
    </template>

    <v-dialog v-model="isEditBoardDialogOpen" max-width="500">
      <v-card rounded="lg" title="Edit Board">
        <v-card-text>
          <v-text-field
            v-model="editBoardData.name"
            label="Board Name"
            variant="outlined"
            autofocus
            hide-details
            class="mb-4"
          ></v-text-field>
          <v-textarea
            v-model="editBoardData.description"
            label="Description (Optional)"
            variant="outlined"
            rows="3"
            hide-details
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="isEditBoardDialogOpen = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="isSavingBoard"
            :disabled="!editBoardData.name.trim()"
            @click="updateBoardDetails"
          >Save Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          <v-btn
            color="primary"
            variant="flat"
            :loading="isSavingColumn"
            @click="addColumn"
          >Add List</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isCardDetailsDialogOpen" max-width="600">
      <v-card rounded="lg" v-if="selectedCard">
        <v-card-title class="d-flex justify-space-between align-center px-6 pt-6 pb-2">
          <span class="text-h6 font-weight-bold">Card Details</span>
          <v-btn icon="mdi-close" variant="text" density="compact" @click="isCardDetailsDialogOpen = false"></v-btn>
        </v-card-title>

        <v-card-text class="px-6 py-2">
          <div class="text-caption text-grey-darken-1 mb-4 d-flex gap-4">
            <span v-if="selectedCard.createdAt">
              <v-icon size="x-small" class="mr-1">mdi-clock-outline</v-icon>
              Created: {{ new Date(selectedCard.createdAt).toLocaleDateString() }}
            </span>
          </div>

          <v-text-field
            v-model="selectedCard.title"
            label="Title"
            variant="outlined"
            class="mb-4"
            hide-details
          ></v-text-field>

          <v-textarea
            v-model="selectedCard.description"
            label="Description"
            variant="outlined"
            rows="5"
            hide-details
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="px-6 pb-6 pt-2">
          <v-btn 
            color="error" 
            variant="text" 
            prepend-icon="mdi-delete-outline"
            :loading="isDeletingCard"
            @click="deleteCard"
          >
            Delete Card
          </v-btn>
          
          <v-spacer></v-spacer>
          
          <v-btn variant="text" @click="isCardDetailsDialogOpen = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="isUpdatingCard"
            :disabled="!selectedCard.title.trim()"
            @click="updateCardDetails"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isCardDialogOpen" max-width="400">
      <v-card rounded="lg" title="Add New Card to Inbox">
        <v-card-text>
          <v-text-field
            v-model="newCardTitle"
            label="Card Title"
            variant="outlined"
            autofocus
            hide-details
            class="mb-4"
          ></v-text-field>
          <v-textarea
            v-model="newCardDescription"
            label="Description (Optional)"
            variant="outlined"
            rows="3"
            hide-details
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="isCardDialogOpen = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="isSavingCard"
            :disabled="!newCardTitle.trim()"
            @click="addCardToFirstColumn"
          >Add Card</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/axios";
import BoardColumn from "@/components/BoardColumn.vue";
import { useBoardStore } from "@/stores/board";

const route = useRoute();
const router = useRouter();

// --- State ---
const isLoading = ref(false);
const board = ref({ id: "", name: "", description: "", columns: [] });

// Edit Board Dialog State
const isEditBoardDialogOpen = ref(false);
const isSavingBoard = ref(false);
const editBoardData = ref({ name: "", description: "" });

// Column Dialog State
const isColumnDialogOpen = ref(false);
const isSavingColumn = ref(false);
const newColumnName = ref("");

// Add Card Dialog State
const isCardDialogOpen = ref(false);
const isSavingCard = ref(false);
const newCardTitle = ref("");
const newCardDescription = ref("");

// Card Details Dialog State
const isCardDetailsDialogOpen = ref(false);
const isUpdatingCard = ref(false);
const isDeletingCard = ref(false);
const selectedCard = ref<any>(null);

// --- Computed ---
const hasColumns = computed(
  () => board.value.columns && board.value.columns.length > 0,
);

// --- API Methods ---
const fetchBoardData = async (id: string | string[]) => {
  if (!id) return;
  isLoading.value = true;
  try {
    const response = await api.get(`boards/${id}`);
    board.value = response.data;
  } catch (error: any) {
    console.error("Failed to fetch board:", error);
    
    // Check if the error is a 404
    if (error.response && error.response.status === 404) {
      // Optional: Show a message to the user
      // uiStore.queueMessage(Color.ERROR, 'Board not found')
      
      router.push({ name: 'Dashboard' }); // Redirect back home
    }
  } finally {
    isLoading.value = false;
  }
};

const syncCardPosition = async (moveData: {
  cardId: string;
  oldColumnId: string;
  newColumnId: string;
  newIndex: number;
}) => {
  const { cardId, oldColumnId, newColumnId, newIndex } = moveData;
  const url = `boards/${board.value.id}/columns/${oldColumnId}/cards/${cardId}`;

  try {
    await api.patch(url, {
      columnId: newColumnId,
      order: newIndex,
    });
  } catch (error) {
    console.error("Failed to sync card position:", error);
    fetchBoardData(board.value.id);
  }
};

const addColumn = async () => {
  if (!newColumnName.value.trim()) return;
  isSavingColumn.value = true;
  try {
    const response = await api.post(`boards/${board.value.id}/columns`, {
      name: newColumnName.value,
    });

    board.value.columns.push({ ...response.data, cards: [] } as never);

    newColumnName.value = "";
    isColumnDialogOpen.value = false;
  } catch (error) {
    console.error("Column creation failed:", error);
  } finally {
    isSavingColumn.value = false;
  }
};

const addCardToFirstColumn = async () => {
  if (!newCardTitle.value.trim() || !hasColumns.value) return;

  isSavingCard.value = true;
  const firstColumn: any = board.value.columns[0];

  try {
    const response = await api.post(
      `boards/${board.value.id}/columns/${firstColumn.id}/cards`,
      {
        title: newCardTitle.value,
        description: newCardDescription.value,
      },
    );

    if (!firstColumn.cards) {
      firstColumn.cards = [];
    }
    firstColumn.cards.push(response.data);

    newCardTitle.value = "";
    newCardDescription.value = "";
    isCardDialogOpen.value = false;
  } catch (error) {
    console.error("Failed to add card:", error);
  } finally {
    isSavingCard.value = false;
  }
};

const updateCardDetails = async () => {
  if (!selectedCard.value?.title.trim()) return;
  
  isUpdatingCard.value = true;
  try {
    const { id, title, description, columnId } = selectedCard.value;
    
    const response = await api.patch(
      `boards/${board.value.id}/columns/${columnId}/cards/${id}`, 
      { title, description }
    );

    const column = board.value.columns.find((c: any) => c.id === columnId) as any;
    if (column) {
      const cardIndex = column.cards.findIndex((c: any) => c.id === id);
      if (cardIndex !== -1) {
        column.cards[cardIndex] = { ...column.cards[cardIndex], ...response.data };
      }
    }

    isCardDetailsDialogOpen.value = false;
  } catch (error) {
    console.error("Failed to update card details:", error);
  } finally {
    isUpdatingCard.value = false;
  }
};

const deleteCard = async () => {
  if (!selectedCard.value) return;
  
  isDeletingCard.value = true;
  try {
    const { id, columnId } = selectedCard.value;
    
    await api.delete(`boards/${board.value.id}/columns/${columnId}/cards/${id}`);

    const column = board.value.columns.find((c: any) => c.id === columnId) as any;
    if (column && column.cards) {
      column.cards = column.cards.filter((c: any) => c.id !== id);
    }

    isCardDetailsDialogOpen.value = false;
  } catch (error) {
    console.error("Failed to delete card:", error);
  } finally {
    isDeletingCard.value = false;
    fetchBoardData(board.value.id);
  }
};

// --- Board Level Handlers ---
const editBoard = () => {
  // Pre-fill the dialog with existing data
  editBoardData.value = {
    name: board.value.name,
    description: board.value.description || ""
  };
  isEditBoardDialogOpen.value = true;
};

const updateBoardDetails = async () => {
  if (!editBoardData.value.name.trim()) return;
  
  isSavingBoard.value = true;
  try {
    const response = await api.patch(`boards/${board.value.id}`, {
      name: editBoardData.value.name,
      description: editBoardData.value.description
    });

    // Update local state to reflect changes instantly
    board.value.name = response.data.name;
    board.value.description = response.data.description;
    
    isEditBoardDialogOpen.value = false;
  } catch (error) {
    console.error("Failed to update board details:", error);
    // If it fails, refresh from server to ensure data consistency
    fetchBoardData(board.value.id);
  } finally {
    isSavingBoard.value = false;
  }
};

const boardStore = useBoardStore()

const deleteBoard = async () => {
  const isConfirmed = confirm("Are you sure you want to delete this board? This action cannot be undone.");
  
  if (!isConfirmed) return;

  isLoading.value = true;
  try {
    await api.delete(`boards/${board.value.id}`);
    boardStore.fetchBoards()
    router.push('/boards'); 
  } catch (error) {
    console.error("Failed to delete board:", error);
  } finally {
    isLoading.value = false;
  }
};

// --- Event Handlers ---
const handleColumnDeleted = async (columnId: string) => {
  await api.delete(`boards/${board.value.id}/columns/${columnId}`);
  fetchBoardData(board.value.id);
};

const handleColumnUpdated = async (updateData: { columnId: string, newName: string }) => {
  try {
    const columnToUpdate = board.value.columns.find((c: any) => c.id === updateData.columnId);
    if (columnToUpdate) {
      columnToUpdate.name = updateData.newName;
    }

    await api.patch(`boards/${board.value.id}/columns/${updateData.columnId}`, {
      name: updateData.newName
    });
  } catch (error) {
    console.error('Failed to update column name:', error);
    fetchBoardData(board.value.id);
  }
};

const openCardDetails = (fetchedCardData: any) => {
  selectedCard.value = { ...fetchedCardData };
  isCardDetailsDialogOpen.value = true;
};

// --- Lifecycle Hooks ---
onMounted(() => fetchBoardData(route.params.id));

watch(
  () => route.params.id,
  (newId) => fetchBoardData(newId as string),
);
</script>