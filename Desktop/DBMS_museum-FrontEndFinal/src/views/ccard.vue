<template>

  <div class="cardContainer" id="container">
    
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
  
  </div>
  <div style="text-align: center; margin: 10px;">
    <el-button type="primary" v-print="'#container'">打印</el-button>
  </div>
  
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import axios from 'axios'

export interface Response {
    area?: string;
    collectInfo?: CollectInfo;
    collectionAudio?: string;
    collectionId?: number;
    collectionPhoto?: string;
    collectionType?: string;
    completeness?: string;
    completenessType?: string;
    dimensionInfo?: DimensionInfo;
    era?: string;
    exhibitionHallId?: null;
    identificationComments?: string;
    identificationDate?: string;
    identificationStaffName?: string;
    museumId?: number;
    name?: string;
    originalName?: string;
    remark?: string;
    storageId?: null;
    storageInfo?: StorageInfo;
    textureType?: string;
}

export interface CollectInfo {
    collectionId: number;
    collectionLevel: string;
    collectMuseum: string;
    collectTime: string;
    generalRegistrationId: string;
    source: string;
}

export interface DimensionInfo {
    collectionId: number;
    dimension: string;
    dimensionUnit: string;
    realQuantity: number;
    realQuantityUnit: string;
    traditionalQuantity: number;
    weight: number;
    weightUnit: string;
}

export interface StorageInfo {
    collectionId: number;
    currentStatus: string;
    protectionLevel: string;
}


const tableData = ref<Response>();
const fetchData = async () => {
	try {
		const response = await axios.get('http://42.192.39.198:5000/api/Collections/13');
		console.log(response.data); 
		return response.data;
	} catch (error) {
		console.error(error);
	}
};
// 获取表格数据
const getData = async () => {
	const res = await fetchData();
	tableData.value = res;
	console.log(tableData.value); 
};

getData();



</script>

<style scoped>

.CollectionImg{
  float:left;
  width: 200px;
  height: 130px;
  margin: 10px;
 
}
.ccard{
  margin:0 auto;
  width: 700px;
}
</style>

