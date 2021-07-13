<template>
  <div class="upload-cover" @click="showCoverSelect">
      <div class="cover-wrap">
        <img v-if="imgUrl" :src="value" ref="cover-img"/>
        <i v-else class="el-icon-plus"></i>
      </div>
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="素材库" name="first">
            <image-list ref="image-list" isShowSelected :isShowAdd="false" :isShowAction="false"/>
          </el-tab-pane>
          <el-tab-pane label="上传图片" name="second">
            <input type="file" id="file"  ref="file" @change="onFileChange"/>
            <img ref="preImg" width="100" />
          </el-tab-pane>
        </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/article'
import imageList from '@/components/image-list'
export default {
  name: 'articleCover',
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first',
      imgUrl: ''
    }
  },
  methods: {
    showCoverSelect () {
      this.dialogVisible = true
    },
    onFileChange () {
      const file = this.$refs.file.files[0]
      const blob = window.URL.createObjectURL(file)
      this.$refs.preImg.src = blob
      // 防止用户选择同一个文件，不触发change事件 （这里不需要这个清空）
      // this.$refs.file.value = ''
    },
    onCoverConfirm () {
      if (this.activeName === 'second') {
        const fileData = this.$refs.file.files[0]
        if (!fileData) {
          this.$message({
            type: 'warning',
            message: '请选择文件'
          })
          return false
        }
        const fd = new FormData()
        fd.append('image', fileData)
        uploadImage(fd).then(res => {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          // this.$refs['cover-img'].src = res.data.data.url
          // this.$emit('update-cover', res.data.data.url)
          this.imgUrl = res.data.data.url
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return false
        }
        this.dialogVisible = false
        this.imgUrl = imageList.pageList[selected].url
        this.$emit('input', imageList.pageList[selected].url)
      }
    }
  },
  components: {
    imageList
  }
}
</script>

<style lang="less" scoped>
.cover-wrap{
  width: 100px;
  height: 100px;
  border: 1px dotted #409EFF;
  margin-right: 10px;
  img{
    width:100%;
    height: 100%;
  }
  .el-icon-plus{
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    line-height: 100px;
    text-align: center;
  }
}
</style>
