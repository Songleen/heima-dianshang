<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告文案区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false"> </el-alert>

      <!-- 级联选择区域 -->
      <div class="cascader">
        <span>选择商品分类：</span>
        <el-cascader expand-trigger="hover" :props="cascaderProps" :options="cateList" v-model="selectedKeys" @change="handleChange" style="width: 250px" clearable> </el-cascader>
      </div>

      <!-- tabs标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddParamDialog">添加参数</el-button>
          <!-- 动态参数的表格 -->
          <el-table :data="manyTableData" stripe border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddParamDialog">添加属性</el-button>
          <!-- 静态属性的表格 -->
          <el-table :data="onlyTableData" stripe border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数弹框区域 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addParamDialogVisible" width="50%" @close="closeAddParamDialog">
      <!-- 动态参数表单 -->
      <el-form ref="dynamicFormRef" :model="dynamicParamForm" label-width="80px" :rules="dynamicFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="dynamicParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数弹框区域 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editParamDialogVisible" width="50%" @close="closeEditParamDialog">
      <!-- 动态参数表单 -->
      <el-form ref="editDynamicFormRef" :model="editParamForm" label-width="80px" :rules="dynamicFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表，包括三级的
      cateList: [],
      // 绑定给级联选择器的id
      selectedKeys: [],
      // 级联选择器的自定义属性
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加参数弹框的显示和隐藏
      addParamDialogVisible: false,
      //   控制修改参数弹框的显示和隐藏
      editParamDialogVisible: false,
      //   动态参数表单对象
      dynamicParamForm: {},
      //   修改参数表单对象
      editParamForm: {},
      //   动态参数表单数据验证规则
      dynamicFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.cateList = res.data
    },
    // 级联选择框选中项变化，会触发这个函数，
    handleChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getParamsData()
    },
    // 页签的单击事件的处理函数
    handleTabClick() {
      // 这里其实是先改变了activeName的值，再调用的这个函数
      if (this.selectedKeys.length === 0) {
        return
      }
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName },
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加一个控制输入框显示的布尔值，和一个双向数据绑定的变量
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },

    // 添加参数对话框
    showAddParamDialog() {
      this.addParamDialogVisible = true
    },
    // 添加参数弹框关闭触发的事件
    closeAddParamDialog() {
      this.$refs.dynamicFormRef.resetFields()
    },
    // 修改参数弹框关闭触发的事件
    closeEditParamDialog() {
      this.$refs.editDynamicFormRef.resetFields()
    },
    // 点击确定，添加参数
    addParams() {
      // 先进行表单预验证
      this.$refs.dynamicFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.dynamicParamForm.attr_name,
          attr_sel: this.activeName,
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.getParamsData()
        this.addParamDialogVisible = false
      })
    },
    // 修改参数的弹框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
        params: { attr_sel: this.activeName },
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editParamForm = res.data
      this.editParamDialogVisible = true
    },
    // 点击确定，修改参数信息
    editParams() {
      // 预验证
      this.$refs.editDynamicFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamForm.attr_id}`, {
          attr_name: this.editParamForm.attr_name,
          attr_sel: this.activeName,
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editParamDialogVisible = false
      })
    },
    // 删除参数
    removeParams(attr_id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 调用删除的api
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          if (res.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: res.meta.msg,
            })
          }
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getParamsData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 标签中的输入框的键盘抬起和失去焦点触发的事件
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 输入的值有效，需要进一步处理
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 将对attr_vals的操作保存到数据库
    async saveAttrVals(row) {
      // 需要发送请求，保存这次操作
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' '),
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    // 标签中的按钮单击触发事件，显示输入框
    showInput(row) {
      row.inputVisible = true
      // $nextTick函数的作用：当页面上的元素被重新渲染之后，才会执行回调函数中的代码，
      // 就是为了让页面上的元素渲染出来之后，再执行获取焦点的操作
      this.$nextTick((_) => {
        // 让文本框自动获取焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },

  computed: {
    // 如果按钮需要被禁用，返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 级联下拉选中的三级分类id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 添加参数的表单标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>

<style lang="less" scoped>
.cascader {
  margin: 15px 0px;
}
.el-cascader {
  margin-left: 15px;
}
.el-tag {
  margin: 0 5px;
}
.input-new-tag {
  width: 100px;
}
</style>