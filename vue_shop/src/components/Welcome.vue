<template>
  <div>
    <span>这是Welcome组件</span><br />
    <el-button @click="goToHello">跳转到Hello组件</el-button>
    <el-button @click="goToSecond">跳转到Second组件</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goToHello() {
      this.$router.push({
        name: 'Hello',
        params: {
          name: 'world',
          age: 11,
        },
      })
    },

    goToSecond() {
      this.$router.push({
        path: '/second',
        query: {
          name: '第二个',
          age: 22,
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>