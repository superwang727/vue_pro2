<template>
  <div class="app-container">

    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"/>

    <el-tree
      ref="tree"
      :data="subjectDataList"
      :props="defaultProps"
      :filter-node-method="filterNode"
    />
  </div>
</template>

<script>
import subjectApi from '@/api/subject'

export default{

  data() {
    return {
      filterText: '', // 过滤文本
      subjectDataList: [], // 后端返回的数据模型

      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  created() {
    this.fetchSubjectList()
  },

  methods: {
    fetchSubjectList() {
      subjectApi.getNestedList().then(resp => {
        this.subjectDataList = resp.data.datalist
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    }
  }

}

</script>
