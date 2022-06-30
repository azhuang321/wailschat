import { createRouter, createWebHashHistory } from 'vue-router';
import Auth from '@/router/auth';
import Contacts from '@/router/contacts';

const routes = [
    Auth,
    Contacts,
    {
        path: '/',
        name: 'Index',
        component: () => import(
            /* webpackChunkName: "index" */
            '@/views/message/Index.vue'
        )
    },
    {
        path: '/message',
        name: 'Message',
        component: () => import(
            /* webpackChunkName: "message" */
            '@/views/message/Index.vue'
        )
    },

    {
        path: '/settings',
        name: 'Settings',
        component: () => import(
            /* webpackChunkName: "settings" */
            '@/views/message/Index.vue'
        )
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import(
            /* webpackChunkName: "test" */
            '@/views/Test.vue'
        )
    },
    {
        path: '/test1',
        name: 'Test1',
        component: () => import(
            /* webpackChunkName: "test1" */
            '@/views/Test1.vue'
        )
    },
    {
        path: '/test2',
        name: 'Test2',
        component: () => import(
            /* webpackChunkName: "test2" */
            '@/views/Test2.vue'
        )
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
