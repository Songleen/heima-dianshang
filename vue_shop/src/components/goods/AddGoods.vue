<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示信息区域 -->
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false"
    >
    </el-alert>
    <!-- 步骤条区域 -->
    <el-steps :active="activeNum - 0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!-- tabs标签页区域 -->
    <el-form
      ref="goodsFormRef"
      :model="goodsForm"
      label-width="80px"
      label-position="top"
      :rules="goodsFormRules"
    >
      <el-tabs
        v-model="activeNum"
        @tab-click="handleTabClick"
        :tab-position="'left'"
        :before-leave="beforeTabLeave"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input
              v-model="goodsForm.goods_price"
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input
              v-model="goodsForm.goods_weight"
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input
              v-model="goodsForm.goods_number"
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <!-- 商品类别的级联选择器 -->
            <el-cascader
              expand-trigger="hover"
              :props="cascaderProps"
              :options="cateList"
              v-model="goodsForm.goods_cat"
              @change="handleCascaderChange"
              style="width: 250px"
            >
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item
            :label="item.attr_name"
            v-for="item in manyTableData"
            :key="item.attr_id"
          >
            <!-- 多选框组区域 -->
            <el-checkbox-group
              v-model="item.attr_vals"
              @change="boxGroupChanged"
            >
              <el-checkbox
                v-for="(item2, i) in item.attr_vals"
                :key="i"
                :label="item2"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            :label="item.attr_name"
            v-for="item in onlyTableData"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!-- 图片上传区域 -->
          <!-- action表示图片要上传到的后台API地址 -->
          <el-upload
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器组件 -->
          <quill-editor v-model="goodsForm.goods_introduce"></quill-editor>

          <!-- 添加商品的按钮 -->
          <el-button class="btnAdd" type="primary" @click="addGoods"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 图片预览区域 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
// 官方推荐用_来命名，就像jquery用$一样
import _ from "lodash";
export default {
  data() {
    return {
      // 步骤条当前激活步骤索引
      activeNum: "0",
      goodsForm: {
        goods_name: "",
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: "",
        // 属性数组
        attrs: [],
      },
      // 商品类别的数组
      cateList: [],
      // 商品参数的数组
      manyTableData: [],
      // 商品属性列表
      onlyTableData: [],
      // 级联选择器选中的keys
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 上传图片的URL
      uploadURL: "http://localhost:8888/api/private/v1/upload",
      // 为上传组件设置 token
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //   图片的预览路径
      previewPath: "",
      // 图片预览框的显示和隐藏
      previewVisible: false,
      // 表单的验证规则
      goodsFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.goodsForm.goods_cat.length === 3) {
        return this.goodsForm.goods_cat[2];
      }
      return null;
    },
  },
  methods: {
    // tabs标签页的点击事件
    handleTabClick() {},
    // 商品分类的列表获取
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 3 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }
      this.cateList = res.data;
    },
    // 级联选择器的选中事件
    handleCascaderChange() {},
    // 标签发生跳转之前触发
    beforeTabLeave(activeName, oldActiveName) {
      // 阻止标签页切换
      if (oldActiveName === "0" && this.goodsForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类！");
        return false;
      }
      // 如果跳转到商品参数，则获取商品参数列表
      if (activeName === "1") {
        this.getParamsData();
      }
      // 如果跳转到商品属性，则获取商品属性列表
      if (activeName === "2") {
        this.getPropertyData();
      }
    },
    // 获取参数的列表数据
    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: "many" },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      });
      this.manyTableData = res.data;
    },
    // 获取商品属性列表
    async getPropertyData() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: "only" },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.onlyTableData = res.data;
    },
    // 复选框组选中的值改变时触发的函数
    boxGroupChanged() {},
    // 图片预览的方法
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1、获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2、从pics数组中，找到这个图片对应的索引值
      const i = this.goodsForm.pics.findIndex((x) => x.pic === filePath);
      // 3、调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.goodsForm.pics.splice(i, 1);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path,
      };
      // 将图片信息对象，push到pics数组中
      this.goodsForm.pics.push(picInfo);
    },
    // 添加商品
    addGoods() {
      this.$refs.goodsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！");
        }
        // 执行添加的业务逻辑
        // 先深拷贝
        const form = _.cloneDeep(this.goodsForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.goodsForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.goodsForm.attrs.push(newInfo);
        });
        form.attrs = this.goodsForm.attrs;
        
        // 发起添加商品的请求
        const{data:res} = await this.$http.post('goods',form)
        if(res.meta.status !== 201){
            return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        // 跳转到商品列表页面
        this.$router.push('/goods')
      })
    }
  }
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
  font-size: 10x;
}
// 步骤条的文本样式
.el-step__title {
  font-size: 13px;
}

.el-checkbox {
  // 强制覆盖复选框组的样式
  margin: 0 10px !important;
}

.btnAdd {
  margin-top: 15px;
}
</style>