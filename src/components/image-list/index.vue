<template>
    <div>
      <div style="padding-bottom:20px;display: flex;justify-content: space-between;">
        <el-radio-group v-model="collect" size="mini" @change="changeCollect">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true" >收藏</el-radio-button>
        </el-radio-group>
        <el-button type="success" size="mini" v-if="isShowAdd" @click="dialogUploadVisible = true">上传素材</el-button>
      </div>
      <el-row :gutter="10" style="padding-bottom:20px;">
          <el-col class="col" :xs="12" :md="6" :lg="4" @click.native="selected = index" v-for="(img,index) in pageList" :key="index">
            <el-image
            style="height:180px;width:180px;"
            :src="img.url"
            fit="cover">
            </el-image>
            <div class="selected" v-if="isShowSelected && selected === index"></div>
            <div class="collect-box" v-if="isShowAction">
              <el-button
              size="mini"
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              @click="onCollect(img)"
              circle
              :loading="img.loading"
              >
              </el-button>
              <el-button size="mini" icon="el-icon-delete" circle @click="deleteImg(img.id)"></el-button>
              <!-- <i :class="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" @click="onCollect(img)"></i> -->
              <!-- <i class="el-icon-delete" @click="deleteImg(img.id)"></i> -->
            </div>
          </el-col>
        </el-row>
        <el-pagination
          layout="prev, pager, next"
          background
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="page"
          @current-change="currentPage">
        </el-pagination>
        <el-dialog title="上传素材" width="400px" :append-to-body="true" :visible.sync="dialogUploadVisible">
          <el-upload
            class="upload-demo"
            drag
            action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
            :headers= "uploadHeaders"
            name="image"
            :on-success="onUploadSuccess"
            :show-file-list="false"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-dialog>
    </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/article'
export default {
  name: 'imageList',
  props: {
    isShowAdd: {
      type: Boolean,
      default: true
    },
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    return {
      radio1: '全部',
      pageList: [],
      totalCount: 0,
      pageSize: 10,
      page: 1,
      collect: false,
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      selected: null
    }
  },
  created () {
    this.loadImages(1)
  },
  methods: {
    loadImages (page = 1) {
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(item => {
          item.loading = false
        })
        this.pageList = results
        this.totalCount = res.data.data.total_count
      })
    },
    currentPage (page) {
      this.loadImages(page)
    },
    changeCollect () {
      this.loadImages(1)
    },
    onUploadSuccess () {
      this.dialogUploadVisible = false
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功！'
      })
    },
    onCollect (imgData) {
      imgData.loading = true
      collectImage(imgData.id, !imgData.is_collected).then(res => {
        imgData.is_collected = !imgData.is_collected
        imgData.loading = false
      })
    },
    deleteImg (id) {
      this.$confirm('确定要删除图片吗?╮(╯﹏╰）╭', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteImage(id).then(res => {
          this.loadImages(this.page)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.col{
  position: relative;
  .collect-box{
    width: 180px;
    height:30px;
    background-color:rgba(204, 204, 204, .5);
    position: absolute;
    bottom: 4px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .el-icon-star-on{
      color:red;
    }
  }
}
.selected{
  background: url('../../assets/selected.jpg') no-repeat;
  background-size: 100%;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 40px;
  left: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
}
</style>
