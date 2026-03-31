<template>
  <v-container fluid class="pa-6">

    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h5 font-weight-bold text-grey-darken-4">Dashboard</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Welcome back, {{ authStore.user?.name }} 👋
        </p>
      </div>
      <v-btn color="primary" rounded="lg" variant="flat" elevation="0">
        <v-icon start>mdi-plus</v-icon>
        Add Listing
      </v-btn>
    </div>

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" xl="3">
        <v-card rounded="xl" elevation="0" border class="pa-5" style="transition: transform 0.2s ease">
          <div class="d-flex align-center justify-space-between mb-4">
            <!-- Icon badge — border-radius can't be set via Vuetify utility so keep inline style -->
            <v-avatar
              size="44"
              rounded="lg"
              :color="stat.avatarColor"
              variant="tonal"
            >
              <v-icon :color="stat.color" size="22">{{ stat.icon }}</v-icon>
            </v-avatar>
            <v-chip
              :color="stat.trend > 0 ? 'success' : 'error'"
              size="x-small"
              variant="tonal"
            >
              <v-icon start size="12">{{ stat.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
              {{ Math.abs(stat.trend) }}%
            </v-chip>
          </div>
          <div class="text-h5 font-weight-bold mb-1">{{ stat.value }}</div>
          <div class="text-caption text-medium-emphasis">{{ stat.title }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row -->
    <v-row class="mb-6">

      <!-- Monthly Sales Bar Chart -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="0" border class="pa-5" height="360">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="text-subtitle-1 font-weight-bold">Monthly Sales Overview</div>
            <v-btn-toggle
              v-model="chartPeriod"
              density="compact"
              rounded="lg"
              variant="outlined"
              color="primary"
              mandatory
            >
              <v-btn value="3m" size="small">3M</v-btn>
              <v-btn value="6m" size="small">6M</v-btn>
              <v-btn value="1y" size="small">1Y</v-btn>
            </v-btn-toggle>
          </div>

          <!-- SVG Bar Chart — custom drawing, CSS unavoidable here -->
          <div style="height:220px; display:flex; align-items:flex-end">
            <svg viewBox="0 0 600 200" style="width:100%">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0A303C" stop-opacity="0.9"/>
                  <stop offset="100%" stop-color="#344a53" stop-opacity="0.7"/>
                </linearGradient>
              </defs>
              <g v-for="(bar, i) in chartBars" :key="i">
                <rect
                  :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h"
                  fill="url(#barGrad)" rx="4"
                  style="transition: opacity 0.2s; cursor: pointer"
                />
                <text
                  :x="bar.x + bar.w/2" :y="198"
                  text-anchor="middle"
                  style="font-size:9px; fill:#9e9e9e"
                >
                  {{ bar.month }}
                </text>
              </g>
            </svg>
          </div>
        </v-card>
      </v-col>

      <!-- Property Types Donut -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="0" border class="pa-5" height="360">
          <div class="text-subtitle-1 font-weight-bold mb-4">Property Types</div>
          <div class="d-flex justify-center mb-4">
            <!-- SVG donut — custom drawing -->
            <svg viewBox="0 0 120 120" width="160" height="160">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f5f5f5" stroke-width="20"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#0A303C" stroke-width="20"
                stroke-dasharray="157 157" stroke-dashoffset="0" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#344a53" stroke-width="20"
                stroke-dasharray="62 252" stroke-dashoffset="-157" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#90CAF9" stroke-width="20"
                stroke-dasharray="31 283" stroke-dashoffset="-219" transform="rotate(-90 60 60)"/>
              <text x="60" y="65" text-anchor="middle" font-size="10" font-weight="bold" fill="#1a1a2e">Types</text>
            </svg>
          </div>
          <div
            v-for="pt in propTypes"
            :key="pt.label"
            class="d-flex align-center justify-space-between mb-2"
          >
            <div class="d-flex align-center ga-2">
              <!-- Small dot — no Vuetify equivalent for arbitrary color dots -->
              <div style="width:10px; height:10px; border-radius:50%" :style="{ background: pt.color }" />
              <span class="text-caption">{{ pt.label }}</span>
            </div>
            <span class="text-caption font-weight-bold">{{ pt.pct }}%</span>
          </div>
        </v-card>
      </v-col>

    </v-row>

    <!-- Recent Listings + Activity -->
    <v-row>

      <!-- Recent Listings Table -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="0" border>
          <v-card-title class="pa-5 pb-0 text-subtitle-1 font-weight-bold">
            Recent Listings
          </v-card-title>
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">Property</th>
                <th class="text-left">Type</th>
                <th class="text-left">Price</th>
                <th class="text-left">Status</th>
                <th class="text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="listing in recentListings" :key="listing.id">
                <td>
                  <div class="font-weight-medium text-body-2">{{ listing.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ listing.location }}</div>
                </td>
                <td class="text-caption">{{ listing.type }}</td>
                <td class="font-weight-medium text-body-2">{{ listing.price }}</td>
                <td>
                  <v-chip :color="statusColor(listing.status)" size="x-small" variant="tonal">
                    {{ listing.status }}
                  </v-chip>
                </td>
                <td class="text-caption text-medium-emphasis">{{ listing.date }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Recent Activity Timeline -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="0" border class="pa-5">
          <div class="text-subtitle-1 font-weight-bold mb-4">Recent Activity</div>
          <v-timeline density="compact" align="start" side="end" truncate-line="both">
            <v-timeline-item
              v-for="act in activities"
              :key="act.id"
              :dot-color="act.color"
              size="small"
            >
              <div class="text-body-2 font-weight-medium">{{ act.title }}</div>
              <div class="text-caption text-medium-emphasis">{{ act.time }}</div>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore   = useAuthStore()
const chartPeriod = ref('6m')

const stats = [
  { title: 'Total Listings', value: '1,284', icon: 'mdi-home-city-outline',   color: 'primary',  avatarColor: 'primary',  trend: 12 },
  { title: 'Active Clients', value: '842',   icon: 'mdi-account-group-outline',color: 'info',     avatarColor: 'info',     trend: 8  },
  { title: 'Deals Closed',   value: '96',    icon: 'mdi-handshake-outline',    color: 'success',  avatarColor: 'success',  trend: -3 },
  { title: 'Revenue (PHP)',  value: '₱42.5M',icon: 'mdi-currency-php',         color: 'warning',  avatarColor: 'warning',  trend: 18 },
]

const chartBars = [
  { month: 'Jul', x: 20,  w: 50, h: 80,  y: 110 },
  { month: 'Aug', x: 90,  w: 50, h: 120, y: 70  },
  { month: 'Sep', x: 160, w: 50, h: 95,  y: 95  },
  { month: 'Oct', x: 230, w: 50, h: 140, y: 50  },
  { month: 'Nov', x: 300, w: 50, h: 110, y: 80  },
  { month: 'Dec', x: 370, w: 50, h: 160, y: 30  },
  { month: 'Jan', x: 440, w: 50, h: 130, y: 60  },
  { month: 'Feb', x: 510, w: 50, h: 100, y: 90  },
]

const propTypes = [
  { label: 'Residential', pct: 50, color: '#0A303C' },
  { label: 'Commercial',  pct: 25, color: '#344a53' },
  { label: 'Condo',       pct: 15, color: '#90CAF9' },
  { label: 'Land',        pct: 10, color: '#E0E0E0' },
]

const recentListings = [
  { id: 1, name: 'Modern Villa w/ Pool',    location: 'Alabang, Muntinlupa', type: 'Residential', price: '₱12.5M',    status: 'Active',  date: 'Jan 28' },
  { id: 2, name: 'BGC Executive Suite',     location: 'BGC, Taguig',        type: 'Condo',        price: '₱8.2M',     status: 'Pending', date: 'Jan 26' },
  { id: 3, name: 'Commercial Space 3F',     location: 'Makati CBD',         type: 'Commercial',   price: '₱180K/mo',  status: 'Active',  date: 'Jan 25' },
  { id: 4, name: 'Suburban Townhouse',      location: 'Quezon City',        type: 'Residential',  price: '₱4.8M',     status: 'Sold',    date: 'Jan 22' },
  { id: 5, name: 'Beachfront Lot 500sqm',   location: 'Batangas',           type: 'Land',         price: '₱6.5M',     status: 'Active',  date: 'Jan 20' },
]

const activities = [
  { id: 1, title: 'New inquiry from Juan dela Cruz', time: '2 mins ago',  color: 'primary' },
  { id: 2, title: 'Listing #1284 approved',          time: '1 hour ago',  color: 'success' },
  { id: 3, title: 'Deal closed: BGC Suite',          time: '3 hours ago', color: 'info'    },
  { id: 4, title: 'New agent registered',            time: 'Yesterday',   color: 'warning' },
  { id: 5, title: 'Payment received ₱12.5M',         time: '2 days ago',  color: 'success' },
]

const statusColor = (status) => {
  const map = { Active: 'success', Pending: 'warning', Sold: 'info' }
  return map[status] ?? 'grey'
}
</script>