import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/axios'

export const useBoardStore = defineStore('board', () => {
  const boards = ref([])

  const fetchBoards = async () => {
    const result = await api.get('boards')
    boards.value = result.data
  }

  return { boards, fetchBoards }
})