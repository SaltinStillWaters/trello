<template>
  <v-main class="map-wrapper">
    <BaseMap class="map-background" :center="center" :click-marker="clickMarker" :isRecenter="isRecenter" :view="view"
      :transaction-type="transactionType" @click="onMapClick" @click-marker-dragged="updateCenter" />

    <div class="floating-controls top-left">
      <Search class="mb-3" @location-searched="updateCenter" />

      <div class="d-flex ga-3">
        <v-card class="" elevation="4" rounded="lg">
          <v-btn-toggle v-model="view" mandatory divided color="primary" density="compact" class="d-flex">
            <v-btn :value=Types.View.ROADMAP size="small" prepend-icon="mdi-map-outline">Map</v-btn>
            <v-btn :value=Types.View.SATELITE prepend-icon="mdi-satellite-variant">Satellite</v-btn>
          </v-btn-toggle>
        </v-card>

        <v-card class="" elevation="4" rounded="lg">
          <v-btn-toggle v-model="transactionType" mandatory divided color="primary" density="compact" class="d-flex">
            <v-btn :value=Types.TransactionType.SALE size="small" prepend-icon="mdi-home-outline">Sale</v-btn>
            <v-btn :value=Types.TransactionType.RENT prepend-icon="mdi-key-outline">Rent</v-btn>
          </v-btn-toggle>
        </v-card>
      </div>
    </div>

    <div class="floating-controls bottom-right">
      <v-btn icon="mdi-crosshairs-gps" color="white" size="large" elevation="4" class="text-primary" @click="recenter">
      </v-btn>
    </div>
  </v-main>
</template>


<script setup lang="js">
import BaseMap from "@/components/Map/BaseMap.vue";
import Search from "@/components/Map/Search.vue";
import { Types } from "@/components/Map/types";
import { ref } from "vue";

const view = ref(Types.View.ROADMAP)
const center = ref([14.5833, 121.05]);
const isRecenter = ref(false);
const clickMarker = ref(null);
const transactionType = ref(Types.TransactionType.SALE);

const updateCenter = (newCenter) => {
  center.value = newCenter;
  clickMarker.value = center.value;
};

const onMapClick = (event) => {
  const lat = event.latlng.lat;
  const lng = event.latlng.lng;
  center.value = [lat, lng];
  clickMarker.value = [lat, lng];
};

const recenter = () => {
  isRecenter.value = !isRecenter.value;
};
</script>


<style scoped>
.map-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.map-background {
  height: 100%;
  width: 100%;
  z-index: 0;
}

.floating-controls {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  padding: 24px;
}

.floating-controls>* {
  pointer-events: auto;
}

.top-left {
  top: -15px;
  left: 40px;
}

.bottom-right {
  bottom: 0;
  right: 0;
}
</style>
