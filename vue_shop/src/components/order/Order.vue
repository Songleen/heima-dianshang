<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 带搜索的输入框 -->
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="clearInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchValue"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | converTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip
              effect="light"
              placement="bottom-start"
              :visible-arrow="false"
            >
              <div class="tipInfo" slot="content">编辑</div>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editAddress"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="light"
              placement="bottom-start"
              :visible-arrow="false"
            >
              <div class="tipInfo" slot="content">物流信息</div>
              <el-button
                size="mini"
                type="success"
                icon="el-icon-location"
              ></el-button>
            </el-tooltip>
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
    <!-- 修改地址的弹框区域 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="100px"
        :rules="editFormRules"
      >
        <el-form-item label="省市区/县" prop="name">
          <el-cascader
            expand-trigger="hover"
            :options="cityData"
            v-model="selectedAddress"
            @change="handleAddressChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度的弹框区域 -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressDialogVisible"
      width="50%"
    >aaaa
      <!-- 时间线区域 -->
      <!-- <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline> -->
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      editAddressDialogVisible: false,
      progressDialogVisible: false,
      editForm: {
        name: "",
        address: "",
      },
      editFormRules: {
        name: [{ required: true, message: "请选择省市县", trigger: "blur" }],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur",
          },
        ],
      },

      // cityData:cityData
      // 属性名和值重名的话，可以简写成下面的形式
      cityData,
      selectedAddress: [],
      progressInfo: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！');
      }
      console.log(res.data.goods);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听每页展示数量改变的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 监听当前展示第几页的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 搜索框的搜索事件
    searchValue() {
      const val = this.queryInfo.query.trim();
      if (val !== "") {
        this.getOrderList();
      }
    },
    // 输入框的清空事件
    clearInput() {
      this.getOrderList();
    },
    editAddress() {
      this.editAddressDialogVisible = true;
    },
    // 级联选择器选中值的改变
    handleAddressChange() {
      console.log(this.selectedAddress);
    },
    // 修改地址的弹框关闭
    dialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 物流信息按钮单击触发的事件
    async showProgressBox() {
      // 后台提示没有这个物流单号，暂时就不做这个了
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.progressInfo = res.data;
      console.log(this.progressInfo);
      this.progressDialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.tipInfo {
  line-height: 0.2;
}
.el-cascader {
  width: 100%;
}
</style>