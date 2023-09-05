<template>
	<div>
		<div class="cardContainer" id="container">

			<el-descriptions class="margin-top" title="藏品编目卡" :column="2" :size="size" border>
				<!-- 收藏单位 -->
				<el-descriptions-item>
					<template #label>
						<div v-model="form.collectInfo.collectMuseum" class="cell-item" :style="{ minWidth: form.collectInfo.collectMuseum.length * 12 + 'px' }">
							<el-icon :style="iconStyle">
								<user />
							</el-icon>
							收藏单位
						</div>
					</template>
					{{ form.collectInfo.collectMuseum }}
				</el-descriptions-item>
				<!-- 现登记号 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<EditPen />
							</el-icon>
							现登记号
						</div>
					</template>
					{{ form.collectionId }}
				</el-descriptions-item>
				<!-- 藏品图片 -->
				<el-descriptions-item :span="2">
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Picture />
							</el-icon>
							藏品图片
						</div>
					</template>
					<template #default="scope">
						<el-image class="CollectionImg" :src="form.collectionPhoto" :z-index="10">
						</el-image>
					</template>
				</el-descriptions-item>
				<!-- 名称 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<tickets />
							</el-icon>
							名称
						</div>
					</template>
					{{ form.name }}
				</el-descriptions-item>
				<!-- 文物原名 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<tickets />
							</el-icon>
							原名
						</div>
					</template>
					{{ form.originalName }}
				</el-descriptions-item>
				<!-- 文物级别 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Medal />
							</el-icon>
							文物级别
						</div>
					</template>
					{{ form.storageInfo.protectionLevel }}
				</el-descriptions-item>
				<!-- 文物类别 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Grid />
							</el-icon>
							文物类别
						</div>
					</template>
					{{ form.collectionType }}
				</el-descriptions-item>
				<!-- 质地 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Pointer />
							</el-icon>
							质地
						</div>
					</template>
					{{ form.textureType }}
				</el-descriptions-item>
				<!--年代 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Calendar />
							</el-icon>
							年代
						</div>
					</template>
					{{ form.era }}
				</el-descriptions-item>
				<!-- 地域 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<LocationInformation />
							</el-icon>
							地域
						</div>
					</template>
					{{ form.area }}
				</el-descriptions-item>
				<!-- 来源 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<MapLocation />
							</el-icon>
							来源
						</div>
					</template>
					{{ form.collectInfo.source }}
				</el-descriptions-item>
				<!-- 保存状况 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Collection />
							</el-icon>
							保存状况
						</div>
					</template>
					{{ form.storageInfo.currentStatus }}
					<span v-if="form.storageInfo.currentStatus == '在展'">所在展厅：{{ form.exhibitionHallId }}</span>
					<span v-if="form.storageInfo.currentStatus == '在库'">所在仓库：{{ form.storageId }}</span>
				</el-descriptions-item>
				<!-- 完残程度 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Box />
							</el-icon>
							完残程度
						</div>
					</template>
					{{ form.completeness }}
				</el-descriptions-item>
				<!-- 尺寸 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<FullScreen />
							</el-icon>
							尺寸
						</div>
					</template>
					{{ form.dimensionInfo.dimension + form.dimensionInfo.dimensionUnit }}
				</el-descriptions-item>
				<!-- 质量-->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Coin />
							</el-icon>
							质量
						</div>
					</template>
					{{ form.dimensionInfo.weight + form.dimensionInfo.weightUnit }}
				</el-descriptions-item>
				<!-- 传统数量 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Histogram />
							</el-icon>
							传统数量
						</div>
					</template>
					{{ form.dimensionInfo.traditionalQuantity + "个" }}
				</el-descriptions-item>
				<!-- 实际数量 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Histogram />
							</el-icon>
							实际数量
						</div>
					</template>
					{{ form.dimensionInfo.realQuantity + "个" }}
				</el-descriptions-item>
				<!-- 入藏时间 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<AlarmClock />
							</el-icon>
							入藏时间
						</div>
					</template>
					{{ form.collectInfo.collectTime }}
				</el-descriptions-item>
				<!-- 保护等级 -->
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Trophy />
							</el-icon>
							保护等级
						</div>
					</template>
					{{ form.storageInfo.protectionLevel }}
				</el-descriptions-item>
				<!-- 鉴定意见 -->
				<el-descriptions-item :span="2">
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<EditPen />
							</el-icon>
							鉴定意见
						</div>
					</template>
					{{ form.identificationComments }}
					<div style="margin-top: 10px">鉴定人：{{ form.identificationStaffName }} &nbsp &nbsp &nbsp 鉴定时间:{{
						form.identificationDate }}</div>
				</el-descriptions-item>
				<!-- 备注 -->
				<el-descriptions-item :span="2">
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<Notebook />
							</el-icon>
							备注
						</div>
					</template>
					{{ form.remark }}
				</el-descriptions-item>
			</el-descriptions>

		</div>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import { onMounted } from 'vue'
import axios from 'axios';
import type { FormInstance, FormRules } from 'element-plus'

let tmp = ({
	location: "",
})

interface TableItem {
	collectionId: number,      //ID
	originalName: string,      //原名
	name: string,              //名称，默认为"未知"，可以等到鉴定之后再填写
	collectionType: string,    //类别（如石器、陶器等）
	era: string,               //年代
	area: string,              //地域
	textureType: string,       //质地类别（例如有机质类、无机质类）
	completeness: string,      //完残程度
	completenessType: string,  //完残程度类别：完、残、缺、失
	collectionPhoto: string,   //图片
	collectionAudio: string,   //音频

	collectInfo: {             //收藏组
		collectionId: number,  //ID
		source: string,        //来源，如旧藏、拨交、移交
		collectMuseum: string, //收藏博物馆
		generalRegistrationId: string,  //总登记号，不是说总登记号即Collection_id?
		collectTime: string,            //入藏时间
		collectionLevel: string         //藏品级别
	},
	dimensionInfo: {           //计量组
		collectionId: number,  //ID
		dimension: string,     //尺寸
		dimensionUnit: string, //尺寸单位，默认为毫米
		weight: number,             //质量
		weightUnit: string,         //质量单位，默认为克
		realQuantity: number,       //实际数量
		realQuantityUnit: string,   //实际数量单位，默认为件
		traditionalQuantity: number //传统数量
		//where is 传统数量单位
	},
	storageInfo: {                  //保存组
		collectionId: number,       //ID
		currentStatus: string,      //当前状况
		protectionLevel: string     //保护优先等级
	},
	exhibitionHallId: number,  //展厅ID
	warehouseId: number,       //仓库ID
	containerId: number,       //库架ID
	identificationStaffName: string, //鉴别人员名称
	identificationComments: string,  //鉴别结果
	identificationDate: string,      //鉴别日期
	remark: string                   //备注
}

let newCollection: TableItem = {
	collectionId: 4,
	originalName: "string",
	name: "string",
	collectionType: "12",
	era: "string",
	area: "string",
	textureType: "string",
	completeness: "string",
	completenessType: "string",
	collectionPhoto: "string",
	collectionAudio: "string",
	collectInfo: {
		"collectionId": 4,
		"source": "string",
		"collectMuseum": "string",
		"generalRegistrationId": "string",
		"collectTime": "2023-09-03T00:00:00",
		"collectionLevel": "string"
	},
	dimensionInfo: {
		collectionId: 4,
		dimension: "string",
		dimensionUnit: "string",
		weight: 0,
		weightUnit: "string",
		realQuantity: 0,
		realQuantityUnit: "string",
		traditionalQuantity: 0
	},
	storageInfo: {
		collectionId: 4,
		currentStatus: "未鉴定",
		protectionLevel: "string"
	},
	exhibitionHallId: null,
	warehouseId: 1,
	containerId: 1,
	identificationStaffName: "jiaoao",
	identificationComments: "string",
	identificationDate: "2023-09-03T07:46:58.924",
	remark: "string"

};

const form = reactive({
	collectionId: 4,
	originalName: "string",
	name: "string",
	collectionType: "12",
	era: "string",
	area: "string",
	textureType: "string",
	completeness: "string",
	completenessType: "string",
	collectionPhoto: "string",
	collectionAudio: "string",
	collectInfo: {
		"collectionId": 4,
		"source": "string",
		"collectMuseum": "string",
		"generalRegistrationId": "string",
		"collectTime": "2023-09-03T00:00:00",
		"collectionLevel": "string"
	},
	dimensionInfo: {
		collectionId: 4,
		dimension: "string",
		dimensionUnit: "string",
		weight: 0,
		weightUnit: "string",
		realQuantity: 0,
		realQuantityUnit: "string",
		traditionalQuantity: 0
	},
	storageInfo: {
		collectionId: 4,
		currentStatus: "未鉴定",
		protectionLevel: "string"
	},
	exhibitionHallId: null,
	warehouseId: 1,
	containerId: 1,
	identificationStaffName: "jiaoao",
	identificationComments: "string",
	identificationDate: "2023-09-03T07:46:58.924",
	remark: "string"

})

const rules = {
	/*CollectionID: [
		{ required: true, message: '文物编号不能为空', trigger: 'blur' },
	],
	OriginalName: [
		{ required: true, message: '文物原名不能为空', trigger: 'blur' },
	],
	CollectionType: [
		{ required: true, message: '文物类别不能为空', trigger: 'change' },
	],
	Researched: [
		{ required: true, message: '是否已考证不能为空', trigger: 'change' },
	],
	Era: [
		{ required: true, message: '文物年代不能为空', trigger: 'change' },
	],
	Location: [
		{ required: true, message: '文物在展/在库不能为空', trigger: 'change' },
	],*/
	// 其他表单项的验证规则...
};


/*const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  const valid = await formEl.validate();
  if (valid) {
	try {
	  const response = await axios.post('http://42.192.39.198:5000/api/Collections', form);
	  console.log(response.data); // 假设后端返回提交结果的数据
	  // 处理提交结果，可以显示成功消息或进行相应的跳转
	} catch (error) {
	  console.error(error);
	  // 处理请求错误，比如显示错误消息
	}
  } else {
	console.log('error submit!');
  }
};*/



const submitForm = async (newCollection: TableItem) => {
	try {
		console.log(newCollection);
		const response = await axios.post('http://42.192.39.198:5000/api/Collections', newCollection);
		ElMessage.success('数据上传成功');
	} catch (error) {
		ElMessage.error('数据上传失败');
	}
};

const submitnew = () => {
	submitForm(newCollection);
}

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
}


const query = reactive({
	address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
	fetchData().then(res => {
		tableData.value = res.data.list;
		pageTotal.value = res.data.pageTotal || 50;
	});
};
getData();


// 文物种类下拉菜单的属性
interface TypeSelectItem {
	value: string
	index: number
}
const toSelect = ref<TypeSelectItem[]>([])

//搜索符合条件的选项
const typeQuerySearch = (queryString: string, cb: any) => {
	const results = queryString
		? toSelect.value.filter(typeCreateFilter(queryString))
		: toSelect.value
	cb(results)
}
const typeCreateFilter = (queryString: string) => {
	return (restaurant: TypeSelectItem) => {
		return (
			restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
		)
	}
}

//可选择的选项
const typeLoadAll = () => {
	return [
		{ value: '石器', index: 1 },
		{ value: '陶器', index: 2 },
		{ value: '石刻、造像', index: 3 },
		{ value: '骨角器', index: 4 },
		{ value: '俑', index: 5 },
		{ value: '铜器', index: 6 },
		{ value: '铁器', index: 7 },
		{ value: '银器', index: 8 },
		{ value: '金器', index: 9 },
		{ value: '其他金属器（锡、铅等）', index: 10 },
		{ value: '瓷器', index: 11 },
		{ value: '玉器', index: 12 },
		{ value: '宝石', index: 13 },
		{ value: '珐琅', index: 14 },
		{ value: '紫砂', index: 15 },
		{ value: '玻璃器', index: 16 },
		{ value: '书画', index: 17 },
		{ value: '图书、文献', index: 18 },
		{ value: '甲骨、简牍', index: 19 },
		{ value: '文房用具', index: 20 },
		{ value: '铭刻、印章、符牌', index: 21 },
		{ value: '货币、票据', index: 22 },
		{ value: '织绣', index: 23 },
		{ value: '竹、木、匏、核、漆器', index: 24 },
		{ value: '民间艺术品', index: 25 },
		{ value: '家具', index: 26 },
		{ value: '仪器、仪表', index: 27 },
		{ value: '生产机械', index: 28 },
		{ value: '建筑资料', index: 29 },
		{ value: '化石', index: 30 },
		{ value: '其他', index: 31 },
	]
}

//处理选择的项，比如说给一个东西赋值
const typeHandleSelect = (item: TypeSelectItem) => {
	console.log(item)
}

onMounted(() => {
	toSelect.value = typeLoadAll()
})

// 文物时期下拉菜单的属性
interface EraSelectItem {
	value: string
	index: number
}
const toSelectEra = ref<EraSelectItem[]>([])

//搜索符合条件的选项
const eraQuerySearch = (queryString: string, cb: any) => {
	const results = queryString
		? toSelectEra.value.filter(eraCreateFilter(queryString))
		: toSelectEra.value
	cb(results)
}
const eraCreateFilter = (queryString: string) => {
	return (restaurant: TypeSelectItem) => {
		return (
			restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
		)
	}
}

//可选择的选项
const EraloadAll = () => {
	return [
		{ value: '夏朝', index: 1 },
		{ value: '商朝', index: 2 },
		{ value: '春秋战国', index: 3 },
		{ value: '秦朝', index: 4 },
		{ value: '汉朝', index: 5 },
		{ value: '三国', index: 6 },
		{ value: '魏晋南北朝', index: 7 },
		{ value: '隋朝', index: 8 },
		{ value: '唐朝', index: 9 },
		{ value: '五代十国', index: 10 },
		{ value: '宋朝', index: 11 },
		{ value: '元朝', index: 12 },
		{ value: '明朝', index: 13 },
		{ value: '清朝', index: 14 },
		{ value: '民国', index: 15 },
	]
}
//处理选择的项，比如说给一个东西赋值
const eraHandleSelect = (item: EraSelectItem) => {
	console.log(item)
}

onMounted(() => {
	toSelectEra.value = EraloadAll()
})


// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			ElMessage.success('删除成功');
			tableData.value.splice(index, 1);
		})
		.catch(() => { });
};


</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}

.table {
	width: 100%;
	font-size: 14px;
}

.red {
	color: #F56C6C;
}

.mr10 {
	margin-right: 10px;
}

.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>


