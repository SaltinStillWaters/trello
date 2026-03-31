<template>
  <v-card 
    elevation="2" 
    hover 
    class="h-100 d-flex flex-column rounded-lg"
  >
    <div v-if="product.tag" class="position-absolute mt-2 ml-2" style="z-index: 1;">
      <v-chip size="small" :color="product.tagColor || 'success'" class="font-weight-bold">
        {{ product.tag }}
      </v-chip>
    </div>

    <v-img
      :src="product.image || 'https://via.placeholder.com/300?text=No+Image'"
      height="180"
      cover
      class="bg-grey-lighten-4"
    ></v-img>

    <v-card-item class="pb-0">
      <div class="text-caption text-medium-emphasis mb-1">{{ product.brand }}</div>
      <v-card-title class="text-subtitle-1 font-weight-bold text-wrap" style="line-height: 1.2;">
        {{ product.name }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="pt-2 flex-grow-1">
      <div class="d-flex align-baseline mb-1">
        <span class="text-h6 font-weight-bold text-primary">${{ product.price.toFixed(2) }}</span>
        <span v-if="product.originalPrice" class="text-caption text-decoration-line-through text-grey ml-2">
          ${{ product.originalPrice.toFixed(2) }}
        </span>
      </div>
      <div class="text-caption text-medium-emphasis">
        {{ product.unitPriceString }}
      </div>
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
      <v-btn 
        color="primary" 
        variant="flat" 
        block 
        prepend-icon="mdi-cart-plus"
        @click="addToCart"
      >
        Add to Cart
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// --- Props ---
// We pass the entire product object into this component from the parent
const props = defineProps({
  product: {
    type: Object,
    required: true,
    // Example of expected structure:
    // {
    //   id: 1,
    //   name: 'Organic Honeycrisp Apples',
    //   brand: 'Fresh Farms',
    //   price: 4.99,
    //   originalPrice: 5.99, // Optional
    //   unitPriceString: '$1.25 / lb',
    //   image: 'https://link-to-image.jpg',
    //   tag: 'Sale', // Optional
    //   tagColor: 'error' // Optional
    // }
  }
});

// --- Emits ---
const emit = defineEmits(['add-to-cart']);

const addToCart = () => {
  // Emit the product ID (or the whole product) to the parent page so it can update the cart store
  emit('add-to-cart', props.product);
};
</script>

<style scoped>
/* Ensures the title doesn't get cut off weirdly if it's too long, but keeps the card neat */
.text-wrap {
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>