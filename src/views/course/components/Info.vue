<template>
  <div class="app-container">
    <!-- 课程信息表单 TODO -->
    <!-- 课程信息表单 -->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 课程讲师 TODO -->

      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <!-- 所属分类 TODO -->

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->

      <!-- 课程封面 TODO -->

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext()">保存并下一步</el-button>
    </div>
  </div>

</template>

<script>
import courseApi from '@/api/course'
import teacherApi from '@/api/teacher'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 按钮禁用
      courseInfo: {// 表单数据
        price: 0,
        lessonNum: 0,
        // 以下解决表单数据不全时insert语句非空校验
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
        description: ''
      },
      teacherList: []
    }
  },

  created() {
    this.getTeacherList()
  },

  methods: {
    // 保存并且下一步
    saveAndNext() {
      this.saveBtnDisabled = true
      this.saveCourseData()
    },

    // 保存课程数据，拿到课程的id，赋值给父级的list.vue中的courseId，这样三个步骤都可以共用courseId了
    saveCourseData() {
      courseApi.saveCourseInfo(this.courseInfo).then(resp => {
        this.$message({ message: resp.message, type: 'success' })
        this.$parent.courseId = resp.data.courseId
        this.$parent.active = 1 // 保存完了以后进入下一步
      })
    },

    updateCourseData() {},

    getTeacherList() {
      teacherApi.list().then(resp => {
        this.teacherList = resp.data.datalist
      })
    }

  }
}
</script>
