<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/layout">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-form ref="form" :rules="formRules" :model="articles" label-width="60px">
          <el-form-item prop="title" label="标题">
            <el-input v-model="articles.title"></el-input>
          </el-form-item>
          <el-form-item prop="content" label="内容">
            <!-- 报lang undefined 需要添加 lang = “zh” -->
            <el-tiptap height="400" placeholder="请输入文章内容" v-model="articles.content" :extensions="extensions" lang="zh"></el-tiptap>
          </el-form-item>
          <el-form-item label="封面">
            <el-radio-group v-model="articles.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <template v-if="articles.cover.type > 0">
                <div class="imgDisplay">
                <articleCover
                v-for="(cover, index) in articles.cover.type"
                :key="cover"
                v-model="articles.cover.images[index]"
                />
                </div>
              <!-- <articleCover
              v-for="(cover, index) in articles.cover.type"
              :key="cover"
              //编辑传给子组件展示
              :cover-image="articles.cover.images[index]"
              //子组件上传图片地址传回父组件
              @update-cover="onUpdateCover(index, $event)"
              /> -->
              <!-- $event手动增加由原本父组件传来的参数 -->
            </template>
          </el-form-item>
          <el-form-item prop="channel_id" label="频道">
            <el-select v-model="articles.channel_id" placeholder="请选择频道">
              <el-option v-for="v in channels" :key="v.id" :label="v.name" :value="v.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onPublish(false)">{{ $route.query.id ? '修改' : '发表' }}</el-button>
            <el-button v-if="!$route.query.id" @click="onPublish(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { publishArticle, updateArticle, getChannels, getOneArticle, uploadImage } from '@/api/article'
import articleCover from '@/components/article-cover'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Image,
  Iframe,
  TextColor
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
export default {
  name: 'PublishIndex',
  data () {
    return {
      articles: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: null
      },
      channels: [],
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new Image({
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
          }
        }),
        new Iframe(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new HorizontalRule(),
        new TodoList(),
        new TodoItem(),
        new TextColor()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator: (rule, value, callback) => {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      }
    }
  },
  created () {
    this.loadChannels()
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    loadChannels () {
      getChannels().then(({ data }) => {
        this.channels = data.data.channels
      })
    },
    onPublish (draft = false) {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        } else {
          const articleId = this.$route.query.id
          if (articleId) {
            updateArticle(articleId, this.articles, draft).then(res => {
              this.$message({
                message: `${draft ? '存入草稿' : '修改'}成功`,
                type: 'success'
              })
              this.$router.push('/article')
            })
          } else {
            publishArticle(this.articles, draft).then(res => {
              this.$message({
                message: `${draft ? '存入草稿' : '发布'}成功`,
                type: 'success'
              })
            })
            this.$router.push('/article')
          }
        }
      })
    },
    loadArticle () {
      getOneArticle(this.$route.query.id).then(res => {
        this.articles = res.data.data
      })
    }
    // onUpdateCover (index, url) {
    //   this.articles.cover.images[index] = url
    // }
  },
  components: {
    'el-tiptap': ElementTiptap,
    articleCover
  }
}
</script>

<style lang="less" scoped>
.imgDisplay{
  display: flex;
}
</style>
