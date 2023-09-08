import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/home.vue';
import { useUserInfo } from '../store/userInfo';


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
                    permiss: []
                },
                component: () => import('../views/dashboard.vue'),
            },
            {
                path: '/collection_add',
                name: 'basetable7',
                meta: {
                    title: '新增藏品',
                    permiss: [],
                },
                component: () => import('../views/collection_add.vue'),
            },
            {
                path: '/collection_search',
                name: 'basetable1',
                meta: {
                    title: '查询藏品',
                    permiss: [],
                },
                component: () => import('../views/collection_search.vue'),
            },
            {
                path: '/collection_research4unknown',
                name: 'basetable8',
                meta: {
                    title: '未知文物研究鉴定',
                    permiss: [],
                },
                component: () => import('../views/collection_research4unknown.vue'),
            },
            {
                path: '/Human_Management',
                name: 'basetable4',
                meta: {
                    title: '人事管理',
                    permiss: [],
                },
                component: () => import('../views/Human_Management.vue'),
            },
            {
                path: '/statistics',
                name: 'basetable3',
                meta: {
                    title: '统计信息',
                    permiss: '3',
                },
                component: () => import('../views/statistics.vue'),
            },
            {
                path: '/table',
                name: 'basetable',
                meta: {
                    title: '展厅',
                    permiss: '2',
                },
                component: () => import('../views/table.vue'),
            },
            {
                path: '/collections',
                name: 'collections',
                meta: {
                    title: '展品详情',
                    permiss: '2',
                },
                component: () => import('../views/collections.vue'),
            },
            {
                path: '/activity',
                name: 'activity',
                meta: {
                    title: '活动',
                    permiss: '2',
                },
                component: () => import('../views/activity.vue'),
            },

            {
                path: '/feedbacks',
                name: 'feedback',
                meta: {
                    title: '反馈列表',
                    permiss: '12',
            },
            component: () => import('../views/feedbacks.vue'),
            },
            {
                path: '/products',
                name: 'product',
                meta: {
                    title: '文创产品',
                    permiss: '12',
                },
                component: () => import('../views/products.vue'),
            },
            {
                path: '/cooperations',
                name: 'cooperation',
                meta: {
                    title: '合作联名项目',
                    permiss: '12',},
                component: () => import('../views/cooperations.vue'),

            },
            {
                path:'/ccard',
                name:'ccard',
                meta:{
                    title:'文创卡片',
                    permiss:'12',
                },
                component:()=>import('../views/ccard.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import('../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import('../views/403.vue'),
    },
    // {
    //     path:'',
    //     name:'404',
    //     meta:{
    //         title:'您要找的页面不存在',
    //     },
    //     component: ()=>import('../views/404.vue')
    // }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
router.beforeEach((to,from,next)=>{
    const userInfo = useUserInfo()
    if(
        (!userInfo.expireTime||
        userInfo.expireTime<new Date())&&
        to.path!=='/login'
    )
    {
        next('/login');
    }
    else{
        next()
        let flag = false;
        if (!Array.isArray(to.meta.permiss) || to.meta.permiss.length === 0)
            flag = true;
        if (Array.isArray(role)) {
            role.forEach(element => {
                if (to.meta.permiss.includes(element)) {
                    flag = true;
                }
            });
        }
        if(flag === false)
        {
            next('/403');
        }
        else
        {
            next();
        }
    }
})
export default router;
