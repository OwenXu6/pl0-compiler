import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
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
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/collection_add',
                name: 'basetable',
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
                name: 'basetable3',
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
                path: '/charts',
                name: 'basecharts',
                meta: {
                    title: '图表',
                    permiss: '11',
                },
                component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
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
                path: '/form',
                name: 'baseform',
                meta: {
                    title: '表单',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            },
            {
                path: '/tabs',
                name: 'tabs',
                meta: {
                    title: 'tab标签',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            },
            {
                path: '/donate',
                name: 'donate',
                meta: {
                    title: '鼓励作者',
                    permiss: '14',
                },
                component: () => import(/* webpackChunkName: "donate" */ '../views/donate.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '13',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            },
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传插件',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            },
            {
                path: '/icon',
                name: 'icon',
                meta: {
                    title: '自定义图标',
                    permiss: '10',
                },
                component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
            },
            {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                    permiss: '9',
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
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

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
