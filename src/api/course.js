import request from '@/utils/request'

export default {

  saveCourseInfo(courseInfo) {
    return request({
      url: '/admin/edu/course/add-course',
      method: 'post',
      data: courseInfo
    })
  },

  getCourseInfoById(id) {
    return request({
      url: `/admin/edu/course/course-info/${id}`,
      method: 'get'
    })
  },

  updateCourseById(courseInfo) {
    return request({
      url: '/admin/edu/course/update-course-info',
      method: 'put',
      data: courseInfo
    })
  },

  queryCoursePageList(page, limit, pageObj) {
    return request({
      url: `/admin/edu/course/listPage/${page}/${limit}`,
      method: 'get',
      params: pageObj
    })
  }

}
