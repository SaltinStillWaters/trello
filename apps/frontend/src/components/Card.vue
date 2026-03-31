<template>
  <v-card 
    class="mb-2 rounded border" 
    elevation="0" 
    hover
    @click="$emit('click', card)"
  >
    <v-card-text class="pa-3 text-body-2 text-grey-darken-3 d-flex justify-space-between align-center">
      <span>{{ card.title }}</span>
      <v-icon size="small" color="grey-lighten-1">mdi-pencil-outline</v-icon>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  card: { type: Object, required: true }
});

defineEmits(['click']);
</script>