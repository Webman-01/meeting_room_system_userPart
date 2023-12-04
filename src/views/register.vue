<template>
  <div class="login-container">
    <a-card
      style="
        width: 450px;
        height: 600px;
        border-radius: 20px;
        box-shadow: 0px 10px 25px #cac6c6;
        padding-right: 20px;
      "
      :hoverable="true"
    >
      <h1 class="title">会议室预订系统</h1>
      <a-form
        :model="formState"
        :colon="false"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: usernameFlag, message: '请输入用户名' }]"
        >
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="formState.username" @change="changeUsername(formState.username)"/>
        </a-form-item>
        <a-form-item
          label="昵称"
          name="nickName"
          :rules="[{ required: nickNameFlag, message: '请输入昵称' }]"
        >
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="formState.nickName" @change="changeNickName(formState.nickName)"/>
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: passwordFlag, message: '请输入6-12位且含有字母数字的密码' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="请输入6-12位且含有字母数字的密码" @change="changePassword(formState.password)"/>
        </a-form-item>

        <a-form-item
          label="确认密码"
          name="confirmPassword"
          v-model:value="formState.confirmPassword"
          :rules="[{ required: confirmPasswordFlag, message: '请再次输入密码' }]"
        >
          <a-input-password v-model:value="formState.confirmPassword" @change="changeConfirmPassword(formState.confirmPassword)"/>
        </a-form-item>
        <a-form-item
          label="邮箱"
          name="email"
          v-model:value="formState.email"
          :rules="[
            { required: emailFlag, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱' },
          ]"
        >
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="formState.email" @change="changeEmail(formState.email)"/>
        </a-form-item>

        <div class="captcha">
          <a-form-item
            :label-col="{ span: 0 }"
            :wrapper-col="{ span: 10 }"
            label="验证码"
            name="captcha"
            v-model:value="formState.captcha"
            :rules="[{ required: captchaFlag, message: '请输入验证码' }]"
          >
            <!-- eslint-disable vue/no-v-model-argument -->
            <a-input v-model:value="formState.captcha" @change="changeCaptcha(formState.captcha)"/>
          </a-form-item>
          <a-button type="primary" @click="sendCaptcha">发送验证码</a-button>
        </div>

        <a-form-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
          <div class="link">已有账号? 请 <router-link to="/login">登录</router-link></div>
        </a-form-item>

        <a-form-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
          <a-button type="primary" html-type="submit" style="width: 100px"
            >注册</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { register, registerCaptcha } from ".././utils/interfaces";
import { message } from "ant-design-vue";
import type { RegisterUser } from "../types/user.types";
import { useRouter } from "vue-router";

let $router = useRouter()
const formState = reactive<RegisterUser>({
  username: "",
  password: "",
  nickName: "",
  confirmPassword: "",
  email: "",
  captcha: "",
});

//当有输入内容时require为false=>小红点消失
const usernameFlag= ref<boolean>(true)
const passwordFlag= ref<boolean>(true)
const nickNameFlag = ref<boolean>(true)
const confirmPasswordFlag= ref<boolean>(true)
const emailFlag= ref<boolean>(true)
const captchaFlag= ref<boolean>(true)
const changeUsername = (requireString:string)=>{
  usernameFlag.value = requireString.trim() === '';
}
const changePassword = (requireString:string)=>{
  passwordFlag.value = requireString.trim() === '';
}
const changeNickName = (requireString:string)=>{
  nickNameFlag.value = requireString.trim() === '';
}
const changeConfirmPassword = (requireString:string)=>{
  confirmPasswordFlag.value = requireString.trim() === '';
}
const changeEmail = (requireString:string)=>{
  emailFlag.value = requireString.trim() === '';
}
const changeCaptcha = (requireString:string)=>{
  captchaFlag.value = requireString.trim() === '';
}


//提交时回调
const onFinish = async (values: RegisterUser) => {
  if (values.password != values.confirmPassword) {
    return message.error("两次输入的密码不一样");
  }
  
  const res = await register(values);
  console.log(res);
  if (res.status == 200 || res.status == 201) {
    message.success("注册成功");
    //路由跳转
    $router.push('/login')
  } else {
    message.error(res.data.data || "系统繁忙,请稍后再试");
  }
};
//发送验证码
async function sendCaptcha() {
  const res = await registerCaptcha(formState.email);
  console.log(res);
  if (res.status == 200 || res.status == 201) {
    message.success(res.data.data);
  } else {
    message.error("系统繁忙,请稍后再试");
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 400px;
  margin: 50px auto 0 auto;
  text-align: center;
  .link {
    display: flex;
    justify-content: flex-end;
  }
  .captcha {
    display: flex;
    justify-content: flex-end;
  }
}
.title {
  margin-left: 10px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: black;
  margin-bottom: 30px;
}
</style>
