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
        <div>
          <h1 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">
            {{ board.name }}
          </h1>
          <p
            v-if="board.description"
            class="text-caption text-grey-darken-1 mb-0"
          >
            {{ board.description }}
          </p>
        </div>

        <div class="d-flex align-center gap-3">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            elevation="0"
            :disabled="!hasColumns"
            @click="isCardDialogOpen = true"
          >
            Add Card
          </v-btn>
          <v-btn
            icon="mdi-cog-outline"
            variant="text"
            color="grey-darken-1"
          ></v-btn>
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
          <v-btn variant="text" @click="isColumnDialogOpen = false"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            variant="flat"
            :loading="isSavingColumn"
            @click="addColumn"
            >Add List</v-btn
          >
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
            @keyup.enter="addCardToFirstColumn"
          ></v-text-field>
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
            >Add Card</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import api from "@/axios";
import BoardColumn from "@/components/BoardColumn.vue";

const route = useRoute();

// State
const isLoading = ref(false);
const board = ref({ id: "", name: "", description: "", columns: [] });

const isColumnDialogOpen = ref(false);
const isSavingColumn = ref(false);
const newColumnName = ref("");

const isCardDialogOpen = ref(false);
const isSavingCard = ref(false);
const newCardTitle = ref("");

const handleColumnUpdated = async (updateData: { columnId: string, newName: string }) => {
  try {
    // 1. Find the column in the local state and update it immediately for a snappy UI
    const columnToUpdate = board.value.columns.find(c => c.id === updateData.columnId);
    if (columnToUpdate) {
      columnToUpdate.name = updateData.newName;
    }

    // 2. Send the PATCH request to your NestJS backend
    await api.patch(`boards/${board.value.id}/columns/${updateData.columnId}`, {
      name: updateData.newName
    });
  } catch (error) {
    console.error('Failed to update column name:', error);
    // Rollback by re-fetching if the server rejects the change
    fetchBoardData(board.value.id);
  }
};

// Computed
const hasColumns = computed(
  () => board.value.columns && board.value.columns.length > 0,
);

// API Methods
const fetchBoardData = async (id: string | string[]) => {
  if (!id) return;
  isLoading.value = true;
  try {
    const response = await api.get(`boards/${id}`);
    board.value = response.data;
  } catch (error) {
    console.error("Failed to fetch board:", error);
  } finally {
    isLoading.value = false;
  }
};
// Add this inside BoardView.vue
const syncCardPosition = async (moveData: {
  cardId: string;
  oldColumnId: string;
  newColumnId: string;
  newIndex: number;
}) => {
  const { cardId, oldColumnId, newColumnId, newIndex } = moveData;

  // We construct the URL exactly as your NestJS route demands:
  // @Controller('boards/:boardId/columns/:columnId/cards') -> @Patch(':id')
  const url = `boards/${board.value.id}/columns/${oldColumnId}/cards/${cardId}`;

  try {
    // We send the DTO in the body
    await api.patch(url, {
      columnId: newColumnId, // Matches @IsOptional() columnId?: string;
      order: newIndex, // Matches @IsOptional() order?: number;
    });
  } catch (error) {
    console.error("Failed to sync card position:", error);
    // If the server rejects the move, refresh the board to snap the UI back to reality
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

    board.value.columns.push({ ...response.data, cards: [] });

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
  const firstColumn = board.value.columns[0];

  try {
    const response = await api.post(
      `boards/${board.value.id}/columns/${firstColumn.id}/cards`,
      {
        title: newCardTitle.value,
      },
    );

    if (!firstColumn.cards) {
      firstColumn.cards = [];
    }
    firstColumn.cards.push(response.data);

    newCardTitle.value = "";
    isCardDialogOpen.value = false;
  } catch (error) {
    console.error("Failed to add card:", error);
  } finally {
    isSavingCard.value = false;
  }
};

// Event Handlers
const handleColumnDeleted = async (columnId: string) => {
  await api.delete(`boards/${board.value.id}/columns/${columnId}`)
  fetchBoardData(board.value.id)
};

const openCardDetails = (card: any) => {
  console.log("Opening details for card:", card.title);
};

// Lifecycle Hooks (Now safely at the bottom after methods are declared)
onMounted(() => fetchBoardData(route.params.id));
watch(
  () => route.params.id,
  (newId) => fetchBoardData(newId),
);
</script>
