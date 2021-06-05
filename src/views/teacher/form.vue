<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import req from '@/api/teacher'
export default {
  data() {
    return {
      teacher: {},
      saveBtnDisabled: false // 防止重复提交
    }
  },

  created() {
    if (this.$route.params.id) {
      this.findDataById(this.$route.params.id)
    }
  },

  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true
      // 如果有id表示编辑,没有id就是新增
      if (!this.teacher.id) {
        this.saveDate()
      } else {
        this.UpdataDateById()
      }
    },

    saveDate() {
      req.saveTeacher(this.teacher).then(resp => {
        this.$message({
          message: resp.message,
          type: 'success'
        })

        this.$router.push({ path: '/edu/teacher' })
      })
    },

    // 根据id查询数据
    findDataById(id) {
      req.findTeacherById(id).then(resp => {
        this.teacher = resp.data.datalist
      })
    },

    // 根据id更新数据
    UpdataDateById() {
      req.updateTeacherById(this.teacher).then(resp => {
        this.$message({
          message: resp.message,
          type: 'success'
        })

        this.$router.push({ path: '/edu/teacher' })
      })
    }

  }
}
</script>
