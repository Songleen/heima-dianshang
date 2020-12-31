<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索框和添加商品按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="searchVal"
            clearable
            @clear="clearInputVal"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoodList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="180"
        ></el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | converTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 总数量
      total: 0,
      // 输入框中的值
      searchVal: "",
      // 商品列表数据
      goodList: [],
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    //   根据分页获取对应的商品列表
    async getGoodList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.goodList = res.data.goods;
      this.total = res.data.total;
    },
    // 分页数量改变触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodList();
    },
    // 当前页码改变触发
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent;
      this.getGoodList();
    },
    // 点击搜索按钮触发
    searchGoodList() {
      this.queryInfo.query = this.searchVal.trim();
      this.getGoodList();
    },
    //清空搜索框内容触发的事件
    clearInputVal() {
      this.queryInfo.query = "";
      this.getGoodList();
    },
    // 根据id删除该商品
    removeById(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`);
          if (res.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: res.meta.msg,
            });
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getGoodList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 跳转到添加商品的组件
    goAddPage(){
        this.$router.push('/add')
    }
  },
};
</script>

<style lang="less" scoped>
</style>