<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="pageObj.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="pageObj.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="pageObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="pageObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fachData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <div style="margin-bottom: 10px">
      <el-button type="danger" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelection">

      <el-table-column type="selection" />

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * every_page_data + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total_data"
      :page-size="every_page_data"
      :page-sizes="[5,10,15]"
      layout="sizes, prev, pager, next, -> , total"
      @current-change="changeCurrentPage"
      @size-change="sizePage"/>

  </div>
</template>

<script>
import req from '@/api/teacher'
export default{
  data() {
    return {
      list: [],
      page: 1, // 第几页
      every_page_data: 5, // 每页显示多少条数据
      pageObj: {}, // 对象查询
      total_data: 0, // 返回的总数居
      MultipleSelection: [] // 批量选中数据
    }
  },

  created() {
    this.fachData()
  },

  methods: {
    fachData() {
      req.pageList(this.page, this.every_page_data, this.pageObj).then(resp => {
        // 这里的resp被拦截器拦截过，返回的是resp.data，所以过滤了一层data。拦截器在utils/requests.js
        this.list = resp.data.datalist
        this.total_data = resp.data.totals
      })
    },

    // 这里的page是内部自己调用的，如上面的then方法，所以上面调用不需要加（），引用函数名就行，类似python的引用函数名，不需要执行函数
    changeCurrentPage(page) {
      console.log('change_page' + page)
      this.page = page // 把当前页赋值给page，在调用一次fachDate实现翻页的效果
      this.fachData()
    },

    // 每页多少条数据
    sizePage(size) {
      this.every_page_data = size
      this.fachData()
    },

    // 清空
    resetData() {
      this.pageObj = {}
      this.fachData()
    },

    // 删除数据
    removeDataById(id) {
      // 询问是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req.removeById(id).then(resp => {
          this.fachData()

          this.$message({
            message: resp.message,
            type: 'success'
          })
        })
      }).catch((err) => {
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },

    handleSelection(selection) {
      this.MultipleSelection = selection
    },

    batchRemove(ids) {
      if (this.MultipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的记录'
        })
        return
      }

      // 询问是否删除
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = []
        this.MultipleSelection.forEach(item => {
          idList.push(item.id)
        })
        return req.batchRemoveByIds(idList)
      }).then(resp => {
        this.fachData()
        this.$message({
          message: resp.message,
          type: 'success'
        })
      }).catch((err) => {
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    }

  }

}

</script>
