<template>
  <div>
    <el-card class="box-card">
      <h2>登录</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="70px"
        class="login-from"
      >
        <el-form-item label="用户号" prop="userid">
          <el-input v-model="ruleForm.userid"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          v-loading="loading"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <router-link to="/MyRegister">
          <el-button style="margin-left: 10px">注册</el-button>
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        userid: "",
        password: "",
      },
      rules: {
        userid: [
          { required: true, message: "用户号不能为空！", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空！", trigger: "blur" },
        ],
      },
      loading: false, // 是否显示加载动画
    };
  },
  methods: {
    submitForm(formName) {
      // 验证表单中的账号密码是否有效，因为在上面rules中定义为了必填 required: true
      this.$refs[formName].validate((valid) => {
      // 点击登录后，让登录按钮开始转圈圈（展示加载动画）
      this.loading = true;
      // 如果经过校验，账号密码都不为空，则发送请求到后端登录接口
      if (valid) {
        let _this = this;
        // 使用 axios 将登录信息发送到后端
        this.axios({
          url: "/user/login", // 请求地址
          method: "post", // 请求方法
          headers: {
            // 请求头
            "Content-Type": "application/json",
          },
          params: {
            // 请求参数
            userid: _this.ruleForm.userid,
            password: _this.ruleForm.password,
          },
        })
          .then((res) => {
            if (res.data.code === "0") {
              // 当响应的编码为 0 时，说明登录成功
              const token = res.headers['token']; // 获取响应头中的Token值
              console.log(token);
              this.$store.state.token = token;
              // 将用户信息存储到sessionStorage中
              sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
              // 发送第二个请求
              return this.axios({
                url: "/user/ByID", // 请求地址
                method: "post", // 请求方法
                headers: {
                  // 请求头
                  "Content-Type": "application/json",
                },
                params: {
                  // 请求参数
                  userid: _this.ruleForm.userid,
                },
              });
            } else {
              // 当响应的编码不为 0 时，说明登录失败
              // 显示后端响应的失败信息
              this.$message({
                message: res.data.msg,
                type: "warning",
              });
              // 不管响应成功还是失败，收到后端响应的消息后就不再让登录按钮显示加载动画了
              _this.loading = false;
              console.log(res);
            }
          })
          .then((res) => {
            if (res && res.data) {
              console.log(res.data)
              // 第二个请求的响应数据存在，进行存储操作
              this.$store.state.UserType = res.data.usertype;
              this.$store.state.userid = res.data.userid;

              if(this.$store.state.UserType=='管理员'){
                console.log(this.$store.state.UserType)
                // 跳转页面到首页
                this.$router.push("/adminHome");
              }else if(this.$store.state.UserType=='车队队长'){
                console.log(this.$store.state.UserType)
                // 跳转页面到首页
                this.$router.push("/MyExamine");
              }else if(this.$store.state.UserType=='员工'||this.$store.state.UserType=='领导'){
                console.log(this.$store.state.UserType)
                // 跳转页面到首页
                this.$router.push("/UserHome");
              }else if(this.$store.state.UserType=='司机'){
                console.log(this.$store.state.UserType)
                // 跳转页面到首页
                this.$router.push("/DriverList");
              }
              // 显示后端响应的成功信息
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            }
          })
          .catch((error) => {
            // 处理错误
            console.error(error);
            this.loading = false;
          });
        } else {
          // 如果账号或密码有一个没填，就直接提示必填，不向后端请求
          console.log("error submit!!");
          this.loading = false;
          return false;
        }
    });
  },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
/* 设置登录面板居中，宽度为400px */
.box-card {
  margin: auto auto;
  width: 400px;
}
/* 设置登录面板中的表单居中 */
.login-from {
  margin: auto auto;
}
</style>