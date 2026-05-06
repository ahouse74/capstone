import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/user.js'

import WelcomeView from '../views/WelcomeView.vue'
import HomeView from '../views/HomeView.vue'
import ListingView from '../views/ListingView.vue'
import NewListingView from '../views/NewListingView.vue'

const routes = [
  { path: '/', name: 'welcome', component: WelcomeView },
  { path: '/home', name: 'home', component: HomeView, meta: { requiresName: true } },
  { path: '/listing/:id', name: 'listing', component: ListingView, meta: { requiresName: true } },
  { path: '/new', name: 'new-listing', component: NewListingView, meta: { requiresName: true } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (to.meta.requiresName && !userStore.hasName) {
    return { name: 'welcome' }
  }
  // If user already has a name and hits /, send to /home
  if (to.name === 'welcome' && userStore.hasName) {
    return { name: 'home' }
  }
})

export default router
