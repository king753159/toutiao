/** 基于axios封装 */
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router' // 非组件加载路由需要单独加载
import { Message } from 'element-ui'

// 创建 axios 实例
// 我们通过这个实例去发请求 ，把需要的配置配置给这个实例来发请求 create 复制了一个axios，相互之间功能不影响
// jsonbig 用于转换超出js范围的数字
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/',
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (e) {
      return data
    }
  }]
})
// 请求拦截  config 是当前请求相关配置信息对象 return config 后请求才会真正的发出去 token可以统一设置在axios请求器里边
request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  }
)
// 响应拦截
request.interceptors.response.use(
  function (reponse) {
    return reponse
  },
  function (err) {
    const { status } = err.response
    if (status === 401) {
      window.sessionStorage.removeItem('user')
      router.push('/login')
      Message('登录状态无效，请重新登录')
    } else if (status === 403) {
      Message('没有操作权限')
    } else if (status === 400) {
      Message('参数错误，请检查请求参数')
    } else if (status >= 500) {
      Message.error('服务端内部异常，请稍后重试')
    }
    return Promise.reject(err)
  }
)

export default request
