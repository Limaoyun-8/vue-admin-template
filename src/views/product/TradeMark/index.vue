<template>
  <div>
    <!-- eslint-disable -->
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
    <!-- 表格组件 -->
    <el-table style="width:100%;margin:10px auto" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{row, $index}">
          <img :src="row.logoUrl" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{row, $index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <el-pagination
      style="textAlign:center"
      :current-page="currentPage"
      :total="total"
      :page-size="pageSize"
      :pager-count="5"
      :page-sizes="[3, 5, 10]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->, sizes, total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog :title="tmForm.hasOwnProperty('id') ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- model属性用于收集表单数据，将来做表单验证时也需要用到它。 -->
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传图片组件 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    // 自定义校验规则
    /* const validateLogoUrl = (rule, value, callback) => {
      if (!value) callback(new Error('请选择logo上传'))
      else callback()
    } */
    return {
      currentPage: 1,
      pageSize: 5,
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏控制属性
      dialogFormVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则
      rules: {
        tmName: [ // 品牌名称的验证规则
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ],
        logoUrl: [ // 品牌logo的验证规则
          { required: true, message: '请选择品牌logo图片' }
          // { validator: validateLogoUrl, trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    /**
     * 删除品牌
     * @param row 当前操作的那条数据
     */
    deleteTradeMark(row) {
      this.$confirm(
        `你确定删除${row.tmName}吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        const result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message.success('删除成功！')
          this.getPageList()
        } else this.$message.error(result.message)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    /**
     * 新增或修改品牌
     */
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false
          const result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            /* eslint-disable */
            this.$message({
              message: this.tmForm.hasOwnProperty('id') ? '更新品牌成功' : '添加品牌成功',
              type: 'success'
            })
            this.getPageList()
          }
        }
      })
    },
    /**
     * 图片上传成功的回调函数
     * @param res 上传成功后服务器返回给前端的数据
     * @param file 上传成功后服务器返回给前端的数据
     */
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.tmForm.logoUrl = URL.createObjectURL(file.raw)
      } else this.$message.error(res.message)
    },
    /**
     * 图片上传之前对图片进行格式合法性校验
     */
    beforeAvatarUpload(file) {
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
    /**
     * 修改某一个品牌
     * @param row 当前操作的那条数据
     */
    updateTradeMark(row) {
      this.dialogFormVisible = true
      // 浅拷贝
      this.tmForm = { ...row }
    },
    /**
     * 添加品牌
     */
    showDialog() {
      // 展示Dialog对话框
      this.dialogFormVisible = true
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    /**
     * 获取品牌列表数据
     */
    async getPageList() {
      const result = await this.$API.tradeMark.reqTradeMark(this.currentPage, this.pageSize)
      if (result.code === 200) {
        const { data } = result
        const { records } = data
        this.currentPage = data.current
        this.pageSize = data.size
        this.total = data.total
        this.list = records
      } else this.$message.error(result.message)
    },
    /**
     * 当前页码发生变化时的回调函数
     * @param currentPage 当前页码
     */
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getPageList()
    },
    /**
     * 当分页器一页所展示数据条数变化时的回调函数
     * @param pageSize 一页所展示的数据条数
     */
    handleSizeChange(pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
      this.getPageList()
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
