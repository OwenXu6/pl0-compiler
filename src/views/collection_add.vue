<template>
	<div>
		<div class="cardContainer" id="container">

			<el-form label-width="70px">

				<el-descriptions class="margin-top" :column="2" :size="size" border>
					<!-- 收藏单位 -->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item" :style="{ minWidth: form.collectInfo.collectMuseum.length * 12 + 'px' }">
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

					<!-- 藏品图片 改一个提交方式：从本地上传-->
					<el-descriptions-item :span="2">
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<Picture />
								</el-icon>
								藏品图片
							</div>
						</template>
						<el-upload class="upload-demo" action="/foreignImage/upload" name="smfile"
							:headers="{ Authorization: 'kydXBqSSWZNb12Q25q6OmXGGSKwajXXk' }" :on-success="handleSuccess"
							:on-error="handleError" :before-upload="beforeUpload">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
						<!-- 显示已上传的图片 -->
						<el-image v-if="form.collectionPhoto" class="CollectionImg" :src="form.collectionPhoto"
							:z-index="10">
						</el-image>
						<!--el-input v-model="form.collectionPhoto"></el-input-->
						<!--template #default="scope">
							<el-image class="CollectionImg" :src="form.collectionPhoto" :z-index="10">
							</el-image>
						</template-->
					</el-descriptions-item>

					<!-- 藏品音频 改一个提交方式：从本地上传-->
					<el-descriptions-item :span="2">
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<Picture />
								</el-icon>
								藏品音频
							</div>
						</template>
						<el-input v-model="form.collectionAudio"></el-input>
						<!--template #default="scope">
							<el-image class="CollectionImg" :src="form.collectionAudio" :z-index="10">
							</el-image>
						</template-->
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
						<el-input v-model="form.name"></el-input>
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
						<el-input v-model="form.originalName"></el-input>
					</el-descriptions-item>
					<!-- 文物级别 select没写完-->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<Medal />
								</el-icon>
								文物级别
							</div>
						</template>
						<el-autocomplete v-model="form.collectInfo.collectionLevel" :fetch-suggestions="eraQuerySearch"
							clearable class="inline-input w-50" placeholder="请输入文物级别" @select="protectLevelSelect" />
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
						<el-input v-model="form.collectionType"></el-input>
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
						<el-autocomplete v-model="form.textureType" :fetch-suggestions="typeQuerySearch" clearable
							class="inline-input w-50" placeholder="请输入文物的种类" @select="typeHandleSelect" />
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
						<el-autocomplete v-model="form.era" :fetch-suggestions="eraQuerySearch" clearable
							class="inline-input w-50" placeholder="请输入文物的年代" @select="eraHandleSelect" />
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
						<el-input v-model="form.area"></el-input>
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
						<el-input v-model="form.collectInfo.source"></el-input>
					</el-descriptions-item>
					<!-- 保存状况 就是当前状况吗？-->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<Collection />
								</el-icon>
								保存状况
							</div>
						</template>
						<!-- <el-input v-model="form.storageInfo.currentStatus"></el-input> -->
						<el-radio-group v-model="form.storageInfo.currentStatus">
							<el-radio label="在展">在展</el-radio>
							<el-radio label="在库">在库</el-radio>
							<el-radio label="未鉴定">未鉴定</el-radio>
						</el-radio-group>

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
						<el-input v-model="form.completeness"></el-input>
					</el-descriptions-item>

					<!-- 完残程度类别 -->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<Box />
								</el-icon>
								完残程度类别
							</div>
						</template>
						<el-input v-model="form.completenessType"></el-input>
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
						<el-input v-model="form.dimensionInfo.dimension"></el-input>
					</el-descriptions-item>

					<!-- 尺寸单位 -->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<FullScreen />
								</el-icon>
								尺寸单位
							</div>
						</template>
						<el-input v-model="form.dimensionInfo.dimensionUnit"></el-input>
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
						<el-input v-model="form.dimensionInfo.weight"></el-input>
					</el-descriptions-item>
					<!-- 质量单位-->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<Coin />
								</el-icon>
								质量单位
							</div>
						</template>
						<el-input v-model="form.dimensionInfo.weightUnit"></el-input>
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
						<el-input v-model="form.dimensionInfo.traditionalQuantity"></el-input>
					</el-descriptions-item>
					<!-- 传统数量单位 -->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<Histogram />
								</el-icon>
								传统数量单位
							</div>
						</template>
						<el-input v-model="form.dimensionInfo.traditionalQuantityUnit"></el-input>
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
						<el-input v-model="form.dimensionInfo.realQuantity"></el-input>
					</el-descriptions-item>

					<!-- 实际数量单位 -->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<Histogram />
								</el-icon>
								实际数量单位
							</div>
						</template>
						<el-input v-model="form.dimensionInfo.realQuantityUnit"></el-input>
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
						<el-autocomplete v-model="form.storageInfo.protectionLevel" :fetch-suggestions="eraQuerySearch"
							clearable class="inline-input w-50" placeholder="请输入文物的保护等级" @select="protectLevelSelect" />
					</el-descriptions-item>

					<!-- 备注 -->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<Histogram />
								</el-icon>
								备注
							</div>
						</template>
						<el-input v-model="form.remark"></el-input>
					</el-descriptions-item>


					<!-- 入藏时间 自动给生成？-->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item">
								<el-icon :style="iconStyle">
									<AlarmClock />
								</el-icon>
								入藏时间
							</div>
						</template>
						<el-input v-model="form.collectInfo.collectTime"></el-input>
					</el-descriptions-item>

				</el-descriptions>

				<el-form-item>
					<el-button type="primary" @click="submitForm(form)">
						提交
					</el-button>
					<!--el-button @click="resetForm(form)">重置</el-button-->
				</el-form-item>

			</el-form>


		</div>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import {
	Iphone,
	Location,
	OfficeBuilding,
	Tickets,
	User,
} from '@element-plus/icons-vue'

//import { fetchData } from '../api/index';
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
		traditionalQuantity: number, //传统数量
		traditionalQuantityUnit: string//传统数量单位
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
	collectionId: 99,
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
		collectionId: 99,
		source: "string",
		collectMuseum: "string",
		collectTime: "2023-09-03T00:00:00",
		collectionLevel: "string"
	},
	dimensionInfo: {
		collectionId: 99,
		dimension: "string",
		dimensionUnit: "string",
		weight: 0,
		weightUnit: "string",
		realQuantity: 0,
		realQuantityUnit: "string",
		traditionalQuantity: 0,
		traditionalQuantityUnit: "string"
	},
	storageInfo: {
		collectionId: 99,
		currentStatus: "未鉴定",
		protectionLevel: "string"
	},
	exhibitionHallId: null,
	warehouseId: null,
	containerId: null,
	identificationStaffName: "1212",
	identificationComments: "string",
	identificationDate: "2023-09-03T07:46:58",
	remark: "string"

};

const form = reactive({
	collectionId: 777,
	originalName: "",
	name: "",
	collectionType: "",
	era: "",
	area: "",
	textureType: "",
	completeness: "",
	completenessType: "",
	collectionPhoto: "",
	collectionAudio: "",
	collectInfo: {
		collectionId: 777,
		source: "",
		collectMuseum: "苏州博物馆",
		collectTime: "2023-09-03T00:00:00",//这里要么就是 yyyy-mm-ddT+时间(**:**:**)，要么就是只有日期yyyy-mm-dd
		collectionLevel: ""
	},
	dimensionInfo: {
		collectionId: 777,
		dimension: "",
		dimensionUnit: "",
		weight: null,
		weightUnit: "",
		realQuantity: null,
		realQuantityUnit: "",
		traditionalQuantity: null,
		traditionalQuantityUnit: ""
	},
	storageInfo: {
		collectionId: 777,
		currentStatus: "",
		protectionLevel: ""
	},
	exhibitionHallId: null,
	warehouseId: null,
	containerId: null,
	identificationStaffName: "焦骜",
	identificationComments: "string",
	identificationDate: "2023-09-03T07:46:58",
	remark: ""

});

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

//获取后端数据库的数据
const fetchData = async () => {
	try {
		const response = await axios.get(' http://42.192.39.198:5000/api/Collections');
		console.log(response.data);
		console.log("数据库连接成功！");
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

const getData = () => {
	fetchData().then(res => {
		//自动生成collectionId
		form.collectionId = Object.keys(res).length + 1;
		form.collectInfo.collectionId = form.collectionId;
		form.storageInfo.collectionId = form.collectionId;
		form.dimensionInfo.collectionId = form.collectionId;
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


//可选择的选项
const protectLevelLoadAll = () => {
	return [
		{ value: '一级', index: 1 },
		{ value: '两级', index: 2 },
		{ value: '三级', index: 3 },
	]
}
//处理选择的项，比如说给一个东西赋值
const protectLevelSelect = (item: EraSelectItem) => {
	console.log(item)
}

onMounted(() => {
	toSelect.value = typeLoadAll()
})


const size = ref('')

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

const iconStyle = computed(() => {
	const marginMap = {
		large: '8px',
		default: '6px',
		small: '4px',
	}
	return {
		marginRight: marginMap.default,
	}
})


// 在组件创建时获取当前时间并填充到 collectTime
form.collectInfo.collectTime = getCurrentTime();

function getCurrentTime() {
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');
	const seconds = now.getSeconds().toString().padStart(2, '0');
	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// 处理上传成功后的响应
/*function handleSuccess(response, file) {
	// 在这里获取上传成功后的图片地址，并更新 form.collectionPhoto
	if (response && response.code === 0) { // 根据实际返回数据判断上传是否成功
		form.collectionPhoto = response.data.imageUrl; // 假设响应中包含了图片的地址
	}
}*/

/*const upload = (file) => {
	const formData = new FormData();
	formData.append("smfile", file.file);
	axios
		.post("https://sm.ms/api/v2/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				"Authorization": "14ac5499cfdd2bb2859e4476d2e5b1d2bad079bf",
			},
		})
		.then((res) => {
			console.log(res);
		});
};*/


const handleSuccess = (response, file) => {
      // 处理上传成功后的回调
      console.log('上传成功', response);
	  form.collectionPhoto=response.data.url;
      // 在回调中处理SM.MS返回的数据，可以获取图片链接等信息
};
const handleError = (err) => {
      // 处理上传失败后的回调
      console.error('上传失败', err);
};
const beforeUpload = (file) => {
      // 在上传前可以执行一些操作，例如限制文件类型、大小等
      return true; // 返回true表示继续上传，返回false表示取消上传
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


