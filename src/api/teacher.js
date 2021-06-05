import request from '@/utils/request'

export default{

  list() {
    return request({
      url: '/admin/edu/teacher/list',
      method: 'get'
    })
  },

  pageList(page, limit, pageObj) {
    return request({
      url: `/admin/edu/teacher/listPage/${page}/${limit}`,
      method: 'get',
      params: pageObj
    })
  },

  removeById(id) {
    return request({
      url: `/admin/edu/teacher/remove/${id}`,
      method: 'delete'
    })
  },

  // 保存教师
  saveTeacher(teacher) {
    return request({
      url: '/admin/edu/teacher/save',
      method: 'post',
      data: teacher

    })
  },

  // 根据id查
  findTeacherById(id) {
    return request({
      url: `/admin/edu/teacher/get/${id}`,
      method: 'get'
    })
  },

  // 更新教师
  updateTeacherById(teacher) {
    return request({
      url: '/admin/edu/teacher/update',
      method: 'put',
      data: teacher

    })
  }

}
