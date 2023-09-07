<script setup>
import sha256 from 'crypto-js/sha256'
import {useBaseUrl} from "../store/baseUrl";
import axios from "axios";
import {useUserInfo} from "../store/userInfo";
import {reactive, ref} from "vue";

const baseUrl = useBaseUrl().baseUrl
const userInfo = useUserInfo()

const userFormRef = ref()
const userForm = reactive({
  account:"",
  password:""
})
const validatePassword = (rule,value,callback)=>{
  if(value===""){
    callback(new Error("请输入密码"))
  }else{
    return userFormRef.value.validateField('checkPass',()=>null)
  }
}
const rules = reactive({
  password:[{validator:validatePassword,trigger:'blue'}]
})
const login = (user) => {
  if(!user) return
  user.validate((valid)=>{
    if(valid){
      const hashDigest = sha256(userForm.account + userForm.password)+'*'+'U';
      axios.post(baseUrl + '/api/Authenticate/Login', userForm)
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
  })

}
</script>
<template>
  <el-form
      ref = "userFormRef"
      :model="userForm"
      :rules="rules"
  >
    <el-form-item  label = "Account" prop="account">
      <el-input v-model="userForm.account"></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="userForm.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>