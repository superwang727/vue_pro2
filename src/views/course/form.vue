<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="active" finish-status="success" simple style="margin-bottom: 40px">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps>

    <!-- step1: Info -->
    <info v-if="active === 0" />

    <!-- step2 : ChapterIndex-->
    <chapter v-if="active === 1" />
    <!-- step3 : Publish -->
    <publish v-if="active === 2 || active === 3" />

  </div>
</template>

<script>
// 引入子组件（自定义组件）
import Info from '@/views/course/components/Info'
import Chapter from '@/views/course/components/Chapter' // index可以省略
import Publish from '@/views/course/components/Publish'
export default {
  // 注册组件
  components: {
    Info, Chapter, Publish
  },

  data() {
    return {
      active: 0,
      courseId: null

    }
  }
}
</script>
