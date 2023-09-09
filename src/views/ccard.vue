<template>

  <!-- 显示个人信息 -->
  <el-card shadow="always" style=" height: 500px;">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
      </div>
    </template>
    <!-- 显示头像 -->
    <el-row class="image-row">
      <el-image class="center-image" :src="imgurl" />
    </el-row>
    <el-row class="image-row">

      <!-- 显示个人信息 -->
      <el-col :span="4">
        <div style="margin:25px;">用户名：deidei</div>
        <div style="margin:25px;">性别：男</div>
      </el-col>
      <!-- 显示个人信息 -->
      <el-col :span="4">
        <div style="margin:25px;">年龄：22</div>
        <div style="margin:25px;">职级：藏品管理员</div>
      </el-col>
      <!-- 显示个人信息 -->
      <el-col :span="4">
        <div style="margin:25px;">工作方向：藏品管理</div>
        <div style="margin:25px;">薪资：10000</div>
      </el-col>
    </el-row>
    <!-- 显示个人信息 -->
    <el-row :span="12" class="arbeit">
      <div style="margin:25px;width: 650px;">工作内容：藏品管理</div>
    </el-row>
  </el-card>

  <!-- 退出按钮 -->
  <div style="text-align: center; margin: 10px;">
    <el-button type="danger" @click="handleLogout">退出登录</el-button>
  </div>
</template>

<script setup lang="ts">

import { computed, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useUserInfo } from '../store/userInfo';
import imgurl from '../assets/img/img.jpg';

const router = useRouter();


onMounted(() => {
  const userInfo = useUserInfo();
  console.log(userInfo.staffInfo);
});
const handleLogout = () => {
  const userInfo = useUserInfo();
  userInfo.updateStaffInfo(undefined);
  userInfo.updateToken(undefined);
  userInfo.updateRole(undefined);
  userInfo.updateExpireTime(new Date(0))
  router.push('/login');
};

</script>

<style scoped>
.CollectionImg {
  float: left;
  width: 200px;
  height: 130px;
  margin: 10px;

}

.ccard {
  margin: 0 auto;
  width: 700px;
}

.image-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.arbeit {
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-image {
  width: 150px;
  height: 150px;
  border-radius: 75px;
}
</style>

