<template>
  <v-card elevation="2" class="rounded-lg">
    <v-card-title class="d-flex align-center pe-2 pa-4">
      <v-icon class="mr-2">mdi-warehouse</v-icon>
      <span class="text-h6 font-weight-bold">Inventory Management</span>
      <v-spacer></v-spacer>
      
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        label="Search inventory..."
        single-line
        hide-details
        variant="outlined"
        style="max-width: 300px;"
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="inventoryData"
      :search="search"
      hover
      class="text-body-2"
    >
      <template #[`item.product.price`]="{ item }">
        <span class="font-weight-medium text-primary">
          ${{ item.product.price.toFixed(2) }}
        </span>
      </template>

      <template #[`item.stock`]="{ item }">
        <v-chip
          :color="getStockColor(item.stock)"
          size="small"
          class="font-weight-bold"
        >
          {{ item.stock }}
        </v-chip>
      </template>

      <template #[`item.updatedAt`]="{ item }">
        {{ formatDate(item.updatedAt) }}
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          color="blue-darken-1"
          @click="editItem(item)"
        ></v-btn>
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="deleteItem(item)"
        ></v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

// --- State ---
const search = ref('');

// --- Table Headers ---
// 'title' is what the user sees. 'key' must perfectly match your JSON structure.
const headers = [
  { title: 'EAN (Barcode)', key: 'product.EAN', align: 'start' },
  { title: 'Product Name', key: 'product.name' },
  { title: 'Price', key: 'product.price' },
  { title: 'Stock', key: 'stock' },
  { title: 'Last Updated By', key: 'updatedBy.name' },
  { title: 'Last Updated', key: 'updatedAt' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

// --- Mock Data (Pasted directly from your JSON) ---
const inventoryData = ref([]);

// --- Helper Functions ---

// Color codes the stock chip based on how much is left
const getStockColor = (stockCount) => {
  if (stockCount < 20) return 'error';     // Red for low stock (Like your Bibles!)
  if (stockCount < 100) return 'warning';  // Orange for medium stock
  return 'success';                        // Green for healthy stock
};

// Formats the ugly ISO date string into something readable
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

// --- Action Handlers ---
const editItem = (item) => {
  console.log('Editing item:', item.product.name);
  // Here you would open a modal to edit the item
};

const deleteItem = (item) => {
  console.log('Deleting item:', item.product.name);
  // Here you would prompt "Are you sure?" before hitting your API
};
</script>