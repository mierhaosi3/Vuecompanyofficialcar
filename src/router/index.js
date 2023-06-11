import { createRouter, createWebHistory } from 'vue-router'

import MyLogin from '../components/MyLogin'
import MyRegister from '../components/MyRegister'
import MyHome from '../components/MyHome'
import adminHome from '../components/admin/adminHome';
import 'element-plus/theme-chalk/index.css';
import { Message } from 'element-plus/lib/locale/lang/zh-cn'

const router = createRouter({
    history: createWebHistory(),
    routes: [{
            path: '/',
            component: MyLogin
        },{
            path: '/MyLogin',
            component: MyLogin
        },{
            path: '/MyRegister',
            component: MyRegister
        },{
            path: '/MyHome',
            component: MyHome
        },{
            path:'/adminHome',
            component:adminHome
        },
    ],
})
// 导航守卫，前置处理
router.beforeEach((to, from, next) => {
    let isAuthenticated = !!sessionStorage.getItem('userInfo')
    // 如果路由要跳转到除了登录和注册的界面的话就判断是否已经登录，如果没有登录就强制跳到登录界面
    if (to.path !== '/MyLogin' && to.path !== '/MyRegister' && !isAuthenticated) {
        next({ path: '/MyLogin' })
        Message({
            message: '请先登录！',
            type: "warning",
        });
    } else next()
})
export default router;