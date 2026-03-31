<template>
  <div class="bg-grey-lighten-5 pa-4 pa-md-8 min-vh-100">
    <v-container fluid class="pa-0">

      <div class="d-flex justify-end text-body-2 text-primary font-weight-medium mb-4">
        Properties / Rent
      </div>

      <div class="mb-6">
        <Search />
      </div>

      <v-row>

        <v-col cols="12" md="3">
          <div style="position: sticky; top: 20px;">
            <Filter />
          </div>
        </v-col>

        <v-col cols="12" md="9">

          <v-row>
            <v-col v-for="(property, index) in properties" :key="index" cols="12" md="6" lg="4" xl="3">
              <PropertyCard :property="property" />
            </v-col>
          </v-row>

        </v-col>

      </v-row>

    </v-container>
  </div>
</template>

<script setup>
import Filter from '@/components/Guest/Filters/Filter.vue';
import Search from '@/components/Guest/Filters/Search.vue';
import { ref } from 'vue';
import PropertyCard from '@/components/Guest/Cards/PropertyCard.vue';

const properties = ref([
  {
    id: 1,
    code: 'A-RIZ024',
    type: 'sale',
    propertyType: 'Residential: Condominium',
    title: 'Luxury Condo',
    status: 'Popular',
    location: 'Pasig',
    price: 15000000,
    image: 'https://loremflickr.com/340/190/condominium?lock=${1}',
    brokerAvatar: 'https://i.pravatar.cc/30',
    brokerName: 'Ervin Josh Pejo',
    brokerPosition: 'Real Estate Broker',
    tags: ['Popular', 'Fully Furnished', 'Repriced'],
    amenities: [
      {
        type: 'BED',
        count: 2
      },
      {
        type: 'BATH',
        count: 2
      },
      {
        type: 'CAR',
        count: 2
      },
      {
        type: 'LOT',
        count: 2
      },
    ]
  },
  {
    id: 2,
    code: 'A-RIZ024',
    type: 'rent',
    propertyType: 'Residential: Condominium',
    title: 'Beachfront Lot',
    status: 'New Listing',
    location: 'Rizal',
    price: 30000,
    image: 'https://loremflickr.com/340/190/condominium,building?lock=15',
    brokerAvatar: 'https://i.pravatar.cc/',
    brokerName: 'Mychal Andrei Pejana',
    brokerPosition: 'Professional Full-Stack Developer',
    tags: ['Popular', 'Fully Furnished', 'PlaceHolder'],
    amenities: [
      {
        type: 'BED',
        count: 2
      },
      {
        type: 'BATH',
        count: 2
      },
      {
        type: 'CAR',
        count: 2
      },
      {
        type: 'LOT',
        count: 2
      },
    ]
  },
  {
    id: 2,
    code: 'A-RIZ024',
    type: 'rent',
    propertyType: 'Residential: Condominium',
    title: 'Beachfront Lot',
    status: 'New Listing',
    location: 'Rizal',
    price: 30000,
    image: 'https://loremflickr.com/340/190/condominium,building?lock=15',
    brokerAvatar: 'https://i.pravatar.cc/',
    brokerName: 'Mychal Andrei Pejana',
    brokerPosition: 'Professional Full-Stack Developer',
    tags: ['Popular', 'Fully Furnished', 'PlaceHolder'],
    amenities: [
      {
        type: 'BED',
        count: 2
      },
      {
        type: 'BATH',
        count: 2
      },
      {
        type: 'CAR',
        count: 2
      },
      {
        type: 'LOT',
        count: 2
      },
    ]
  },
  {
    id: 2,
    code: 'A-RIZ024',
    type: 'rent',
    propertyType: 'Residential: Condominium',
    title: 'Beachfront Lot',
    status: 'New Listing',
    location: 'Rizal',
    price: 30000,
    image: 'https://loremflickr.com/340/190/condominium,building?lock=15',
    brokerAvatar: 'https://i.pravatar.cc/',
    brokerName: 'Mychal Andrei Pejana',
    brokerPosition: 'Professional Full-Stack Developer',
    tags: ['Popular', 'Fully Furnished', 'PlaceHolder'],
    amenities: [
      {
        type: 'BED',
        count: 2
      },
      {
        type: 'BATH',
        count: 2
      },
      {
        type: 'CAR',
        count: 2
      },
      {
        type: 'LOT',
        count: 2
      },
    ]
  },
  {
    id: 2,
    code: 'A-RIZ024',
    type: 'rent',
    propertyType: 'Residential: Condominium',
    title: 'Beachfront Lot',
    status: 'New Listing',
    location: 'Rizal',
    price: 30000,
    image: 'https://loremflickr.com/340/190/condominium,building?lock=15',
    brokerAvatar: 'https://i.pravatar.cc/',
    brokerName: 'Mychal Andrei Pejana',
    brokerPosition: 'Professional Full-Stack Developer',
    tags: ['Popular', 'Fully Furnished', 'PlaceHolder'],
    amenities: [
      {
        type: 'BED',
        count: 2
      },
      {
        type: 'BATH',
        count: 2
      },
      {
        type: 'CAR',
        count: 2
      },
      {
        type: 'LOT',
        count: 2
      },
    ]
  },
  {
    id: 2,
    code: 'A-RIZ024',
    type: 'rent',
    propertyType: 'Residential: Condominium',
    title: 'Beachfront Lot',
    status: 'New Listing',
    location: 'Rizal',
    price: 30000,
    image: 'https://loremflickr.com/340/190/condominium,building?lock=15',
    brokerAvatar: 'https://i.pravatar.cc/',
    brokerName: 'Mychal Andrei Pejana',
    brokerPosition: 'Professional Full-Stack Developer',
    tags: ['Popular', 'Fully Furnished', 'PlaceHolder'],
    amenities: [
      {
        type: 'BED',
        count: 2
      },
      {
        type: 'BATH',
        count: 2
      },
      {
        type: 'CAR',
        count: 2
      },
      {
        type: 'LOT',
        count: 2
      },
    ]
  },
  {
    id: 6,
    code: 'A-RIZ024',
    type: 'rent',
    propertyType: 'Residential: Condominium',
    title: 'Beachfront Lot',
    status: 'New Listing',
    location: 'Rizal',
    price: 30000,
    image: 'https://loremflickr.com/340/190/condominium,building?lock=15',
    brokerAvatar: 'https://i.pravatar.cc/',
    brokerName: 'Mychal Andrei Pejana',
    brokerPosition: 'Professional Full-Stack Developer',
    tags: ['Popular', 'Fully Furnished', 'PlaceHolder'],
    amenities: [
      {
        type: 'BED',
        count: 2
      },
      {
        type: 'BATH',
        count: 2
      },
      {
        type: 'CAR',
        count: 2
      },
      {
        type: 'LOT',
        count: 2
      },
    ]
  },
])
</script>

<style scoped>
/* Optional: Ensures the page takes up at least the full height of the viewport */
.min-vh-100 {
  min-height: 100vh;
}
</style>