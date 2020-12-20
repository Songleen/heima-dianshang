<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登陆表单区域,注意这里没有用div包裹 -->
      <el-form
        ref="loginFormRef"
        :model="form"
        label-width="0px"
        class="login_form"
        :rules="rules"
      >
        <!-- 名称 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="form.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登陆表单的数据绑定对象
      form: {
        username: "zs",
        password: "123",
      },
      //   这是表单验证规则对象
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 紧挨着await的方法要是一个async方法
      this.$refs.loginFormRef.validate(async (valid, field) => {
        if (!valid) return;
        // 未被await修饰之前，返回的是一个Promise，被修饰之后，返回的就成了有axios封装好的六个属性的具体响应对象。
        // 其中data才是服务器返回的真实数据，所以用解构赋值出来,并重命名为res
        const { data: res } = await this.$http.post("login", this.form);
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message({
            showClose: true,
            duration:1000,
            message: "登陆出错",
            type: "error",
          });
          
        this.$message({
          showClose: true,
          message: "登陆成功",
          duration:1000,
          type: "success",
        });
        // 1、登陆成功之后的token，保存到客户端的sessionStorage中，项目中其它接口需要在登陆之后才能访问。
        // 2、token只应该在当前网页打开期间生效，所以将token保存在sessionStorage中，而不是localStorage(持久化的)
        window.sessionStorage.setItem('token',res.data.token);
        // 3、通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home');
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>
