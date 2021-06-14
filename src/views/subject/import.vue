
<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="defaultExcelTemplate">点击下载模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="'http://localhost:8110/admin/edu/subject/import'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :disabled="importBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {

  data() {
    return {
      defaultExcelTemplate: process.env.OSS_PATH + '/excel/在线教育模板.xlsx',
      importBtnDisabled: false // 按钮是否禁用,
    }
  },

  methods: {

    // 上传方法
    submitUpload() {
      this.importBtnDisabled = true // 导入按钮禁用
      this.$refs.upload.submit() // 执行手动上传方法
    },

    // 上传文件超过数量限制
    handleExceed() {
      this.$message.warning('当前只能选择1个文件')
    },

    // 上传成功回调
    fileUploadSuccess(res) {
      this.importBtnDisabled = true // 导入按钮禁用
      this.$message.success(res.message)
      this.$refs.upload.clearFiles() // 清空文件列表
    },

    // 失败回调
    fileUploadError(err) {
      this.importBtnDisabled = true // 导入按钮禁用
      this.$message.success(err.message)
    }

  }

}
</script>
