<script setup>
import sha256 from 'crypto-js/sha256'
import {useBaseUrl} from "@/store/baseUrl";
import axios from "axios";
import {useUserInfo} from "@/store/userInfo";
import {ref} from "vue";

const baseUrl = useBaseUrl().baseUrl
const userInfo = useUserInfo()
const user_name = ref("")
const user_password = ref("")
const login = () => {
  const hashDigest = sha256(user_name.value + user_password.value)+'*'+'U';
  const LoginModel = {
    "userName":user_name.value,
    "password":hashDigest
  }
  axios.post(baseUrl + '/api/Authenticate/Login', LoginModel)
      .then(function (response) {
        userInfo.updateToken(response.data.token())
        alert(response)
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
  <p>{{baseUrl + '/api/Authenticate/Login'}}</p>
  <el-input v-model="user_name" placeholder="请输入用户名"/>
  <el-input v-model="user_password" placeholder="请输入密码"/>
  <el-button @click="login"/>
</template>