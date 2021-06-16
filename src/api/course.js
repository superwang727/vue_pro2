import request from '@/utils/request'

export default {

  saveCourseInfo(courseInfo) {
    return request({
      url: '/admin/edu/course/add-course',
      method: 'post',
      data: courseInfo
    })
  }

}
