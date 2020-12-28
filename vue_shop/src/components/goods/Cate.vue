<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 树形列表展示区域,这个名字是注册时自定义的 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 步骤2：定义具名插槽模板。这一列是是否有效列 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>

        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success" size="mini"
            >二级</el-tag
          >
          <el-tag v-if="scope.row.cat_level === 2" type="warning" size="mini"
            >三级</el-tag
          >
        </template>

        <!-- 操作列 -->
        <template slot="operator">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        ref="cateFormRef"
        :model="addCateForm"
        :rules="cateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源,props用来指定配置对象,v-model必须绑定一个数组 -->
          <el-cascader
            expandTrigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //   控制添加分类对话框的显示和隐藏
      addCateDialogVisible: false,
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 查询到的总数量
      total: 0,

      // 添加分类表单项
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0,
      },

      // 父级分类的列表
      parentCateList: [],
      // 级联选择器选中的父节点id
      selectedKeys: [],
      // props对应的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      // 添加分类的表单验证项
      cateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },

      //   为树形表单指定列的定义
      columns: [
        // 每一个对象就是一列，以下是第一列
        {
          label: "分类名称", //列标题
          prop: "cat_name", // 列内容
        },
        // 第二列
        {
          label: "是否有效", //列标题
          //   表示当前列定义为模板列
          type: "template",
          //  步骤1：表示当前这列使用的模板名称
          template: "isok",
        },
        // 第三列 排序列
        {
          label: "排序", //列标题
          //   表示当前列定义为模板列
          type: "template",
          //  步骤1：表示当前这列使用的模板名称
          template: "order",
        },
        // 第四列 操作列
        {
          label: "操作", //列标题
          //   表示当前列定义为模板列
          type: "template",
          //  步骤1：表示当前这列使用的模板名称
          template: "operator",
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品数据失败！");
      }
      //   把数值列表赋值给cateList
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 分页数量改变时触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 当前页改变时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },

    // 控制添加分类对话框的显示和隐藏
    showAddCateDialog() {
      // 先获取父级分类的列表
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },

    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }
      this.parentCateList = res.data;
    },

    // 级联选择器选择项发生改变触发这个函数
    parentCateChanged() {
      // 设置新输入的分类名称的分类级别
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    // 添加分类的对话框关闭事件，清空表单
    addCateDialogClosed() {
      this.$refs.cateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },

    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.cateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status != 201) {
          return this.$message.error("添加分类失败！");
        }

        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>