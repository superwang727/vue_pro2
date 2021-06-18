<template>

  <div class="app-container">

    <!--查询表单 TODO-->

    <!-- 表格 TODO -->

    <!-- 分页 TODO -->
  </div>

</template>

<script>
import courseApi from '@/api/course'

export default {
  data() {
    return {
      list: [],
      page: 1, // 第几页
      every_page_data: 5, // 每页显示多少条数据
      pageObj: {}, // 对象查询
      total_data: 0, // 返回的总数
      MultipleSelection: [] // 批量选中数据
    }
  },

  created() {
    this.fetchCrousePageData()
  },

  methods: {
    fetchCrousePageData() {
      courseApi.queryCoursePageList(this.page, this.every_page_data, this.pageObj).then(resp => {
        this.list = resp.data.datalist
        this.total_data = resp.data.totals
        console.log(resp.data)
      })
    }
  }
}
</script>
