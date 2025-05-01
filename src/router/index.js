import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import(/* webpackChunkName: "chat" */ '../views/ChatView.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Verifică autentificarea înainte de fiecare navigare
router.beforeEach((to, from, next) => {
  // Verifică dacă ruta necesită autentificare
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verifică dacă utilizatorul este autentificat
    if (!store.getters['auth/isAuthenticated']) {
      // Redirecționează către login
      next({ name: 'login' })
    } else {
      // Utilizatorul este autentificat, permite navigarea
      next()
    }
  } else {
    // Ruta nu necesită autentificare, permite navigarea
    next()
  }
})

export default router