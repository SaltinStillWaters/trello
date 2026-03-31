import { useAuthStore } from '@/stores/auth'
import { Color, useUIStore } from '@/stores/ui'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // GUEST LAYOUT
  {
    path: '/',
    component: () => import('@/layouts/GuestLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Guest/Login.vue'),
        meta: { guest: true, hideAppBar: true },
      },
    ],
  },

  // USER LAYOUT (auth required)
  {
    path: '/admin',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/User/Dashboard.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Dynamic import error handling
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

// Navigation Guard — use return instead of next() to avoid deprecation warning
router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth)

  // Not logged in, trying to access protected route → redirect to login
  if (requiresAuth && !isAuthenticated) {
    const uiStore = useUIStore()
    uiStore.queueMessage(Color.ERROR, 'Please log in to continue')
    return { name: 'Login' }
  }

  // Already logged in, trying to access login page → redirect to dashboard
  if (to.name === 'Login' && isAuthenticated) {
    return { name: 'Dashboard' }
  }

  // All good — proceed
  return true
})

export default router