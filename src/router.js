import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import LoginView from './views/LoginView.vue'
import {TokenService, RedirectService} from './services/storage.service'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {
                public: true,  // Allow access to even if not logged in
                onlyWhenLoggedOut: true
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('./views/ProfileView.vue')
        },
        {
            path: '/notes',
            name: 'notes',
            component: () => import('./views/Notes.vue')
        },
        {
            path: '/events',
            name: 'events',
            component: () => import('./views/Events.vue')
        },
        {
            path: '/polls',
            name: 'polls',
            component: () => import('./views/Polls.vue')
        },
        {
            path: '/picture2ascii',
            name: 'picture2ascii',
            component: () => import('./views/Picture2Ascii.vue')
        },
    ]
});

router.beforeEach((to, from, next) => {
    const isPublic = to.matched.some(record => record.meta.public);
    const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut);
    const loggedIn = !!TokenService.getToken();

    if (!isPublic && !loggedIn) {
        RedirectService.saveUri(to.fullPath); // Store the full path to redirect the user to after login
        return next({
            path: '/login'
        });
    }

    // Do not allow user to visit login page or register page if they are logged in
    if (loggedIn && onlyWhenLoggedOut) {
        return next('/')
    }

    next();
});


export default router;