<template>
  <v-app-bar flat color="white" border="b" height="68" elevation="2">

    <!-- Hamburger toggle — commented out for now -->
    <!-- <v-app-bar-nav-icon @click="emit('toggle-drawer')" /> -->

    <!-- Logo -->
    <v-app-bar-title>
      <div class="d-flex align-center ga-2">
        <v-icon color="primary" size="24">mdi-home-city</v-icon>
        <span class="text-subtitle-1 font-weight-bold">EstateVue</span>
      </div>
    </v-app-bar-title>

    <template v-slot:append>

      <!-- Notifications -->
      <!-- <v-btn icon variant="text" class="mr-1">
        <v-badge color="error" content="3" floating>
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn> -->

      <!-- User Avatar Menu -->
      <v-menu min-width="220" rounded="lg" :offset="[8, 0]">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            rounded="lg"
            class="mr-2 text-none"
          >
            <v-avatar size="34" color="primary" class="mr-2">
              <span class="text-white text-caption font-weight-bold">{{ initials }}</span>
            </v-avatar>
            <span class="d-none d-sm-inline text-body-2 font-weight-medium text-capitalize">{{ userName }}</span>
            <v-icon size="18" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-card elevation="4" rounded="lg">
          <!-- User info -->
          <v-list-item :title="userName" :subtitle="userEmail" class="py-3">
            <template v-slot:prepend>
              <v-avatar color="primary" size="40">
                <span class="text-white font-weight-bold text-body-2">{{ initials }}</span>
              </v-avatar>
            </template>
          </v-list-item>

          <v-divider />

          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-account-circle-outline"
              title="Profile"
              rounded="lg"
            />
            <v-list-item
              prepend-icon="mdi-cog-outline"
              title="Settings"
              rounded="lg"
            />
            <v-divider class="my-1" />
            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              rounded="lg"
              base-color="error"
              @click="logout"
            />
          </v-list>
        </v-card>
      </v-menu>

    </template>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const emit      = defineEmits(['toggle-drawer'])
const router    = useRouter()
const authStore = useAuthStore()

const userName  = computed(() => authStore.user?.username || 'User')
const initials  = computed(() =>
  userName.value.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
)

const logout = async () => {
  await authStore.logout()
  console.log('logging out')
}
</script>