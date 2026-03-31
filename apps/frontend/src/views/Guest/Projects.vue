<template>
  <GuestHeroSection />

  <!-- Section Header -->
  <v-container class="pt-10 pb-4">
    <div class="text-center mb-8">
      <h1 class="text-primary font-weight-bold">Projects</h1>
      <p class="text-body-1 text-grey-darken-1">
        Find Properties from our Projects
      </p>
      <v-divider
        :thickness="3"
        class="mt-4"
        style="opacity: 1; color: #075bab" />
    </div>
  </v-container>

  <!-- Property Listings -->
  <v-container v-if="!projectSelected" style="padding-bottom: 60px;">
    <v-card
      v-for="project in projects"
      :key="project.name"
      elevation="0"
      border
      rounded="lg"
      class="mb-3 cursor-pointer overflow-hidden"
      @click="selectedIndex = projects.indexOf(project); projectSelected = true">
      <div class="d-flex align-stretch" style="height: 120px;">
        <div style="width: 120px; flex-shrink: 0; align-self: stretch;">
          <img
            :src="project.image"
            :alt="project.name"
            style="width: 100%; height: 100%; object-fit: cover; display: block;"
          />
        </div>

        <div class="grow pa-4">
          <div class="font-weight-bold text-h6">{{ project.name }}</div>
          <div class="d-flex align-center ga-2">
            <span class="text-grey-darken-1 text-body-2">Residential: {{ project.type }}</span>
            <v-chip size="small" variant="elevated" color="primary" rounded="2">Fully Furnished</v-chip>
          </div>
          <div class="d-flex align-center ga-2 mt-1">
            <span class="text-grey-darken-1 text-body-2">{{ project.location }}</span>
            <v-chip size="small" variant="elevated" color="primary" rounded="2">Pre-Owned</v-chip>
          </div>
        </div>

        <div class="d-flex align-center justify-end pa-3 ml-auto" style="flex-shrink: 0;">
          <img src="@/assets/logo.png" alt="MyHomeTown" style="width: 100px; object-fit: contain;" />
        </div>
      </div>
    </v-card>
  </v-container>

  <!-- Full-width Carousel -->
  <div class="carousel-section">
    <button class="carousel-arrow left" @click="prev">
      <v-icon color="white">mdi-chevron-left</v-icon>
    </button>

    <div class="carousel-track" ref="trackRef" @scroll="onTrackScroll">
      <div
        v-for="(project, i) in loopedProjects"
        :key="i"
        ref="cardRefs"
        class="carousel-card"
        style="cursor: pointer"
        @click="selectedIndex = (i - 4 + projects.length) % projects.length; projectSelected = true">
        <img :src="project.image" :alt="project.name" class="carousel-img" />
        <div class="carousel-overlay mr-3">
          <p
            class="font-weight-bold text-white mb-0 mt-2"
            style="font-size: 1.3rem">
            {{ project.name }}
          </p>
          <p
            class="text-white opacity-70"
            style="font-size: 0.95rem; margin: 0">
            {{ project.type }}
          </p>
        </div>
      </div>
    </div>

    <button class="carousel-arrow right" @click="next">
      <v-icon color="white">mdi-chevron-right</v-icon>
    </button>
  </div>

  <!-- Dots -->
  <div class="carousel-dots">
    <span
      v-for="(_, i) in projects"
      :key="i"
      :class="['dot', { active: i === carouselIndex }]"
      @click="goTo(i)" />
  </div>

  <v-container v-if="projectSelected" fluid class="py-10 px-12">
    <v-row align="start" justify="center">
      <!-- PROPERTY DETAILS -->

      <v-col cols="12" md="5">
        <!-- <h1 style="font-size: clamp(1.5rem, 2.5vw, 2.2rem); font-weight: 800;" class="mb-0 text-primary" >YONARE TOWER</h1> -->
        <h1
          style="font-weight: 800"
          class="text-display-medium mb-2 text-primary">
          {{ selectedProject.name.toUpperCase() }}
        </h1>
        <p class="text-title-large mt-0 font-weight-medium">
          {{ selectedProject.type }}
        </p>
        <v-divider
          :thickness="2"
          class="mt-4"
          style="opacity: 1"
          color="primary" />

        <div class="text-primary font-weight-bold mt-6 mb-0 text-display-small">
          Description
        </div>

        <ul
          class="mt-4 text-headline-small font-weight-medium mb-2"
          style="line-height: 2">
          <li>
            <span class="text-primary2">Location:</span>
            {{ selectedProject.location }}
          </li>
          <li>
            <span class="text-primary2"
              >Residential Units (3rd - 50th floors)</span
            >
            <ul>
              <li>Studio, 1 Bedroom, 2 Bedroom, (All No Balcony)</li>
            </ul>
          </li>
          <li><span class="text-primary2">Floor Area:</span> 30sqm - 60sqm</li>
          <li><span class="text-primary2">Price Range:</span> ₱10M - ₱20M</li>
          <li>
            <span class="text-primary2">Price per SQM:</span> ~₱100,000 / sqm
          </li>
        </ul>

        <div
          class="text-primary font-weight-bold mt-16 mb-4 text-display-small">
          Amenities
        </div>

        <!-- Essentials -->
        <p class="font-weight-medium mb-2" style="font-size: 1.1rem">
          Essentials
        </p>
        <v-card rounded="lg" elevation="0" border class="pa-4 mb-4">
          <v-row no-gutters>
            <v-col
              v-for="item in selectedProject.amenities.essentials"
              :key="item.label"
              cols="4"
              class="d-flex align-center ga-2 py-2">
              <v-icon size="22" class="text-grey-darken-1">{{
                item.icon
              }}</v-icon>
              <span class="text-grey-darken-1">{{ item.label }}</span>
            </v-col>
          </v-row>
        </v-card>

        <!-- Leisure -->
        <p class="font-weight-medium mb-2" style="font-size: 1.1rem">Leisure</p>
        <v-card rounded="lg" elevation="0" border class="pa-4 mb-4">
          <v-row no-gutters>
            <v-col
              v-for="item in selectedProject.amenities.leisure"
              :key="item.label"
              cols="4"
              class="d-flex align-center ga-2 py-2">
              <v-icon size="22" class="text-grey-darken-1">{{
                item.icon
              }}</v-icon>
              <span class="text-grey-darken-1">{{ item.label }}</span>
            </v-col>
          </v-row>
        </v-card>

        <!-- Safety -->
        <p class="font-weight-medium mb-2" style="font-size: 1.1rem">Safety</p>
        <v-card rounded="lg" elevation="0" border class="pa-4 mb-4">
          <v-row no-gutters>
            <v-col
              v-for="item in selectedProject.amenities.safety"
              :key="item.label"
              cols="4"
              class="d-flex align-center ga-2 py-2">
              <v-icon size="22" class="text-grey-darken-1">{{
                item.icon
              }}</v-icon>
              <span class="text-grey-darken-1">{{ item.label }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="5" class="d-flex flex-column align-center">
        <!-- Main image -->
        <img
          :src="selectedProject.image"
          alt=""
          style="width: 90%; border-radius: 20px; object-fit: cover" />

        <!-- Gallery grid -->
        <div class="gallery-grid mt-4" style="width: 90%">
          <img
            v-for="(img, i) in selectedProject.galleryImages"
            :key="i"
            :src="img"
            alt=""
            class="gallery-img" />
        </div>
      </v-col>
    </v-row>
    <!-- PROPERTY IMAGES -->
  </v-container>

  <!-- Compare Our Projects -->
  <v-container fluid class="py-12" style="padding-left: 8%; padding-right: 8%">
    <div
      class="d-flex align-center ga-2 text-primary font-weight-bold mb-4 text-display-small">
      <v-icon color="primary">mdi-domain</v-icon>
      Compare Our Projects
    </div>
    <div class="compare-divider mb-6" />

    <v-row>
      <v-col cols="3" />
      <v-col v-for="(_, i) in 3" :key="i" cols="3">
        <v-select
          v-model="compareSelections[i]"
          label="Project"
          :items="projects.map((p) => p.name)"
          bg-color="primary"
          variant="solo"
          rounded="lg"
          hide-details
          density="comfortable"
          clearable
          :menu-props="{ scrollStrategy: 'close' }"
          class="compare-select" />
      </v-col>
    </v-row>

    <!-- Project Images -->
    <v-slide-y-reverse-transition>
      <v-row v-if="compareProjects.some((p) => p !== null)" class="mt-6">
        <v-col cols="3" />
        <v-col v-for="(proj, i) in compareProjects" :key="i" cols="3">
          <v-fade-transition>
            <img
              v-if="proj"
              :src="proj.image"
              :alt="proj.name"
              style="
                width: 100%;
                aspect-ratio: 3/4;
                object-fit: cover;
                border-radius: 12px;
                display: block;
              " />
          </v-fade-transition>
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>

    <!-- Comparison Table -->
    <v-slide-y-reverse-transition>
      <v-table
        v-if="compareProjects.some((p) => p !== null)"
        class="mt-6 compare-table">
        <tbody>
          <tr
            v-for="(row, i) in compareRows"
            :key="row.key"
            :class="i % 2 === 0 ? 'row-shaded' : ''">
            <td class="font-weight-bold" style="width: 25%">{{ row.label }}</td>
            <td
              v-for="(proj, j) in compareProjects"
              :key="j"
              class="text-center"
              style="width: 25%">
              {{ proj ? proj[row.key] : "" }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-slide-y-reverse-transition>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import GuestHeroSection from "@/components/Guest/Navigation/GuestHeroSection.vue";

// Shared placeholder data — will be replaced per project later
const _galleryImages = [
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400",
  "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400",
];

const _amenities = {
  essentials: [
    { label: "Air Condition", icon: "mdi-air-conditioner" },
    { label: "Washer", icon: "mdi-washing-machine" },
    { label: "Parking", icon: "mdi-car" },
    { label: "Kitchen", icon: "mdi-silverware-fork-knife" },
  ],
  leisure: [
    { label: "Pool", icon: "mdi-pool" },
    { label: "BBQ Grill", icon: "mdi-grill" },
    { label: "Beach Access", icon: "mdi-beach" },
    { label: "Gym", icon: "mdi-dumbbell" },
    { label: "Tennis", icon: "mdi-tennis" },
  ],
  safety: [
    { label: "CCTV", icon: "mdi-cctv" },
    { label: "Fire Alarm", icon: "mdi-fire-alert" },
    { label: "First Aid Kit", icon: "mdi-medical-bag" },
    { label: "Security", icon: "mdi-shield-check" },
  ],
};

const projects = [
  {
    name: "Yonare Tower",
    type: "Condominium",
    image:
      "https://plus.unsplash.com/premium_photo-1676657955511-ac0a0632e3c4?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    galleryImages: _galleryImages,
    amenities: _amenities,
    location: "Ortigas Center, Pasig City",
    totalArea: "30sqm - 60sqm",
    unitTypes: "Studio, 1BR, 2BR",
    listPrice: "₱10M – ₱20M",
    pricePerSqm: "~₱100,000 / sqm",
    associationDues: "₱3,000 / month",
    turnoverDate: "Q4 2026 (Preselling)",
    keyAmenities: "Pool, Gym, Sky Lounge",
    nearbyLandmarks: "SM Megamall, Capitol Commons",
    parkingSlot: "1 Slot Included",
  },
  {
    name: "Beldevere Tower",
    type: "Condominium",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600",
    galleryImages: _galleryImages,
    amenities: _amenities,
    location: "BGC, Taguig",
    totalArea: "26.5 sqm",
    unitTypes: "1BR, 1 Bath, Balcony",
    listPrice: "₱5,200,000",
    pricePerSqm: "~₱142,465 / sqm",
    associationDues: "₱3,285 / month (@ ₱90/sqm)",
    turnoverDate: "Q4 2026 (Preselling)",
    keyAmenities: "Sky Lounge, Infinity Pool, Co-working Space",
    nearbyLandmarks: "High Street, St. Luke's Medical Center",
    parkingSlot: "Not Included",
  },
  {
    name: "Palm Residences",
    type: "Townhouse",
    image:
      "https://plus.unsplash.com/premium_photo-1678386645963-3f5b0bdb8dcd?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    galleryImages: _galleryImages,
    amenities: _amenities,
    location: "Kapitolyo, Pasig",
    totalArea: "62.0 sqm",
    unitTypes: "2BR, 2 Bath, Balcony",
    listPrice: "₱9,800,000",
    pricePerSqm: "~₱158,064 / sqm",
    associationDues: "₱5,580 / month (@ ₱90/sqm)",
    turnoverDate: "RFO (Ready for Occupancy)",
    keyAmenities: "Jogging Path, Kiddie Pool, Pet Park",
    nearbyLandmarks: "Capitol Commons, Estancia Mall",
    parkingSlot: "1 Slot Included",
  },
  {
    name: "Grand Towers",
    type: "Condominium",
    image: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=600",
    galleryImages: _galleryImages,
    amenities: _amenities,
    location: "Makati CBD",
    totalArea: "50.0 sqm",
    unitTypes: "1BR, 2BR",
    listPrice: "₱8,500,000",
    pricePerSqm: "~₱170,000 / sqm",
    associationDues: "₱4,500 / month",
    turnoverDate: "RFO (Ready for Occupancy)",
    keyAmenities: "Rooftop Deck, Gym, Pool",
    nearbyLandmarks: "Greenbelt, Ayala Ave",
    parkingSlot: "1 Slot Included",
  },
  {
    name: "Azure Heights",
    type: "Condominium",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
    galleryImages: _galleryImages,
    amenities: _amenities,
    location: "Sampaloc, Manila",
    totalArea: "44.0 sqm",
    unitTypes: "2BR, 1 Bath",
    listPrice: "₱7,600,000",
    pricePerSqm: "~₱158,064 / sqm",
    associationDues: "₱5,580 / month (@ ₱90/sqm)",
    turnoverDate: "RFO (Ready for Occupancy)",
    keyAmenities: "Jogging Path, Kiddie Pool, Pet Park",
    nearbyLandmarks: "SM Manila, FEU, UST, NU",
    parkingSlot: "1 Slot Included",
  },
  {
    name: "The Pinnacle",
    type: "High-rise",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600",
    galleryImages: _galleryImages,
    amenities: _amenities,
    location: "Eastwood City, Quezon City",
    totalArea: "70.0 sqm",
    unitTypes: "2BR, 3BR",
    listPrice: "₱14,000,000",
    pricePerSqm: "~₱200,000 / sqm",
    associationDues: "₱7,000 / month",
    turnoverDate: "Q2 2027 (Preselling)",
    keyAmenities: "Infinity Pool, Tennis Court, Concierge",
    nearbyLandmarks: "Eastwood Mall, Libis Tech Hub",
    parkingSlot: "2 Slots Included",
  },
];

const selectedIndex = ref(0);
const selectedProject = computed(() => projects[selectedIndex.value]);
const projectSelected = ref(false);

const compareSelections = ref([null, null, null]);
const compareProjects = computed(() =>
  compareSelections.value.map(
    (name) => projects.find((p) => p.name === name) ?? null,
  ),
);

const compareRows = [
  { label: "Location", key: "location" },
  { label: "Total Area", key: "totalArea" },
  { label: "Unit Types", key: "unitTypes" },
  { label: "List Price", key: "listPrice" },
  { label: "Price per sqm", key: "pricePerSqm" },
  { label: "Association Dues", key: "associationDues" },
  { label: "Turnover Date", key: "turnoverDate" },
  { label: "Key Amenities", key: "keyAmenities" },
  { label: "Nearby Landmarks", key: "nearbyLandmarks" },
  { label: "Parking Slot", key: "parkingSlot" },
];

// Clone 4 at start and end for seamless wrap
const loopedProjects = computed(() => [
  ...projects.slice(-4),
  ...projects,
  ...projects.slice(0, 4),
]);

const trackRef = ref(null);
const cardRefs = ref([]);
const carouselIndex = ref(0); // real index for dots
const isTransitioning = ref(false);
let cardWidth = 0;
let loopPos = 4; // actual position in the looped array (4 = first real card)
let isProgrammaticScroll = false;

onMounted(async () => {
  await nextTick();
  const card = cardRefs.value[0];
  const GAP = 20;
  cardWidth = card.offsetWidth + GAP;
  isProgrammaticScroll = true;
  trackRef.value.scrollLeft = cardWidth * 4;
  setTimeout(() => {
    isProgrammaticScroll = false;
  }, 50);
});

// Silent instant reset — only called after smooth animation has fully settled
const silentReset = () => {
  if (loopPos >= 4 + projects.length) {
    loopPos -= projects.length;
    isProgrammaticScroll = true;
    trackRef.value.scrollLeft = loopPos * cardWidth;
    setTimeout(() => {
      isProgrammaticScroll = false;
    }, 50);
  } else if (loopPos < 4) {
    loopPos += projects.length;
    isProgrammaticScroll = true;
    trackRef.value.scrollLeft = loopPos * cardWidth;
    setTimeout(() => {
      isProgrammaticScroll = false;
    }, 50);
  }
};

const onTrackScroll = () => {
  if (isProgrammaticScroll) return;

  const sl = trackRef.value.scrollLeft;
  const totalW = projects.length * cardWidth;

  // Immediate seamless jump when hitting clone zone during manual scroll
  if (sl < cardWidth * 2) {
    isProgrammaticScroll = true;
    trackRef.value.scrollLeft = sl + totalW;
    loopPos = Math.round((sl + totalW) / cardWidth);
    setTimeout(() => {
      isProgrammaticScroll = false;
    }, 50);
    return;
  }
  if (sl > cardWidth * (2 + projects.length)) {
    isProgrammaticScroll = true;
    trackRef.value.scrollLeft = sl - totalW;
    loopPos = Math.round((sl - totalW) / cardWidth);
    setTimeout(() => {
      isProgrammaticScroll = false;
    }, 50);
    return;
  }

  loopPos = Math.round(sl / cardWidth);
  carouselIndex.value = (loopPos - 4 + projects.length * 10) % projects.length;
};

const goTo = (realIndex) => {
  if (isTransitioning.value) return;
  carouselIndex.value = realIndex;
  loopPos = realIndex + 4;
  isProgrammaticScroll = true;
  trackRef.value.scrollTo({ left: loopPos * cardWidth, behavior: "smooth" });
  setTimeout(() => {
    isProgrammaticScroll = false;
  }, 450);
};

const next = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  loopPos++;
  carouselIndex.value = (loopPos - 4 + projects.length * 10) % projects.length;
  isProgrammaticScroll = true;
  trackRef.value.scrollTo({ left: loopPos * cardWidth, behavior: "smooth" });
  setTimeout(() => {
    isProgrammaticScroll = false;
    silentReset(); // reset only after animation finishes — invisible to user
    isTransitioning.value = false;
  }, 450);
};

const prev = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  loopPos--;
  carouselIndex.value = (loopPos - 4 + projects.length * 10) % projects.length;
  isProgrammaticScroll = true;
  trackRef.value.scrollTo({ left: loopPos * cardWidth, behavior: "smooth" });
  setTimeout(() => {
    isProgrammaticScroll = false;
    silentReset();
    isTransitioning.value = false;
  }, 450);
};
</script>

<style scoped>
* {
  font-family: inherit;
}

.carousel-section {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  gap: 20px;
  overflow-x: scroll;
  width: 100%;
  padding: 8px 0;
  scrollbar-width: none; /* Firefox */
}

.carousel-track::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.carousel-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  pointer-events: none;
  z-index: 1;
}

.carousel-card {
  flex: 0 0 calc(25% - 9px);
  position: relative;
  height: 460px;
  border-radius: 16px;
  overflow: hidden;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-overlay {
  position: absolute;
  top: 16px;
  left: 0;
  right: 16px;
  text-align: right;
  z-index: 2;
}

.carousel-arrow {
  position: absolute;
  z-index: 2;
  background: rgba(0, 0, 0, 0.45);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.carousel-arrow.left {
  left: 12px;
}
.carousel-arrow.right {
  right: 12px;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0 32px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  width: 24px;
  border-radius: 8px;
  background: #075bab;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.gallery-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 14px;
  display: block;
}

.compare-divider {
  height: 3px;
  background: linear-gradient(to right, #075bab 40%, #e0e7f0 100%);
  border-radius: 2px;
}

.compare-select :deep(.v-label),
.compare-select :deep(.v-select__selection-text),
.compare-select :deep(.v-icon) {
  color: white !important;
  opacity: 1 !important;
}

.compare-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.compare-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #e8e8e8;
  vertical-align: top;
}

.compare-table .row-shaded {
  background-color: #f0f0f0;
}
</style>
