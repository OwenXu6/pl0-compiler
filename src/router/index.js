import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/home.vue';


const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import('../views/dashboard.vue'),
            },
            {
                path: '/collection_add',
                name: 'basetable7',
                meta: {
                    title: '新增藏品',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/collection_add.vue'),
            },
            {
                path: '/collection_search',
                name: 'basetable1',
                meta: {
                    title: '查询藏品',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/collection_search.vue'),
            },
            {
                path: '/collection_repair',
                name: 'basetable2',
                meta: {
                    title: '修缮藏品',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/collection_repair.vue'),
            },
            {
                path: '/collection_research4unknown',
                name: 'basetable8',
                meta: {
                    title: '未知文物研究鉴定',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/collection_research4unknown.vue'),
            },
            {
                path: '/Human_Management',
                name: 'basetable4',
                meta: {
                    title: '人事管理',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/Human_Management.vue'),
            },
            {
                path: '/statistics',
                name: 'basetable3',
                meta: {
                    title: '统计信息',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/statistics.vue'),
            },
            {
                path: '/table',
                name: 'basetable',
                meta: {
                    title: '展厅',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table.vue'),
            },
            {
                path: '/collections',
                name: 'collections',
                meta: {
                    title: '展品详情',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "collections" */ '../views/collections.vue'),
            },
            {
                path: '/activity',
                name: 'activity',
                meta: {
                    title: '活动',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "activity" */ '../views/activity.vue'),
            },

            {
                path: '/feedbacks',
                name: 'feedback',
                meta: {
                    title: '反馈列表',
                    permiss: '12',
            },
            component: () => import(/* webpackChunkName: "feedback" */ '../views/feedbacks.vue'),
            },
            {
                path: '/products',
                name: 'product',
                meta: {
                    title: '文创产品',
                    permiss: '12',
                },
                component: () => import(/* webpackChunkName: "product" */ '../views/products.vue'),
            },
            {
                path: '/cooperations',
                name: 'cooperation',
                meta: {
                    title: '合作联名项目',
                    permiss: '12',},
                component: () => import(/* webpackChunkName: "cooperation" */ '../views/cooperations.vue'),

            },
            {
                path:'/ccard',
                name:'ccard',
                meta:{
                    title:'文创卡片',
                    permiss:'12',
                },
                component:()=>import(/* webpackChunkName: "ccard" */ '../views/ccard.vue'),
            },
            {
                path: '/demo',
                name: 'demo',
                meta: {
                    title: '图标实例',
                    permiss: '13',
                },
                component: () => import(/* webpackChunkName: "demo" */ '../views/demo.vue'),

            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
