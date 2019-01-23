import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Tables from './views/Tables.vue';
import Login from './views/Login.vue';
import Profile from './views/Profile.vue';
import Register from './views/Register.vue';
import auth from './utils/auth';


Vue.use(Router);


const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/tables',
      name: 'tables',
      component: Tables,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    auth.isLoggedIn().then((result) => {
      if (!result) {
        next({
          path: '/login',
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});


export default router;
