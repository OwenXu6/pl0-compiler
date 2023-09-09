<template>
  <!-- <div class="cardContainer" id="container">
    
    <div class="ccard">
    <el-descriptions 
    title="藏品编目卡"
    direction="horizontal"
    :column="2"
    border
  >
  
    <el-descriptions-item label="收藏单位" min-width="90px">{{tableData?.collectInfo?.collectMuseum}}</el-descriptions-item>
    <el-descriptions-item label="现登记号">{{tableData?.collectionId}}</el-descriptions-item>
    <el-descriptions-item label="藏品图片" :span="2" align="center">
      <div class="demo-image__lazy">
        <el-image :src="tableData?.collectionPhoto" class="CollectionImg"/>
      </div>
    </el-descriptions-item>

    <el-descriptions-item label="名称"> {{ tableData?.name }}</el-descriptions-item>
    <el-descriptions-item label="原名">{{ tableData?.originalName }}</el-descriptions-item>
    <el-descriptions-item label="文物级别" >{{ tableData?.collectInfo?.collectionLevel }}</el-descriptions-item>
    <el-descriptions-item label="文物类别">{{ tableData?.collectionType }}</el-descriptions-item>
    <el-descriptions-item label="质地">{{ tableData?.textureType }}</el-descriptions-item>
    <el-descriptions-item label="年代">{{ tableData?.era }}</el-descriptions-item>
    <el-descriptions-item label="地域">{{ tableData?.area }}</el-descriptions-item>
    <el-descriptions-item label="来源">{{ tableData?.collectInfo?.source}}</el-descriptions-item>
    <el-descriptions-item label="保存状况">{{ tableData?.storageInfo?.currentStatus }}</el-descriptions-item>
    <el-descriptions-item label="完残程度">{{ tableData?.completenessType + " " + tableData?.completeness}}</el-descriptions-item>
    <el-descriptions-item label="尺寸">{{ tableData?.dimensionInfo?.dimension + " " +tableData?.dimensionInfo?.dimensionUnit }}</el-descriptions-item>
    <el-descriptions-item label="质量">{{ tableData?.dimensionInfo?.weight + " " + tableData?.dimensionInfo?.weightUnit }}</el-descriptions-item>
    <el-descriptions-item label="传统数量">{{ tableData?.dimensionInfo?.traditionalQuantity }}</el-descriptions-item>
    <el-descriptions-item label="实际数量">{{ tableData?.dimensionInfo?.realQuantity + " " + tableData?.dimensionInfo?.realQuantityUnit }}</el-descriptions-item>
    <el-descriptions-item label="入藏时间">{{ tableData?.collectInfo?.collectTime }}</el-descriptions-item>
    <el-descriptions-item label="保护等级">{{ tableData?.storageInfo?.protectionLevel }}</el-descriptions-item>
    <el-descriptions-item label="鉴定意见" class="comments" :span="2">
      {{ tableData?.identificationComments }}
      <div style="margin-top: 10px">鉴定人：{{ tableData?.identificationStaffName }}   &nbsp &nbsp &nbsp    鉴定时间:{{ tableData?.identificationDate }}</div>
    </el-descriptions-item>  
    <el-descriptions-item label="备注" class="remarks" :span="2">
      {{tableData?.remark}}
    </el-descriptions-item>  
  
  </el-descriptions>
  </div>
  
  </div> -->

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
import { computed, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useUserInfo } from '../store/userInfo';
import imgurl from '../assets/img/img.jpg';

const router = useRouter();
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
.arbeit{
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

