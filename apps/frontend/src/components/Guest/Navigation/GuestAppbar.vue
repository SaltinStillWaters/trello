<template>
  <v-app-bar flat color="#075BAB" border="b" height="68">

    <!-- Logo -->
    <template v-slot:prepend>
      <div class="d-flex align-center ga-2 ml-2">
        <v-img width="100" :src="logoPath"/>
      </div>
    </template>

    <!-- Centered nav — sits in the default slot which fills remaining space -->
    <div class="d-none d-md-flex align-center justify-center ga-16 flex-grow-1">
      <v-btn
        v-for="item in navItems"
        :key="item.to"
        variant="text"
        rounded="lg"
        :to="item.to"
        :color="isActive(item.to) ? 'white-darken-2' : 'white'"
        :class="isActive(item.to) ? 'font-weight-bold' : 'text-medium-emphasis'"
      >
        {{ item.label }}
      </v-btn>
    </div>

    <!-- Login + mobile toggle -->
    <template v-slot:append>
      <v-btn
        color="white-darken-2"
        variant="flat"
        rounded="lg"
        size="small"
        class="d-none d-md-flex mr-3"
        to="/login"
      >
        <v-icon start size="16">mdi-login</v-icon>
        Login
      </v-btn>
      <v-app-bar-nav-icon class="d-flex d-md-none" @click="drawer = !drawer" />
    </template>
  </v-app-bar>

  <!-- Mobile drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :prepend-icon="item.icon"
        :title="item.label"
        :to="item.to"
        rounded="lg"
        color="white-darken-2"
      />
      <v-divider class="my-2" />
      <v-list-item
        prepend-icon="mdi-login"
        title="Login"
        to="/login"
        rounded="lg"
        color="white-darken-2"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import logoPath from '@/assets/logo-outlined.png'

const drawer = ref(false)
const route = useRoute()

const navItems = [
  { label: 'Home',       to: '/',           icon: 'mdi-home-outline' },
  { label: 'Products', to: '/products', icon: 'mdi-office-building-outline' },
]

const isActive = (to) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

</script>