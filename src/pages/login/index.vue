<template>
  <!-- 登录界面 -->
  <div class="login-wrapper">
    <div class="bg-wrapper">
      <div class="left-wrapper">
        <img
          src="../../assets/images/logo.png"
          style="border-radius: 10px; width: 80px; height: 80px"
        />
        <span class="title">健康打卡管理系统</span>
      </div>
      <div class="right-wrapper">
        <el-form :model="loginForm" :rules="loginRules" ref="loginRef">
          <div class="login-title">欢迎登录</div>
          <el-form-item style="margin-top: 20px" prop="email">
            <el-input
              v-model="loginForm.email"
              size="large"
              style="width: 300px"
              placeholder="邮箱"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="password">
            <el-input
              show-password
              v-model="loginForm.password"
              size="large"
              style="width: 300px"
              type="password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button
              type="primary"
              style="width: 100%"
              size="large"
              @click="handleLogin"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-link target="_blank" @click="openResetPassDlg"
              >忘记密码？</el-link
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- 重置密码窗口 -->
      <el-dialog
        :visible.sync="isResetPassDlgVisiable"
        :modal-append-to-body="false"
        width="30%"
      >
        <div class="right-wrapper">
          <el-form
            ref="resetPassRef"
            :model="resetPassForm"
            :rules="loginRules"
          >
            <div class="login-title">重置密码</div>
            <el-form-item style="margin-top: 20px" prop="email">
              <el-input
                v-model="resetPassForm.email"
                size="large"
                style="width: 300px"
                placeholder="邮箱"
                prefix-icon="el-icon-user"
                :disabled="!this.isResetEmailInputWritable"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 20px" prop="password">
              <el-input
                show-password
                v-model="resetPassForm.password"
                size="large"
                style="width: 300px"
                type="password"
                placeholder="密码"
                prefix-icon="el-icon-lock"
                :disabled="!this.isResetPassInputWritable"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 20px" prop="repassword">
              <el-input
                show-password
                v-model="resetPassForm.repassword"
                size="large"
                style="width: 300px"
                type="password"
                placeholder="确认密码"
                prefix-icon="el-icon-lock"
                :disabled="!this.isResetRepassInputWritable"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 30px">
              <el-button
                type="primary"
                style="width: 100%"
                size="large"
                @click="handleResetPass"
                >重置密码</el-button
              >
            </el-form-item>
            <el-form-item style="margin-top: 30px">
              <el-input
                v-model="resetPassForm.active_code"
                size="large"
                style="width: 200px"
                placeholder="验证码"
                prefix-icon="el-icon-lock"
              ></el-input>
              <el-button
                type="primary"
                style="width: 33%"
                size="large"
                @click="handleActiveResetPass"
                >验证</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  login,
  applyRegister,
  activeUser,
  resetPassword,
  activeResetPassword,
} from "../../api/login";
export default {
  name: "login",
  data() {
    // 邮箱校验
    var checkEmail = (rule, value, callback) => {
      const mal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (rule.required && !value) {
        return callback(new Error("邮箱不能为空"));
      }
      if (value) {
        if (!mal.test(value)) {
          callback(new Error("请输入正确邮箱"));
        } else {
          callback();
        }
      }
    };
    var validateTwoPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (value !== this.registerForm.password) {
        if (value !== this.resetPassForm.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      isRegisterDlgVisiable: false,
      isResetPassDlgVisiable: false,
      isRegisterEmailInputWritable: true,
      isRegisterPassInputWritable: true,
      isRegisterRepassInputWritable: true,
      isRegisterNameInputWritable: true,
      isResetEmailInputWritable: true,
      isResetPassInputWritable: true,
      isResetRepassInputWritable: true,
      loginForm: {
        email: "",
        password: "",
      },
      registerForm: {
        email: "",
        password: "",
        repassword: "",
        name: "",
        department: "",
        active_code: "",
      },
      resetPassForm: {
        email: "",
        password: "",
        repassword: "",
        active_code: "",
      },
      loginRules: {
        email: [
          { required: true, validator: checkEmail, trigger: "blur" },
          { max: 50, message: "邮箱过长", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { max: 50, message: "密码过长", trigger: "blur" },
        ],
        repassword: [
          { required: true, validator: validateTwoPass, trigger: "blur" },
        ],
        name: [{ max: 20, message: "昵称过长", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 登录请求
    handleLogin() {
      this.$refs["loginRef"].validate((valid) => {
        if (!valid) {
          return;
        } else {
          let params = {
            email: this.loginForm.email,
            password: this.loginForm.password,
          };
          login(params).then((res) => {
            if (res.code === 200) {
              if (res.data.identity === 0) { // 普通用户
                this.$message.error("您无权登录");
                this.$router.push("/login");
              } else {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("identity", res.data.identity);
                this.$router.push("/dashboard");
              }
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    openRegisterDlg() {
      this.isRegisterDlgVisiable = true;
      this.isRegisterEmailInputWritable = true;
      this.isRegisterPassInputWritable = true;
      this.isRegisterRepassInputWritable = true;
      this.isRegisterNameInputWritable = true;
    },
    openResetPassDlg() {
      this.isResetPassDlgVisiable = true;
      this.isResetEmailInputWritable = true;
      this.isResetPassInputWritable = true;
      this.isResetRepassInputWritable = true;
    },
    handleRegister() {
      this.$refs["registerRef"].validate((valid) => {
        if (valid) {
          let params = {
            email: this.registerForm.email,
          };
          applyRegister(params).then((res) => {
            if (res.code === 200) {
              this.$message.success(
                "注册成功，验证码已发到您的邮箱，请在5分钟内输入验证码激活账号"
              );
              this.isRegisterEmailInputWritable = false;
              this.isRegisterPassInputWritable = false;
              this.isRegisterRepassInputWritable = false;
              this.isRegisterNameInputWritable = false;
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleResetPass() {
      this.$refs["resetPassRef"].validate((valid) => {
        if (valid) {
          let params = {
            email: this.resetPassForm.email,
          };
          resetPassword(params).then((res) => {
            if (res.code === 200) {
              this.$message.success(
                "注册成功，验证码已发到您的邮箱，请在5分钟内输入验证码激活账号"
              );
              this.isResetEmailInputWritable = false;
              this.isResetPassInputWritable = false;
              this.isResetRepassInputWritable = false;
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleActiveUser() {
      let params = {
        email: this.registerForm.email,
        active_code: this.registerForm.active_code,
        password: this.registerForm.password,
        name: this.registerForm.nickname,
        department: this.registerForm.department,
      };
      activeUser(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("验证成功！");
          this.isRegisterDlgVisiable = false;
          return;
        } else {
          this.$message.success(res.msg);
          return;
        }
      });
    },
    handleActiveResetPass() {
      let params = {
        email: this.resetPassForm.email,
        active_code: this.resetPassForm.active_code,
        password: this.resetPassForm.password,
      };
      activeResetPassword(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("验证成功！");
          this.isResetPassDlgVisiable = false;
          return;
        } else {
          this.$message.error(res.msg);
          return;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/login_bg.jpg");
  background-size: cover;
  display: flex;
  flex-direction: row;
  z-index: 1;
  justify-content: center;
  align-items: center;
}

.bg-wrapper {
  width: 70%;
  height: 65%;
  z-index: 9999;
  opacity: 0.95;
  display: flex;
  flex-direction: row;
}

.left-wrapper {
  display: flex;
  flex: 1;
  background-color: #6190e8;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.title {
  color: white;
  font-size: 30px;
  margin-top: 30px;
}

.right-wrapper {
  flex: 1;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.login-title {
  width: 300px;
  text-align: center;
  font-size: 30px;
  margin-bottom: 40px;
}
</style>
