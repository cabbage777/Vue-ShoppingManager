import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'





Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {path:'/',redirect:'/Login'},
    {path:'/Login',component:Login},
    {path:'/Home',component:Home,redirect:'/Welcome',
    children:[{path:'/welcome',component:Welcome},
              {path:'/users',component:Users},
              {path:'/rights',component:Rights},
              {path:'/roles',component:Roles},

            ],
   }
  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next()
  const tokenStr= window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})
export default router
