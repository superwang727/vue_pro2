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
      <!-- 一级分类-->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="changeSubjectList">
          <el-option
            v-for="sub in subjectList"
            :key="sub.id"
            :label="sub.title"
            :value="sub.id"
          />
        </el-select>

        <!-- 二级分类-->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="请选择">
          <el-option
            v-for="sub in subjectLevleTwoList"
            :key="sub.id"
            :label="sub.title"
            :value="sub.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          class="cover-uploader"
          action="http://127.0.0.1:8120/admin/oss/file/upload?module=cover">
          <img v-if="courseInfo.cover" :src="courseInfo.cover">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

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
import subjectApi from '@/api/subject'

import Tinymce from '@/components/Tinymce' // 导入富文本组件

export default {
  // 富文本
  components: { Tinymce },

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
      teacherList: [], // 选择老师名字
      subjectList: [], // 选择课程的分类级联,一级分类
      subjectLevleTwoList: [] // 二级分类
    }
  },

  created() {
    if (this.$route.name === 'CourseInfoEdit') {
      this.$parent.courseId = this.$route.params.id
      this.active = 0
    }

    if (this.$route.name === 'CourseChapterEdit') {
      this.$parent.courseId = this.$route.params.id
      this.active = 1
    }

    if (this.$parent.courseId) { // 如果courseID不是空，就回显数据
      this.fetchCourseById(this.$parent.courseId)
    } else {
      // 如果是空，那么就是新增数据，二级分类就不显示
      this.getSubjectListData()
    }

    this.getTeacherList()
  },

  methods: {

    // 保存并且下一步
    saveAndNext() {
      console.log('pid:', this.$parent.courseId)
      this.saveBtnDisabled = true

      if (this.$parent.courseId) {
        this.updateData()
      } else {
        this.saveCourseData()
      }
    },

    // 保存课程数据，拿到课程的id，赋值给父级的list.vue中的courseId，这样三个步骤都可以共用courseId了
    // courseId是什么？就是后端CourseInfoForm这个实体类，id就保存后回显的id
    saveCourseData() {
      courseApi.saveCourseInfo(this.courseInfo).then(resp => {
        this.$message({ message: resp.message, type: 'success' })
        this.$parent.courseId = resp.data.courseId
        this.$parent.active = 1 // 保存完了以后进入下一步
      })
    },

    updateCourseData() {},

    // 获取所有老师列表
    getTeacherList() {
      teacherApi.list().then(resp => {
        this.teacherList = resp.data.datalist
      })
    },

    // 获取课程分类的所有数据
    getSubjectListData() {
      subjectApi.getNestedList().then(resp => {
        this.subjectList = resp.data.datalist
      })
    },

    // 根据一级分类的id，获取二级分类数据
    changeSubjectList(value) {
      // 遍历一级分类数据，如果id相等，就把二级分类数据取出来赋值
      this.subjectList.forEach(subject => {
        if (subject.id === value) {
          this.courseInfo.subjectId = ''
          this.subjectLevleTwoList = subject.children
        }
      })
    },

    // 上传成功回调
    handleCoverSuccess(res, file) {
      if (res.success) {
        // console.log(res)
        this.courseInfo.cover = res.data.fileUrl
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('文件上传失败！（非20000）')
      }
    },

    // 上传校验
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 错误处理
    handleCoverError() {
      console.log('error')
      this.$message.error('文件上传失败！（htpp）')
    },

    //
    //
    // 数据的回显，根据id获取课程信息
    fetchCourseById(id) {
      courseApi.getCourseInfoById(id).then(resp => {
        this.courseInfo = resp.data.datalist

        // 这里还有二级分类显示id的问题，如果是回显状态，就要判断回显数据的id和请求数据的id相等，才回显二级分类
        // 这里相当于手动做了二级分类的显示
        subjectApi.getNestedList().then(resp => {
          this.subjectList = resp.data.datalist
          this.subjectList.forEach(sub => {
            if (sub.id === this.courseInfo.subjectParentId) {
              this.subjectLevleTwoList = sub.children
            }
          })
        })
      })
    },

    // 数据更新，就是回显之后，再保存数据
    updateData() {
      courseApi.updateCourseById(this.courseInfo).then(resp => {
        this.$message.success(resp.message)
        this.$parent.active = 1 // 下一步
      })
    }

  }
}
</script>

<style>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cover-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}
.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
