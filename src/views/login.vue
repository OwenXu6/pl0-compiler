<script setup>
import sha256 from 'crypto-js/sha256'
import { useBaseUrl } from "@/store/baseUrl";
import axios from "axios";
import { useUserInfo } from "@/store/userInfo";
import { ref } from "vue";
import router from '../router';

const baseUrl = useBaseUrl().baseUrl
const userInfo = useUserInfo()
const user_name = ref("")
const user_password = ref("")
const login = () => {
  const LoginModel = {
    "userId": user_name.value,
    "password": user_password.value
  }
  axios.post(baseUrl + '/api/Authenticate/Login', LoginModel)
    .then(function (response) {
      userInfo.updateToken(response.data.token)
      userInfo.updateExpireTime(Date(response.data.expiration))
      alert("登录成功！")
      userInfo.updateRole(response.data.role)
      userInfo.updateStaffInfo(response.data.staffInfo)
      router.push(
          {path:'/', params:{refresh:true}}
      );
    })
    .catch(function (error) {
      if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        console.log(error.request);
      } else {
        // 发送请求时出了点问题
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
}
</script>
<template>
  <div class="page-container">
    <div class="login-container">
      <h2 class="title">欢迎登录博数管理系统</h2>
      <el-input v-model="user_name" placeholder="请输入用户名" />
      <el-input v-model="user_password" placeholder="请输入密码" type="password"/>
      <el-button @click="login">登录</el-button>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('../assets/img/login.png'); /* 将图片的 URL 替换为你想要的图片地址 */
  background-size: cover; /* 图片将填充容器，并保持纵横比，可能会裁剪部分内容 */
  background-position: center; /* 将图片在容器中居中显示 */
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  border: 1px solid #100f0f56;
  /* 添加边框，可以根据需要修改边框颜色和粗细 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.356);
  /* 添加阴影 */
  border-radius: 10px;
  /* 设置圆角矩形，可以根据需要修改曲率大小 */
  width: 400px;
  height: 300px;
  background-color: #ffffffb1;
}

.el-input,
.el-button {
  margin-bottom: 10px;
}

.el-input {
  width: 300px;
}

.el-button {
  width: 200px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}</style>