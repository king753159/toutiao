<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/layout">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
     </div>
       <el-row>
         <el-col :span="15">
          <el-form ref="form" :model="userInfo" :rules="ruleForm" class="setting-form" label-width="80px">
            <el-form-item label="编号">
              {{userInfo.id}}
            </el-form-item>
            <el-form-item label="手机号">
              {{userInfo.mobile}}
            </el-form-item>
            <el-form-item prop="name" label="媒体名称">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item prop="intro" label="媒体介绍">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="userInfo.intro"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loadingUser" @click="onUpdateUser">保存设置</el-button>
            </el-form-item>
          </el-form>
         </el-col>
         <el-col :offset="2" style="text-align:center;" :span="4">
          <!-- <el-avatar shape="square" :size="150" fit="cover" :src="userInfo.photo"></el-avatar>
          <p @click="$refs.file.click()">点击修改头像</p> -->
          <label for="file">
            <el-avatar shape="square" :size="150" fit="cover" :src="userInfo.photo"></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input id="file" type="file" ref="file" hidden @change="onFileChange"/>
         </el-col>
       </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpen"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img class="preview-img" ref="pre-image" :src="previewImage" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="updatePhotoLoading" @click="onUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, updateUserPhoto, updateUser } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'
export default {
  name: 'SettingsIndex',
  data () {
    return {
      userInfo: {},
      dialogVisible: false,
      previewImage: '',
      cropper: null,
      updatePhotoLoading: false,
      ruleForm: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 7, message: '请输入 1 到 7 个字', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ]
      },
      loadingUser: false
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    loadUser () {
      getUserInfo().then(res => {
        this.userInfo = res.data.data
      })
    },
    onFileChange () {
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      this.dialogVisible = true
      this.$refs.file.value = ''
    },
    onDialogOpen () {
      // 一：replace 方法
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return false
      }
      // 图片裁切器必须基于img 进行初始化
      // 注意：img 必须是可见状态才能正常完成初始化 （使用opened方法）
      const image = this.$refs['pre-image']
      // 第一次初始化选择图片后，默认裁切器不会更新
      // 方法一：裁切器.replace 方法
      // 方法二：销毁裁切器，重新初始化
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: true
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    onDialogClosed () {
      // 二：销毁图片初始化对象
      // this.cropper.destroy()
    },
    onUpdate () {
      this.updatePhotoLoading = true
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        updateUserPhoto(fd).then(res => {
          this.updatePhotoLoading = false
          this.dialogVisible = false
          this.userInfo.photo = window.URL.createObjectURL(file)
          this.$message({
            type: 'success',
            message: '更新用户头像成功！'
          })
          // 把服务器返回的图片进行展示有点慢
          // this.userInfo.photo = res.data.data.photo
          // this.loadUser()
          globalBus.$emit('update-user', this.userInfo)
        })
      })
    },
    onUpdateUser () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loadingUser = true
          updateUser(this.userInfo).then(res => {
            this.loadingUser = false
            this.$message({
              type: 'success',
              message: '更新用户信息成功！'
            })
            // 发布自定义事件函数
            globalBus.$emit('update-user', this.userInfo)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.preview-image-wrap{
   .preview-img {
    display: block;
    max-width: 100%;
    height: 200px;
   }
}
</style>
