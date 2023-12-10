import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "../stores/user.js"
import HomeView from '../views/HomeView.vue'
import Dashboard from "../components/Dashboard.vue"
import Login from "../components/auth/Login.vue"
import ChangePassword from "../components/auth/ChangePassword.vue"
import User from "../components/users/User.vue"
import Admins from "../components/users/admins/Admins.vue"
import Vcards from '../components/users/vcards/Vcards.vue'
import Transactions from '../components/transactions/Transactions.vue'
import Transaction from  '../components/transactions/Transaction.vue'
import Blocked from  '../views/Blocked.vue'

import Categories from '../components/categories/Categories.vue'

let handlingFirstRoute = true

const router = createRouter({
  
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/blocked',
      name: 'blocked',
      component: Blocked
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/password',
      name: 'ChangePassword',
      component: ChangePassword
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/vcards',
      name: 'Vcards',
      component: Vcards
    },
    {
      path: '/:type/new',
      name: 'NewUser',
      component: User,
      props: (route) => ({ id: -1, type: route.params.type })
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions
    },
    {
      path: '/transactions/new',
      name: 'NewTransaction',
      component: Transaction,
      props: { id: -1 }
    },
    {
      path: '/transactions/:id',
      name: 'Transaction',
      component: Transaction,
      props: route => ({ id: parseInt(route.params.id)})
    },
    {
      path: '/admins',
      name: 'Admins',
      component: Admins,
    },
    {
      path: '/vcard/:id',
      name: 'Vcard',
      component: User,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ id: parseInt(route.params.id), type: 'vcard'})
    },
    {
      path: '/admin/:id',
      name: 'Admin',
      component: User,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ id: parseInt(route.params.id), type: 'admin' })
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await userStore.restoreToken()
  }
  
  if (userStore.userBlocked && to.name !== 'blocked') {
      // Redirect to the blocked page
      next({ name: 'blocked' });
      return
  }
  if ((to.name == 'Login') || (to.name == 'home') || (to.name == 'NewUser')) {
    next()
    return
  }
  if ((!userStore.user) && (!to.name == 'NewUser')) {
    next({ name: 'Login' })
    return
  }
  if (to.name == 'Reports') {
    if (userStore.user.type != 'A') {
      next({ name: 'home' })
      return
    }
  }
  if (to.name == 'User') {
    if (userStore.user.id == to.params.id) {
      next()
      return
    }
    next({ name: 'home' })
    return
  }
  next()
})


export default router
