<template>
  <div class="layout-container">
    <el-container class="layout-container">
      <el-aside
       class="aside"
       width="auto"
      >
      <AppAside class="aside-menu" :is-collapse='isCollapse'/>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div>
            <i :class="isCollapse ? 'el-icon-s-unfold':'el-icon-s-fold'" @click="isCollapse = !isCollapse"></i>
            <span>成都王氏集团有限公司</span>
          </div>
          <el-dropdown>
            <div class="person-box">
              <img :src="user.photo" class="picture" />
              <span>{{user.name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><i class="el-icon-setting"></i>个人设置</el-dropdown-item>
              <el-dropdown-item @click.native="onLogout"><i class="el-icon-warning-outline"></i> 退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppAside from '@/components/aside'
import { getUserInfo } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  data () {
    return {
      user: {},
      isCollapse: false
    }
  },
  created () {
    this.loadUserInfo()
    // 注册自定义事件
    // 当这个事件发布后，这个注册函数就会被调用
    globalBus.$on('update-user', (data) => {
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    loadUserInfo () {
      getUserInfo().then(res => {
        this.user = res.data.data
        console.log(this.user)
      })
    },
    onLogout () {
      this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.removeItem('user')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  components: {
    AppAside
  }
}
</script>

<style lang="less" scoped>
.layout-container{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside{
  .aside-menu{
  height: 100%;
 }
}
.header{
  height: 60px;
  display:flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .person-box{
    display: flex;
    align-items: center;
    .picture{
    width:40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
   }
  }
}
.main{
  background-color: #eee;
}

</style>
