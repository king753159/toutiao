<template>
  <div class="article-container">
    <el-card shadow="always" class="filter-card">
      <div slot="header" >
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/layout">首页</el-breadcrumb-item>
          <el-breadcrumb-item >内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    <!-- form表单 -->
    <el-form ref="form" size="mini"  label-width="75px">
      <el-form-item label="状态">
        <el-radio-group v-model="status">
          <el-radio :label="null" >全部</el-radio>
          <el-radio :label="0">草稿</el-radio>
          <el-radio :label="1">待审核</el-radio>
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="3">审核失败</el-radio>
          <el-radio :label="4">已删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道">
        <el-select clearable v-model="channelId" placeholder="请选择">
          <el-option label="全部" :value="null"/>
          <el-option v-for="(v, index) in channels" :key="index" :label="v.name" :value="v.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="rangeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="loading" type="primary" @click="loadArticle(1)">查询</el-button>
      </el-form-item>
    </el-form>
    </el-card>
    <el-card shadow="always">
     <div slot="header">根据筛选条件共查询到 {{ totalCount }} 条结果：</div>
    <!-- 数据列表 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      stripe
      size="mini"
      style="width: 100%">
      <el-table-column
        label="封面"
        >
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.cover.images[0]"
            fit="cover"
            lazy>
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <!-- <img class="article-cover" v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" />
          <img class="article-cover" v-else src="../../assets/no-cover.jpg" /> -->
          <!-- 这种情况是针对运行期间动态改变处理的，而本地图片必须在打包的时候就存在 -->
          <!-- <img class="article-cover" :src="scope.row.cover.images[0] || '../../assets/no-cover.jpg'" /> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        >
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发布时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
        <el-button
          size="mini"
          circle
          type="primary"
          icon="el-icon-edit"
          @click="$router.push('/publish?id=' + scope.row.id)"
          ></el-button>
        <el-button
          size="mini"
          circle
          type="danger"
          icon="el-icon-delete"
          @click="onDeleteArticle(scope.row.id)"
          ></el-button>
      </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :disabled="loading"
      class="page-setting"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="totalCount"
      :current-page.sync="page"
      @current-change="onCurrentPage">
    </el-pagination>
   </el-card>
  </div>
</template>

<script>
import { getArticle, getChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  data () {
    return {
      totalCount: 0,
      pageSize: 10,
      status: null,
      channels: [],
      channelId: null,
      rangeDate: [],
      tableData: [],
      loading: false,
      page: 1,
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ]
    }
  },
  created () {
    this.loadArticle(1)
    this.loadChannels()
  },
  methods: {
    loadArticle (page = 1) {
      this.loading = true
      getArticle({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        this.tableData = res.data.data.results
        this.totalCount = res.data.data.total_count
        this.loading = false
      })
    },
    loadChannels () {
      getChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (id) {
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(id.toString()).then(res => {
          this.loadArticle(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onCurrentPage (page) {
      this.loadArticle(page)
    }
  }
}
</script>

<style lang="less">
.filter-card{
  margin-bottom: 10px;
}
.page-setting{
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
.article-cover{
  width: 100px;
  background-size: cover;
}
</style>
