<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/layout">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        class="table-list"
        :data="tableData"
        stripe
        max-height="370"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="标题"
          >
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          >
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数"
          >
        </el-table-column>
        <el-table-column
          label="状态"
          >
          <template slot-scope="scope">
           {{ scope.row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.statusDisable"
              @change="editComment(scope.row)">
            </el-switch>
            <!-- <el-button v-if="scope.row.comment_status" type="danger" size="small" @click="editComment(scope.row)">关闭评论</el-button>
            <el-button v-else type="success" size="small" @click="editComment(scope.row)">打开评论</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"/>
    </el-card>
  </div>
</template>

<script>
import { getArticle, updateComment } from '@/api/article'
export default {
  name: 'CommentIndex',
  data () {
    return {
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      page: 1
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    loadArticle (page = 1) {
      this.page = page
      getArticle({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        console.log(res)
        const { results, total_count: totalCount } = res.data.data
        results.forEach(item => {
          item.statusDisable = false
        })
        this.tableData = results
        this.totalCount = totalCount
      })
    },
    handleSizeChange () {
      this.loadArticle(1)
    },
    handleCurrentChange (val) {
      this.loadArticle(val)
    },
    editComment (article) {
      article.statusDisable = true
      // article.comment_status = !article.comment_status
      updateComment(article.id.toString(), article.comment_status).then(res => {
        article.statusDisable = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启成功！' : '关闭成功！'
        })
      })
    }
  }
}
</script>

<style lang="less">
.table-list{
  margin-bottom: 30px;
}
</style>
