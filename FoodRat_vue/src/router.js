import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/scan',
            name: 'scan',
            // lazy-loaded
            component:()=>import('./views/Scan.vue')
        },

    ]
});