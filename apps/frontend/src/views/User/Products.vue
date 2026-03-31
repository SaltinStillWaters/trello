<template>
  <v-container fluid>
    <Search />
    
    <v-row class="mt-4">
      <v-col cols="12" lg="3">
        <Filter />
      </v-col>
      
      <v-col cols="12" lg="9">
        <v-row>
          <v-col 
            v-for="item in products" 
            :key="item.id" 
            cols="12" sm="6" md="4"
          >
            <ProductCard 
              :product="item" 
              @add-to-cart="handleAddToCart" 
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import Filter from '@/components/Filter.vue';
import ProductCard from '@/components/ProductCard.vue';
import Search from '@/components/Search.vue';

// --- Mock Data ---
// In a real app, you would fetch this from your backend API
const products = ref([
  {
    id: 1,
    name: 'Organic Honeycrisp Apples',
    brand: 'Fresh Farms',
    price: 4.99,
    unitPriceString: '$1.25 / lb',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fc6c?w=300',
    tag: 'Organic',
    tagColor: 'success'
  },
  {
    id: 2,
    name: 'Almond Milk Unsweetened',
    brand: 'Blue Diamond',
    price: 3.49,
    originalPrice: 4.49, // Will show crossed out
    unitPriceString: '$0.05 / fl oz',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300',
    tag: 'Sale',
    tagColor: 'error'
  },
  {
    id: 3,
    name: 'Whole Wheat Bread',
    brand: 'Nature\'s Own',
    price: 2.99,
    unitPriceString: '$0.15 / oz',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300'
  },
  {
    id: 4,
    name: 'Free Range Large Brown Eggs - 12ct',
    brand: 'Happy Hens',
    price: 5.99,
    unitPriceString: '$0.50 / ea',
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300',
    tag: 'Local',
    tagColor: 'info'
  }
]);

// --- Methods ---
const handleAddToCart = (product) => {
  // This receives the exact product the user clicked on!
  console.log(`Added ${product.name} to cart!`);
  // Next step: push this product to your Pinia cart store
};
</script>