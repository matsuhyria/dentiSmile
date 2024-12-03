import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import AppointmentPage from './views/AppointmentPage.vue'
import BookingPage from './views/BookingPage.vue'


const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/dentists/:dentistId/appointments/', name: 'appointments', component: AppointmentPage, props: true },
  { path: '/booking', name: 'booking', component: BookingPage }
]

const scrollBehavior = async function (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else if (to.hash) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      el: to.hash,
      behavior: 'smooth'
    }
  } else {
    return { top: 0 }
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior
})
export default router
