import axios from 'axios'
import constant from '@/constant'
import { useAuthStore } from './stores/auth'
import { Color, useUIStore } from './stores/ui'

const api = axios.create({
  baseURL: constant.apiv1,
  timeout: constant.timeout,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})

let isSessionDialogShown = false
let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
}

api.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

// RESPONSE interceptor with intelligent refresh token logic
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    console.log({error})
    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        .then(() => {
          return api(originalRequest)
        })
        .catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Call refresh endpoint
        const response = await axios.post(
          `${constant.apiv1}${constant.refresh}`,
          {},
          {
            withCredentials: true, // Send cookies with refresh token
          }
        )

        console.log('REFRESH')
        console.log({response})
        if (response.status !== 201) {
          throw new Error('Refresh failed')
        }

        // Process queued requests
        processQueue(null)

        isRefreshing = false

        // Retry original request
        isSessionDialogShown = false
        
        return api(originalRequest)

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)

        processQueue(refreshError)
        isRefreshing = false

        if (!isSessionDialogShown) {
          isSessionDialogShown = true
          const uiStore = useUIStore()
          uiStore.queueMessage(Color.ERROR, 'Please log in to continue')
          const authStore = useAuthStore()
          authStore.logout()
        }

        return Promise.reject(refreshError)
      }
    }

    // For other errors, just reject
    return Promise.reject(error)
  }
)

export default api