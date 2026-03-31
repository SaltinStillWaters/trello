<template>
  <section class="hero-section">
    <div class="hero-overlay" />
    <v-container class="hero-content">
      <v-row justify="start" align="center" style="min-height: 80vh">
        <v-col cols="12" md="8" class="text-start">
          <!-- <v-chip color="amber-darken-2" variant="tonal" size="small" class="mb-4 font-weight-bold">
            🏆 #1 Real Estate Platform
          </v-chip> -->

          <h1 class="hero-title mb-4">
            Your Next Chapter Starts Here
            <!-- <span class="text-amber-darken-2">Property Today</span> -->
          </h1>

          <p class="text-body-1 text-white opacity-80 mb-8">
            Discover thousands of premium properties across the country.<br
              class="d-none d-md-block" />
            From cozy apartments to luxury estates — your perfect home awaits.
          </p>

          <v-row density="compact" align="center" class="ga-2 pb-4">
            <v-col cols="2">
              <v-btn
                color="white"
                size="large"
                rounded="lg"
                variant="flat"
                min-width="180"
                to="/contact-us">
                Inquire Now!
              </v-btn>
            </v-col>
          </v-row>

          <!-- Search Bar -->
          <v-card rounded="lg" elevation="8" class="pa-2" max-width="830">
            <v-row density="compact" align="center" class="ga-2">
              <v-col cols="12" sm="4">
                <v-select
                  v-model="searchType"
                  :items="['Buy', 'Rent', 'Foreclosed']"
                  variant="solo"
                  flat
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-home-outline"
                  label="Type" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="searchLocation"
                  variant="solo"
                  flat
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-map-marker-outline"
                  placeholder="City, neighborhood, or address..." />
              </v-col>
              <v-col cols="12" sm="2" class="flex-grow-1 flex-sm-grow-0">
                <v-btn
                  color="primary"
                  block
                  size="large"
                  rounded="lg"
                  variant="flat">
                  <v-icon start>mdi-magnify</v-icon>
                  Search
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script setup>
import { ref } from 'vue';

const searchType = ref('Buy')
const searchLocation = ref('')


</script>
<style scoped>
.hero-section {
  min-height: 70vh;
  background: url('@/assets/Guest/hero-bg.png') center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(10, 48, 60, 0.88) 15%, rgba(10, 48, 60, 0.3) 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 800;
  color: white;
  line-height: 1.1;
}
</style>
