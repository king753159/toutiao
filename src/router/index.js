import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/views/login')
const Home = () => import('@/views/home')
const Layout = () => import('@/views/layout')
const Article = () => import('@/views/article')
const Image = () => import('@/views/image')
const Publish = () => import('@/views/publish')
const Comment = () => import('@/views/comment')
const Fans = () => import('@/views/fans')
const Settings = () => import('@/views/settings')

Vue.use(VueRouter)

const routes = [
  {
    name: 'LoginIndex',
    path: '/login',
    component: Login
  },
  {
    // name: 'LayoutIndex', // 有个警告，这儿有默认子路由名字后，父路由的不生效
    path: '/layout',
    component: Layout,
    children: [
      {
        name: 'HomeIndex',
        path: '', // path为空，会作为默认子路由渲染
        component: Home
      },
      {
        name: 'ArticleIndex',
        path: '/article',
        component: Article
      },
      {
        name: 'ImageIndex',
        path: '/image',
        component: Image
      },
      {
        name: 'PublishIndex',
        path: '/publish',
        component: Publish
      },
      {
        name: 'CommentIndex',
        path: '/comment',
        component: Comment
      },
      {
        name: 'FansIndex',
        path: '/fans',
        component: Fans
      },
      {
        name: 'SettingsIndex',
        path: '/settings',
        component: Settings
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫 3种情况：前往的页面 1登录页：直接next() 2不是登录页 ： 2(1)含有token直接next() 2(2)不含token 跳转到登录页
router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.sessionStorage.getItem('user'))
  if (to.path !== '/login') {
    if (user) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
export default router
