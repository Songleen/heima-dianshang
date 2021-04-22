<template>
  <div>这是hello组件</div>
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
    this.params.name = this.$route.params.name, 
    this.params.age = this.$route.params.age, 
    console.log(this.params)
  },
}
</script>

<style lang="less" scoped>
</style>