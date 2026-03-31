import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const storedUser = localStorage.getItem('user')
  
  const initialUser = (storedUser && storedUser !== 'undefined') 
    ? JSON.parse(storedUser) 
    : null
    
  const user = ref(initialUser)

  const isAuthenticated = computed(() => !!user.value)

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    const data = response.data.data
    console.log({data})
    user.value = data.user

    localStorage.setItem('user', JSON.stringify(data.user))

    return data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      // silent fail - still clear local state
    } finally {
      user.value = null
      localStorage.removeItem('user')
      router.push({ name: 'Login' })
    }
  }

  const fetchMe = async () => {
    try {
      const response = await api.get('/auth/profile')
      user.value = response.data.data
      console.log(user.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      return user.value
    } catch (err) {
      user.value = null
      localStorage.removeItem('user')
      throw err
    }
  }

  return { user, isAuthenticated, login, logout, fetchMe }
})