import request from '@/utils/request'

/**
 * 文章相关请求接口  body 参数使用 data 设置  query 参数使用 params 设置  headers 参数使用 headers 设置
 */
export const getArticle = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}

export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}
// 接口中有:XX 代表路径参数，需要拼接上参数
export const deleteArticle = id => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${id}`
  })
}

export const publishArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft
    },
    data
  })
}

export const updateArticle = (id, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${id}`,
    params: {
      draft
    },
    data
  })
}

export const getOneArticle = id => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${id}`
  })
}

export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    // 一般文件上传的接口都要求把请求头中的 content-type 设置为multipart/form-data，
    // 但是我们使用axios上传文件的话不需要手动设置，只需要给data一个formdata对象即可
    data
  })
}

export const getImages = pageData => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params: pageData
  })
}

export const collectImage = (id, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${id}`,
    data: { collect }
  })
}

export const deleteImage = id => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${id}`
  })
}

export const updateComment = (id, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: id
    },
    data: {
      allow_comment: allowComment
    }
  })
}
