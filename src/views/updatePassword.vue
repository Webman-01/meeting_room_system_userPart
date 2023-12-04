<template>
  <div class="login-container">
    <a-card
      style="
        width: 450px;
        height: 500px;
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
        <!-- eslint-disable vue/no-v-model-argument -->
        <a-form-item
          label="用户名"
          name="username"
          v-model:value="formState.username"
          :rules="[{ required: false, message: '请输入用户名' }]"
        >
          <a-input v-model:value="formState.username"
        /></a-form-item>
        <a-form-item
          label="邮箱"
          name="email"
          v-model:value="formState.email"
          :rules="[
            { required: false, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱' },
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <div class="captcha">
          <a-form-item
            :label-col="{ span: 0 }"
            :wrapper-col="{ span: 10 }"
            label="验证码"
            name="captcha"
            v-model:value="formState.captcha"
            :rules="[{ required: false, message: '请输入验证码' }]"
          >
            <a-input v-model:value="formState.captcha" />
          </a-form-item>
          <a-button type="primary" @click="sendCaptcha">发送验证码</a-button>
        </div>

        <a-form-item
          label="新密码"
          name="password"
          :rules="[
            {
              required: false,
              message: '请输入6-12位且含有字母数字的密码',
            },
          ]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="请输入6-12位且含有字母数字的密码"
          />
        </a-form-item>

        <a-form-item
          label="确认密码"
          name="confirmPassword"
          v-model:value="formState.confirmPassword"
          :rules="[{ required: false, message: '请再次输入密码' }]"
        >
          <a-input-password v-model:value="formState.confirmPassword" />
        </a-form-item>

        <a-form-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
          <a-button
            type="primary"
            html-type="submit"
            style="width: 150px; margin-top: 30px"
            >修改</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import {
  updatePassword,
  updatePasswordCaptcha,
} from ".././utils/interfaces";
import { message } from "ant-design-vue";
import type { UpdatePassword } from "../types/user.types";
import { useRouter } from "vue-router";

let $router = useRouter();
const formState = reactive<UpdatePassword>({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  captcha: "",
});

//提交时回调
const onFinish = async (values: UpdatePassword) => {
  if (values.password != values.confirmPassword) {
    return message.error("两次输入的密码不一样");
  }

  const res = await updatePassword(values);
  console.log(res);
  const { message: msg, data } = res.data;
  if (res.status == 200 || res.status == 201) {
    message.success("修改密码成功");
    //路由跳转
    $router.push("/login");
  } else {
    message.error(data || "系统繁忙,请稍后再试");
  }
};
//发送验证码
async function sendCaptcha() {
  const res = await updatePasswordCaptcha(formState.email);
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
