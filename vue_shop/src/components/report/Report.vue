<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2、为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1、导入echarts
import echarts from "echarts";
import _ from "lodash";

export default {
  data() {
    return {
      // 需要被合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  created() {},

  // 只要执行到mounted函数，表示页面中Dom元素已经被初始化完毕了
  async mounted() {
    // 3、基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 获取到服务器的数据
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败！");
    }

    // 服务器返回的数据是不完整的，页面实现的折现图没有鼠标跟随效果
    // 4、准备数据和配置项,使用lodash将两个对象合并成一个
    const result = _.merge(res.data, this.options);

    // 5、使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>