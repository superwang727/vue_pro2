import request from '@/utils/request'

export default{
  getNestedList() {
    return request({
      url: '/admin/edu/subject/nested',
      method: 'get'
    })
  }
}
