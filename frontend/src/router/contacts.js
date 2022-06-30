export default {
    path: '/contacts',
    name: 'contacts',
    redirect: '/contacts/apply',
    component: () => import('@/views/contacts/layout.vue'),
    children: [
        {
            path: '/contacts/apply',
            meta: {
                title: '我的联系人',
                needLogin: true,
                keepAlive: true

            },
            component: () => import('@/views/contacts/apply.vue')
        },
        {
            path: '/contacts/friends',
            meta: {
                title: '我的好友',
                needLogin: true,
                keepAlive: true
            },
            component: () => import('@/views/contacts/friends.vue')
        },
        {
            path: '/contacts/groups',
            meta: {
                title: '我的群组',
                needLogin: true,
                keepAlive: true

            },
            component: () => import('@/views/contacts/groups.vue')
        }
    ]
};
