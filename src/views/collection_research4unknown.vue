<template>
	<div>
		<div class="container">
			<!-- 查询的部分 -->
			<div class="handle-box">
				<el-input v-model="query.value" placeholder="搜索内容" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch" v-permiss="15">搜索</el-button>
			</div>
			<!-- 显示文物详细信息的表格界面 -->
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="collectionId" label="ID" width="110" align="center"></el-table-column>
				<el-table-column prop="name" label="文物名称" align="center"></el-table-column>
				<el-table-column label="文物图片(查看大图)" align="center">
					<template #default="scope">
						<el-image class="table-td-thumb" :src="scope.row.collectionPhoto" :z-index="10"
							:preview-src-list="[scope.row.collectionPhoto]" preview-teleported>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="collectionType" label="文物种类" align="center"></el-table-column>
				<el-table-column prop="era" label="文物年代" align="center"></el-table-column>
				<!--<el-table-column prop="address" label="地址"></el-table-column>-->
				<el-table-column prop="storageInfo.currentStatus" label="藏品状态" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.storageInfo.currentStatus === '在展' ? 'success' : scope.row.storageInfo.currentStatus === '修缮中' ? 'danger' : ''">
							{{ scope.row.storageInfo.currentStatus }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="collectInfo.collectTime" label="入藏时间" align="center"></el-table-column>
				<!--<el-table-column prop="date" label="注册时间"></el-table-column>-->
				<el-table-column label="操作" width="350" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)">
							删除
						</el-button>
						<el-button text :icon="View" @click="handleDetails(scope.$index, scope.row)">
							查看
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>

		<!-- 编辑的弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="60%">
			<el-form label-width="70px">

				<el-descriptions class="margin-top" :column="2" :size="size" border>
					<!-- 收藏单位 -->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item" :style="{ minWidth: view.collectInfo.collectMuseum.length * 12 + 'px' }">
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
						<el-autocomplete v-model="form.storageInfo.protectionLevel" :fetch-suggestions="eraQuerySearch"
							clearable class="inline-input w-50" placeholder="请输入文物的保护等级" @select="protectLevelSelect" />
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
							class="inline-input w-50" placeholder="请选择文物的年代" @select="eraHandleSelect" />
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
						<!-- <el-input v-model="form.storageInfo.currentStatus"></el-input> -->
						<el-radio-group v-model="radio">
							<el-radio :label="1">在展</el-radio>
							<el-radio :label="2">在库</el-radio>
							<el-radio :label="3">未鉴定</el-radio>
						</el-radio-group>
						<div v-if="radio == 1">
							<span>请输入展厅Id: </span><el-input v-model="form.exhibitionHallId" class="handle-input mr10"></el-input>
						</div>
						<div v-if="radio == 2">
							<span>请输入库房Id: </span><el-input v-model="form.warehouseId" class="handle-input mr10"></el-input>
						</div>
						<div v-if="radio == 2">
							<span>请输入货架Id: </span><el-input v-model="form.containerId"
								class="handle-input mr10"></el-input>
						</div>
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
						<el-autocomplete v-model="form.storageInfo.protectionLevel" :fetch-suggestions="eraQuerySearch"
							clearable class="inline-input w-50" placeholder="请输入文物的保护等级" @select="protectLevelSelect" />
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
						<!-- {{ form.identificationComments }} -->
						<el-input v-model="form.identificationComments" :autosize="{ minRows: 2, maxRows: 4 }"
							type="textarea" placeholder="请输入鉴定意见" />
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
						<el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4 }"
							type="textarea" placeholder="请输入备注" />
					</el-descriptions-item>
				</el-descriptions>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 查看的弹出框 -->
		<el-dialog title="查看" v-model="viewVisible" width="60%">
			<!-- <div>文物名称：{{ view.name }}</div>
			<div>文物种类：{{ view.collectionType }}</div>
			<div>文物年代：{{ view.era }}</div>
			<div>藏品状态：{{ view.storageInfo.currentStatus }}</div> -->
			<div class="cardContainer" id="container">

				<el-descriptions class="margin-top" title="藏品编目卡" :column="2" :size="size" border>
					<!-- 收藏单位 -->
					<el-descriptions-item>
						<template #label>
							<div class="cell-item" :style="{ minWidth: view.collectInfo.collectMuseum.length * 12 + 'px' }">
								<el-icon :style="iconStyle">
									<user />
								</el-icon>
								收藏单位
							</div>
						</template>
						{{ view.collectInfo.collectMuseum }}
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
						{{ view.collectionId }}
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
							<el-image class="CollectionImg" :src="view.collectionPhoto" :z-index="10">
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
						{{ view.name }}
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
						{{ view.originalName }}
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
						{{ view.storageInfo.protectionLevel }}
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
						{{ view.collectionType }}
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
						{{ view.textureType }}
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
						{{ view.era }}
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
						{{ view.area }}
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
						{{ view.collectInfo.source }}
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
						{{ view.storageInfo.currentStatus }}
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
						{{ view.completeness }}
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
						{{ view.dimensionInfo.dimension + view.dimensionInfo.dimensionUnit }}
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
						{{ view.dimensionInfo.weight + view.dimensionInfo.weightUnit }}
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
						{{ view.dimensionInfo.traditionalQuantity + "个" }}
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
						{{ view.dimensionInfo.realQuantity + "个" }}
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
						{{ view.collectInfo.collectTime }}
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
						{{ view.storageInfo.protectionLevel }}
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
						{{ view.identificationComments }}
						<div style="margin-top: 10px">鉴定人：{{ view.identificationStaffName }} &nbsp &nbsp &nbsp 鉴定时间:{{
							view.identificationDate }}</div>
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
						{{ view.remark }}
					</el-descriptions-item>
				</el-descriptions>

			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="closeView">关 闭</el-button>
					<el-button type="success" v-print="'#container'">打 印</el-button>
				</span>
			</template>
		</el-dialog>

	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, View } from '@element-plus/icons-vue';
// import { fetchData } from '../api/index';
import { onMounted } from 'vue'
import {
	Iphone,
	Location,
	OfficeBuilding,
	Tickets,
	User,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'; // 导入useRouter
import axios from 'axios'

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

//表格中展示的数据
interface TableItem {
	collectionId: number;
	name: string;
	money: string;
	date: string;
	collectionType: string;
	collectInfo: {
		collectTime: string;	//收藏的时间
		source: string;
	}
	era: string;
	status: string;
	hall_name: string;
	storageInfo: {
		currentStatus: string;
		protectionLevel: string;
	}
	textureType: string;
	area: string;
	completeness: string;
	dimensionInfo: {
		collectionId: string;
		dimension: string;
		dimensionUnit: string;
		weight: string;
		weightUnit: string;
		realQuantity: string;
		traditionalQuantity: string;
	},
	identificationComments: string;
	exhibitionHallId: string;
	warehouseId: string;
	containerId: string;
	remark: string;
}
//请求数据
const query = reactive({
	name: '',         //文物姓名
	id: '',           //文物id
	collectionType: ' ',        //文物类别
	era: ' ',         //文物的朝代
	status: ' ',      //藏品状态
	excavation_site: ' ',    //出土地
	excavation_date: ' ',   //出土日期
	collectTime: '',	//收藏的时间
	pageIndex: 1,      //所在页面
	pageSize: 10,       //总页面
	storageInfo: {
		currentStatus: '',
		protectionLevel: ''
	},
	value:'',
});
//文物展示表格的数据
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
let filteredData = ref<TableItem[]>([]); // 保存筛选的数据

// 获取表格数据
const getData = () => {
	fetchData().then(res => {
		console.log(res);
		//过滤掉“未鉴定”的文物

		filteredData.value = res.filter(item => item.storageInfo.currentStatus == '未鉴定');

		for (var i = 0; i < filteredData.value.length; i++) {
			//对每一个文物截取有效时间显示
			var T = filteredData.value[i].collectInfo.collectTime;
			var dest = '';
			console.log(T)
			for (var j = 0; j < T.length; j++) {
				if (T[j] == 'T')
					break;
				dest += T[j];
			}
			filteredData.value[i].collectInfo.collectTime = dest;
			//检查文物的名字是否已知，如果是已知的则直接显示，如果是未知的就显示
		}

		filteredData.value = filteredData.value.filter(item => 
		String(item.collectionId).includes(query.value)||
		item.collectionType.includes(query.value)||
		item.era.includes(query.value)||
		item.storageInfo.currentStatus.includes(query.value)||
		item.collectInfo.collectTime.includes(query.value)
		);


		tableData.value=filteredData.value;
		console.log(tableData.value);

		
		// console.log(res[0].collectionId);
		// pageTotal.value = res.data.pageTotal || 50;
	});

};
getData();

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
const saveDelete = async (index: number) => {
	try {
		const deletedItemId = tableData.value[index].collectionId;
		await axios.delete(`http://42.192.39.198:5000/api/Collections/${deletedItemId}`);
		ElMessage.success('数据删除成功');
	} catch (error) {
		ElMessage.error('数据删除失败');
	}
};
// 处理删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			ElMessage.success('删除成功');
			// 在这里调用 saveDelete 并传递要删除的数据索引
			saveDelete(index);
			tableData.value.splice(index, 1);
		})
		.catch(() => { });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
// 表格查看详细资料时弹窗和保存
const viewVisible = ref(false);
//表单填写的内容
let form = reactive({
	area: '',
	collectInfo: {
		collectionId: '',
		source: '',
		collectMuseum: '',
		generalRegistrationId: '',
		collectTime: '',
		collectionLevel: ''
	},
	collectionId: '',
	collectionPhoto: '',
	collectionType: '',
	completeness: '',
	completenessType: '',
	dimensionInfo: {
		collectionId: '',
		dimension: '',
		dimensionUnit: '',
		weight: '',
		weightUnit: '',
		realQuantity: '',
		traditionalQuantity: ''
	},
	era: '',
	identificationComments: '',
	identificationDate: '',
	identificationStaffName: '',
	name: '',
	remark: '',
	storageInfo: {
		currentStatus: '',
		protectionLevel: ''
	},
	originalName: '',
	textureType: '',
	exhibitionHallId: '',
	warehouseId: '',
	containerId: ''
});
//查看的内容
let view = reactive({
	area: '',
	collectInfo: {
		collectionId: '',
		source: '',
		collectMuseum: '',
		generalRegistrationId: '',
		collectTime: '',
		collectionLevel: ''
	},
	collectionId: '',
	collectionPhoto: '',
	collectionType: '',
	completeness: '',
	completenessType: '',
	dimensionInfo: {
		collectionId: '',
		dimension: '',
		dimensionUnit: '',
		weight: '',
		weightUnit: '',
		realQuantity: '',
		traditionalQuantity: ''
	},
	era: '',
	identificationComments: '',
	identificationDate: '',
	identificationStaffName: '',
	name: '',
	remark: '',
	storageInfo: {
		currentStatus: '',
		protectionLevel: ''
	},
	originalName: '',
	textureType: ''
});

//处理编辑操作
let idx: number = -1;
//获取当前系统时间 
let time: string = "";
//打开编辑框
const handleEdit = (index: number, row: any) => {
	// 获取当前时间
	const currentTime = new Date();

	// 将时间格式化为你想要的格式（例如 "yyyy-MM-dd HH:mm:ss"）
	time = currentTime.toLocaleString();

	//将目前表格中的内容先同步到编辑框内
	form.area = row.area;
	form.collectInfo = {
		collectionId: row.collectInfo.collectionId,
		source: row.collectInfo.source,
		collectMuseum: row.collectInfo.collectMuseum,
		generalRegistrationId: row.collectInfo.generalRegistrationId,
		collectTime: row.collectInfo.collectTime,
		collectionLevel: row.collectInfo.collectionLevel
	};
	form.collectionId = row.collectionId;
	form.collectionPhoto = row.collectionPhoto;
	form.collectionType = row.collectionType;
	form.completeness = row.completeness;
	form.completenessType = row.completenessType;
	form.dimensionInfo = {
		collectionId: row.dimensionInfo.collectionId,
		dimension: row.dimensionInfo.dimension,
		dimensionUnit: row.dimensionInfo.dimensionUnit,
		weight: row.dimensionInfo.weight,
		weightUnit: row.dimensionInfo.weightUnit,
		realQuantity: row.dimensionInfo.realQuantity,
		traditionalQuantity: row.dimensionInfo.traditionalQuantity
	};
	form.era = row.era;
	form.identificationComments = row.identificationComments;
	form.identificationDate = time;
	form.identificationStaffName = row.identificationStaffName;
	form.name = row.name;
	form.remark = row.remark;
	form.storageInfo = {
		currentStatus: row.storageInfo.currentStatus,
		protectionLevel: row.storageInfo.protectionLevel
	};
	form.originalName = row.originalName;
	form.textureType = row.textureType;
	editVisible.value = true;
	idx = index
};

//处理查看操作
let i: number = -1;
// const view = ref<TableItem[]>([]);
const handleDetails = (index: number, row: any) => {
	view.area = row.area;
	view.collectInfo = {
		collectionId: row.collectInfo.collectionId,
		source: row.collectInfo.source,
		collectMuseum: row.collectInfo.collectMuseum,
		generalRegistrationId: row.collectInfo.generalRegistrationId,
		collectTime: row.collectInfo.collectTime,
		collectionLevel: row.collectInfo.collectionLevel
	};
	view.collectionId = row.collectionId;
	view.collectionPhoto = row.collectionPhoto;
	view.collectionType = row.collectionType;
	view.completeness = row.completeness;
	view.completenessType = row.completenessType;
	view.dimensionInfo = {
		collectionId: row.dimensionInfo.collectionId,
		dimension: row.dimensionInfo.dimension,
		dimensionUnit: row.dimensionInfo.dimensionUnit,
		weight: row.dimensionInfo.weight,
		weightUnit: row.dimensionInfo.weightUnit,
		realQuantity: row.dimensionInfo.realQuantity,
		traditionalQuantity: row.dimensionInfo.traditionalQuantity
	};
	view.era = row.era;
	view.identificationComments = row.identificationComments;
	view.identificationDate = row.identificationDate;
	view.identificationStaffName = row.identificationStaffName;
	view.name = row.name;
	view.remark = row.remark;
	view.storageInfo = {
		currentStatus: row.storageInfo.currentStatus,
		protectionLevel: row.storageInfo.protectionLevel
	};
	view.originalName = row.originalName;
	view.textureType = row.textureType;
	viewVisible.value = true;
};

//将数据上传到数据库中
const uploadData = async () => {
	console.log(tableData.value[idx])
	try {
		const response = await axios.put('http://42.192.39.198:5000/api/Collections/' + tableData.value[idx].collectionId, tableData.value[idx]);
		ElMessage.success('数据上传成功');
		getData();
	} catch (error) {
		ElMessage.error('数据上传失败');
	}
};

let radio = ref(3);
//存储编辑的内容
const saveEdit = async () => {
	editVisible.value = false;
	//遇事不决console.log
	console.log('saveEdit')
	console.log(tableData.value[idx].collectionId)
	console.log(radio)
	// ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].name = form.name;        //将修改的文物姓名同步到表格当中
	tableData.value[idx].collectionType = form.collectionType;        //将修改的文物的种类同步到表格当中
	tableData.value[idx].era = form.era;          //将修改的文物的朝代同步到表格当中
	// tableData.value[idx].status = form.status;      //将修改的文物的状态同步到表格当中
	// tableData.value[idx].hall_name = form.hall_name;      //将修改的文物的展厅名称同步到表格当中
	if (radio.value == 1) {
		tableData.value[idx].storageInfo.currentStatus = "在展";
		tableData.value[idx].exhibitionHallId = form.exhibitionHallId;
	}
	else if (radio.value == 2) {
		tableData.value[idx].storageInfo.currentStatus = "在库";
		tableData.value[idx].warehouseId = form.warehouseId;
		tableData.value[idx].containerId = form.containerId;
	}
	else if (radio.value == 3)
		tableData.value[idx].storageInfo.currentStatus = "未鉴定";
	radio.value = 3;

	tableData.value[idx].storageInfo.protectionLevel = form.storageInfo.protectionLevel;
	tableData.value[idx].textureType = form.textureType;
	tableData.value[idx].area = form.area;
	tableData.value[idx].collectInfo.source = form.collectInfo.source;
	tableData.value[idx].completeness = form.completeness;
	tableData.value[idx].dimensionInfo.dimension = form.dimensionInfo.dimension;
	tableData.value[idx].dimensionInfo.weight = form.dimensionInfo.weight;
	tableData.value[idx].dimensionInfo.traditionalQuantity = form.dimensionInfo.traditionalQuantity;
	tableData.value[idx].dimensionInfo.realQuantity = form.dimensionInfo.realQuantity;
	tableData.value[idx].identificationComments = form.identificationComments
	tableData.value[idx].remark=form.remark
	console.log(tableData.value);

	// Update frontend table data
	// tableData.value[idx] = updatedData;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);  //弹出弹窗提示用户修改成功
	uploadData();

};
//关闭“查看详细信息”的弹窗
const closeView = () => {
	viewVisible.value = false;                    //editVisible.value被用来控制编辑界面或对话框的显示与隐藏
};

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
	toSelectEra.value = protectLevelLoadAll()
})
const size = ref('')
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

.mr11 {
	width: 150px;
	margin-right: 10px;
}

.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}

.el-descriptions {
	margin-top: 20px;
}

.cell-item {
	display: flex;
	align-items: center;
}

.margin-top {
	margin-top: 20px;
}

.CollectionImg {
	float: left;
	width: 200px;
	height: 130px;
	margin: 10px;

}
</style>
