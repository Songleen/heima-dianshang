<template>
  <div>Second组件</div>
</template>

<script>
export default {
  data() {
    return {
      params: {
        name: '',
        age: '',
      },
    }
  },
  methods: {},
  created() {
    this.params.name = this.$route.query.name, 
    this.params.age = this.$route.query.age, 
    console.log(this.params)
  },
}
</script>

<style lang="less" scoped>
</style>