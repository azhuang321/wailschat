export default {
    path: '/auth',
    name: 'auth',
    redirect: '/auth/login',
    component: () => import('@/views/auth/Layout.vue'),
    children: [
        {
            path: '/auth/register',
            meta: {
                title: '账号注册？',
                needLogin: false
            },
            component: () => import('@/views/auth/Register.vue')
        },
        {
            path: '/auth/login',
            meta: {
                title: '账号登录？',
                needLogin: false
            },
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/auth/forget',
            meta: {
                title: '找回密码？',
                needLogin: false
            },
            component: () => import('@/views/auth/forget.vue')
        }
    ]
};
