<template>
	<div>
		<div class="container">
			<!-- 查询的部分 -->
			<div class="handle-box">
				<el-input v-model="query.name" placeholder="文物名称" class="handle-input mr10"></el-input>
				<!--显示一个输入框，用户可以输入名称进行搜索。v-model="query.name"将输入的值绑定到query.name变量上。-->
				<el-input v-model="query.id" placeholder="文物ID" class="handle-input mr10"></el-input>
				<br><br>
				<el-select v-model="query.type" placeholder="文物种类" class="handle-select mr10">
					<el-option key="1" label="瓷器" value="瓷器"></el-option>
					<el-option key="2" label="青铜器" value="青铜器"></el-option>
				</el-select>
				<el-select v-model="query.era" placeholder="文物年代" class="handle-select mr10">
					<el-option key="1" label="唐代" value="唐代"></el-option>
					<el-option key="2" label="清代" value="清代"></el-option>
				</el-select>
				<el-select v-model="query.status" placeholder="藏品状态" class="handle-select mr10">
					<el-option key="1" label="在库" value="在库"></el-option>
					<el-option key="2" label="在展" value="在展"></el-option>
				</el-select>
				<el-select v-model="query.excavation_site" placeholder="出土地" class="handle-select mr10">
					<el-option key="1" label="三星堆" value="三星堆"></el-option>
					<el-option key="2" label="北首岭遗址" value="北首岭遗址"></el-option>
				</el-select>
				<el-input v-model="query.excavation_date" placeholder="出土日期" class="handle-input mr11"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<!--显示一个搜索按钮，用户点击按钮时触发handleSearch函数。-->
			</div>
			<!-- 显示文物详细信息的表格界面 -->
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="collectionId" label="ID" width="110" align="center"></el-table-column>
				<el-table-column prop="name" label="文物名称"></el-table-column>
				<el-table-column label="文物图片(查看大图)" align="center">
					<template #default="scope">
						<el-image
							class="table-td-thumb"
							:src="scope.row.collectionPhoto"
							:z-index="10"
							:preview-src-list="[scope.row.thumb]"
							preview-teleported
						>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="collectionType" label="文物种类"></el-table-column>
				<el-table-column prop="era" label="文物年代" align="center"></el-table-column>
				<!--<el-table-column prop="address" label="地址"></el-table-column>-->
				<el-table-column prop="storageInfo.currentStatus" label="藏品状态" align="center">
					<!--<template #default="scope">
						<el-tag
							:type="scope.row.state === '成功' ? 'success' : scope.row.state === '失败' ? 'danger' : ''"
						>
							{{ scope.row.state }}
						</el-tag>
					</template>-->
				</el-table-column>

				<!--<el-table-column prop="date" label="注册时间"></el-table-column>-->
				<el-table-column label="操作" width="350" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="14">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="15">
							删除
						</el-button>
						<el-button text :icon="View" @click="handleDetails(scope.$index, scope.row)" v-permiss="16">
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
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="文物名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<!-- 通过模糊搜索来输入文物的种类 -->
				<el-form-item label="文物种类">
					<el-autocomplete v-model="form.collectionType" :fetch-suggestions="typeQuerySearch" clearable
						class="inline-input w-50" placeholder="请输入文物的种类" @select="typeHandleSelect" />
				</el-form-item>
				<el-form-item label="文物年代">
					<el-autocomplete v-model="form.era" :fetch-suggestions="eraQuerySearch" clearable
						class="inline-input w-50" placeholder="请输入文物的年代" @select="eraHandleSelect" />
				</el-form-item>
				<el-form-item label="藏品状态">
					<el-select v-model="form.status" placeholder="藏品状态" class="handle-select mr10">
						<el-option key="1" label="在展" value="在展"></el-option>
						<el-option key="2" label="在库" value="在库"></el-option>
						<el-option key="3" label="修缮中" value="修缮中"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item v-if="form.status === '在展'" label="展厅名称">
					<el-input v-if="form.status === '在展'" v-model="form.hall_name" class="handle-input mr10"></el-input>
				</el-form-item>

				<el-form-item v-if="form.status === '在库'" label="库房名称">
					<el-input v-if="form.status === '在库'" v-model="form.storage_name" class="handle-input mr10"></el-input>
				</el-form-item>

			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 查看的弹出框 -->
		<el-dialog title="查看" v-model="viewVisible" width="30%">
			<div>文物名称：{{ view.name }}</div>
			<div>文物种类：{{ view.collectionType }}</div>
			<div>文物年代：{{ view.era }}</div>
			<div>藏品状态：{{ view.status }}</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="closeView">关 闭</el-button>
				</span>
			</template>
		</el-dialog>

	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, View } from '@element-plus/icons-vue';
// import { fetchData } from '../api/index';
import { onMounted } from 'vue'
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
	state: string;
	date: string;
	collectionType: string;
	era: string;
	status: string;
	hall_name: string;
	storage_name: string;
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
	pageIndex: 1,      //所在页面
	pageSize: 10       //总页面
});
//文物展示表格的数据
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
	fetchData().then(res => {
		console.log(res)
		tableData.value = res;
		console.log(res[0].collectionId);
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

// 处理删除操作
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

// 表格编辑时弹窗和保存
const editVisible = ref(false);
// 表格查看详细资料时弹窗和保存
const viewVisible = ref(false);
//表单填写的内容
let form = reactive({
	name: '',    //文物的姓名
	collectionType: '',    //文物的种类
	era: ' ',    //文物的年代
	status: ' ',    //文物的状态
	hall_name: ' ', //文物的展厅（若在展）
	storage_name: ' ' //文物的库房名称（若在库）
});
//查看的内容
let view = reactive({
	name: '',    //文物的姓名
	collectionType: '',    //文物的种类
	era: ' ',    //文物的年代
	status: ' '    //文物的状态
});

//处理编辑操作
let idx: number = -1;

//打开编辑框
const handleEdit = (index: number, row: any) => {
	//将目前表格中的内容先同步到编辑框内
	idx = index;
	form.name = row.name;
	form.collectionType = row.type;
	form.era = row.era;
	form.status = row.status;
	form.hall_name = row.hall_name;
	form.storage_name = row.storage_name;
	editVisible.value = true;
};

//处理查看操作
let i: number = -1;
const handleDetails = (index: number, row: any) => {
	i = index;
	view.name = row.name;
	view.collectionType = row.collectionType;
	view.era = row.era;
	view.status = row.status;
	viewVisible.value = true;
};
const uploadData = async () => {
	console.log(tableData.value[idx])
	try {
		const response = await axios.put('http://42.192.39.198:5000/api/Collections/' + tableData.value[idx].collectionId, tableData.value[idx]);
		ElMessage.success('数据上传成功');
	} catch (error) {
		ElMessage.error('数据上传失败');
	}
};

//存储编辑的内容
const saveEdit = async () => {
	editVisible.value = false;
	//遇事不决console.log
	console.log('saveEdit')
	console.log(tableData.value[idx].collectionId)
	console.log(idx)
	// ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].name = form.name;        //将修改的文物姓名同步到表格当中
	tableData.value[idx].collectionType = form.collectionType;        //将修改的文物的种类同步到表格当中
	tableData.value[idx].era = form.era;          //将修改的文物的朝代同步到表格当中
	tableData.value[idx].status = form.status;      //将修改的文物的状态同步到表格当中
	tableData.value[idx].hall_name = form.hall_name;      //将修改的文物的展厅名称同步到表格当中
	tableData.value[idx].storage_name = form.storage_name;      //将修改的文物的库房名称同步到表格当中
	console.log(tableData.value[idx]);
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
</style>
