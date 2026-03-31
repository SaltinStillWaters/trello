<template>
  <v-card class="mx-auto py-2 px-3" elevation="2" rounded="lg" width="400">
    <v-form @submit.prevent="getLatLng">
      <v-text-field v-model="search" label="Search location" placeholder="e.g. SM Megamall Ortigas"
        prepend-inner-icon="mdi-map-marker-outline" append-inner-icon="mdi-magnify" persistent-placeholder
        variant="plain" density="comfortable" hide-details="auto" :loading="isLoading" :disabled="isLoading" clearable
        @click:append-inner="getLatLng" />
    </v-form>
  </v-card>
</template>

<script setup lang="js">
import { ref } from 'vue';

const emit = defineEmits({
  locationSearched: (center) => {
    if (Array.isArray(center) && center.length === 2) {
      return true;
    } else {
      console.warn('Invalid payload emitted for locationSearched!');
      return false;
    }
  }
});

const search = ref('');
const isLoading = ref(false);
const center = ref(null);

const getLatLng = async () => {
  if (!search.value) return;

  isLoading.value = true;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search.value)}&countrycodes=ph&limit=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (data && data.length > 0) {
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    center.value = [lat, lng]
    emit('location-searched', center.value);
  } else {
    alert('Location not found');
  }

  isLoading.value = false;
}
</script>