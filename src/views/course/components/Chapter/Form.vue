<template>
  <!-- 添加和修改章节表单 -->
  <el-dialog :visible="dialogVisible" title="添加章节" @close="close()">
    <el-form :model="chapter" label-width="120px">
      <el-form-item label="章节标题">
        <el-input v-model="chapter.title"/>
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input-number v-model="chapter.sort" :min="0"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import courseApi from '@/api/chapter'

export default {

  data() {
    return {
      dialogVisible: false,
      chapter: {
        sort: 0
      }
    }
  },

  methods: {
    open(chapterId) {
      this.dialogVisible = true
      if (chapterId) {
        // 如果有值,说明是从编页面进去的,要回显数据
        courseApi.getById(chapterId).then(resp => {
          this.chapter = resp.data.item
        })
      }
    },

    close() {
      this.dialogVisible = false
      // 清空表单
      this.chapter = {
        sort: 0
      }
    },

    saveOrUpdate() {
      if (!this.chapter.id) {
        console.log('save')
        this.save()
      } else {
        this.update()
        console.log('update')
      }
    },

    save() {
      this.chapter.courseId = this.$parent.$parent.courseId
      courseApi.saveChapter(this.chapter).then(resp => {
        this.$message.success(resp.message)
        this.close()
        this.$parent.fetchNodeList()
      })
    },

    update() {
      courseApi.updateById(this.chapter).then(resp => {
        this.$message.success(resp.message)
        this.close()
        this.$parent.fetchNodeList()
      })
    }
  }
}
</script>
