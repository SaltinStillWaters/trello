<template>
  <v-navigation-drawer
    v-model="drawerModel"
    :rail="rail"
    permanent
    color="#0A303C"
    width="260"
  >
    <v-list-item
      class="py-4"
      :prepend-icon="rail ? undefined : 'mdi-view-dashboard'"
    >
      <template v-if="rail" v-slot:prepend>
        <v-icon color="amber-darken-2">mdi-view-dashboard</v-icon>
      </template>
      <v-list-item-title v-if="!rail" class="text-white font-weight-bold text-subtitle-1">
        Workspace
      </v-list-item-title>
    </v-list-item>

    <v-divider class="opacity-20 mb-2" />

    <v-list nav density="comfortable">

      <v-list-subheader v-if="!rail" class="text-uppercase text-caption font-weight-bold opacity-50 text-white">
        Main
      </v-list-subheader>

      <v-list-item
        prepend-icon="mdi-home-outline"
        title="Home"
        rounded="lg"
        color="amber-darken-2"
        base-color="white"
        to="/" 
      />

      <v-divider v-if="!rail" class="my-3 opacity-20" />
      
      <v-list-subheader v-if="!rail" class="text-uppercase text-caption font-weight-bold opacity-50 text-white">
        Your Boards
      </v-list-subheader>

      <v-list-item
        v-for="board in boardStore.boards"
        :key="board.id"
        prepend-icon="mdi-developer-board"
        :title="board.name"
        rounded="lg"
        color="amber-darken-2"
        base-color="white"
        :to="`/boards/${board.id}`"
      />

    </v-list>

    <template v-slot:append>
      <v-divider class="opacity-20" />
      <v-list-item
        :prepend-icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        :title="rail ? '' : 'Collapse'"
        rounded="lg"
        base-color="white"
        class="opacity-60 my-1 mx-2"
        @click="rail = !rail"
      />
    </template>

  </v-navigation-drawer>
</template>

<script setup>
import { useBoardStore } from '@/stores/board'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const drawerModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const rail = ref(false)

// Mock Data for Boards - Eventually, you will fetch this from your backend API
const boardStore = useBoardStore()

onMounted(async () => {
  await boardStore.fetchBoards()
})
</script>