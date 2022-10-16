<template>
  <div class="login-container">
    <div class="login-head"></div>
    <el-form class="login-form" ref="login-form" :rules="formRules" :model="user" >
      <el-form-item prop="mobile">
        <el-input
        v-model="user.mobile"
        placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
        v-model="user.code"
        placeholder="请输入验证码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" :loading="loginLoading" type="primary" @click="onLogin">登录</el-button>
      </el-form-item>
    </el-form>
    <a class="records" href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2022000697号-1</a>
  </div>
</template>

<script>
// import request from '@/utils/request.js'
import { userLogin } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false
      },
      // checked: false,
      loginLoading: false,
      formRules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: 'change' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      this.$refs['login-form'].validate((valid) => {
        if (!valid) {
          return
        }
        this.login()
      })
    },
    login () {
      // 获取表单数据
      const user = this.user
      this.loginLoading = true
      userLogin(user).then(res => {
        console.log(res)
        this.loginLoading = false
        this.$message({
          message: '登录成功！',
          type: 'success'
        })
        window.sessionStorage.setItem('user', JSON.stringify(res.data.data))
        this.$router.push('/layout')
      }).catch(error => {
        console.log(error)
        this.loginLoading = false
        this.$message.error('登录失败！手机号或验证码错误')
      })
    }
  }
}
</script>

<style lang="less">
.login-container{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("../../assets/login_bg.jpg") no-repeat;
  background-size: cover;
  .login-head{
    width: 300px;
    height: 57px;
    background: url("../../assets/logo_index.png") no-repeat;
    margin-bottom: 30px;
  }
  .login-form{
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
    .login-btn{
      width:100%;
    }
 }
 .records {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-80px);
    font-size: 14px;
    color: black;
 }
}

</style>
