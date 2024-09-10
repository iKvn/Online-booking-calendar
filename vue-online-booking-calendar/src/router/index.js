import { createRouter, createWebHistory } from 'vue-router'
import BookingView from '../views/BookingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BookingView,
      props: route => ({ tableid: route.query.tableid, userid: route.query.userid})
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/report',
      name: 'report',
      props: route => ({ reportday: route.query.reportday}),
      component: () => import('../views/ReportView.vue')
    }
  ]
})

export default router
