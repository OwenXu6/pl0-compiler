<template>
	<div>
		<div class="container">
			<div class="handle-box">
                <el-button type="primary" :icon="ArrowLeft" @click="goback" class="mr10">返回</el-button>
				<el-select v-model="query.address" placeholder="所属展厅" class="handle-select mr10">
	<el-option key="1" label="全部" value="全部"></el-option>
    <el-option key="2" label="安馆" value="安馆"></el-option>
    <el-option key="3" label="博馆" value="博馆"></el-option>
    <el-option key="4" label="诚馆" value="诚馆"></el-option>
</el-select>
				<el-input v-model="query.name" placeholder="展品名称" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="展品ID" width="55" align="center"></el-table-column>
				<el-table-column prop="name" label="展品名称"></el-table-column>
				<el-table-column label="头像(查看大图)" align="center">
					<template #default="scope">
						<el-image
							class="table-td-thumb"
							:src="scope.row.thumb"
							:z-index="10"
							:preview-src-list="[scope.row.thumb]"
							preview-teleported
						>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="hall_name" label="所属展厅"></el-table-column>
				<el-table-column prop="introduction" label="简介"></el-table-column>
        <el-table-column prop="temperature" label="温度（℃）"></el-table-column>
        	<el-table-column prop="humidity" label="湿度（%RH）"></el-table-column>
			<el-table-column prop="light" label="光强（cd）"></el-table-column>
				<el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.state === '良好' ? 'success' : scope.row.state === '危险' ? 'danger' : ''"
						>
							{{ scope.row.state }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="others" label="其他"></el-table-column>

				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
							删除
						</el-button>	
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.pageIndex"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="展品名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="所属展厅">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>

    <!-- 新增弹出框 -->
		<el-dialog title="新增" v-model="addVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="展品名称">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="所属展厅">
					<el-input v-model="addForm.hall_name"></el-input>
				</el-form-item>
				<el-form-item label="简介">
					<el-input v-model="addForm.introduction"></el-input>
				</el-form-item>
				<el-form-item label="温度">
					<el-input v-model="addForm.temperature"></el-input>
				</el-form-item>
				<el-form-item label="湿度">
					<el-input v-model="addForm.humidity"></el-input>
				</el-form-item>
				<el-form-item label="光强">
					<el-input v-model="addForm.light"></el-input>
				</el-form-item>
        <el-form-item label="状态">
					<el-select v-model="addForm.state" placeholder="状态">
						<el-option key="1" label="良好" value="良好"></el-option>
						<el-option key="2" label="危险" value="危险"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="其他">
					<el-input v-model="addForm.others"></el-input>
				</el-form-item>	
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAdd">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="collections">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Sort, More, ArrowLeft } from '@element-plus/icons-vue';
// import { fetchCollectionsData } from '../api/index';
import { useRoute, useRouter } from 'vue-router';


interface TableItem {
	id: number;
	name: string;
  hall_name:string;
	introduction: string;
    temperature:number;
    humidity:number;
    light:number;
	state: string;
	others:string;
}

const query = reactive({
	address: '',
	pass_name:'',
	name: '',
	pageIndex: 1,
	pageSize: 10
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const addedData = ref<TableItem[]>([]); // 保存新增的数据
//接受展厅数据
const route = useRoute();
const paramName = route.params.name;
if (Array.isArray(paramName)) {
  query.pass_name = paramName[0]; // 将数组的第一个元素赋值给 query.address
} else {
  query.pass_name = paramName; // 直接赋值给 query.address
}

// 获取表格数据
const getData = () => {
	fetchCollectionsData().then(res => {
		let filteredData = res.data.list.concat(addedData.value);
		if (query.address !== '') {
			if(query.address==='全部'){
			tableData.value = filteredData;
			}
			else{
            filteredData = filteredData.filter((item: TableItem) => item.hall_name === query.address);
			}
        }
        if (query.name !== '') {
            filteredData = filteredData.filter((item: TableItem) => item.name.includes(query.name));
        }
		tableData.value = filteredData;
		pageTotal.value = res.data.pageTotal || 50;
	});
} ;
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
		.catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	name: '',
	address: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.name = row.name;
	form.address = row.position;
	editVisible.value = true;
};
const saveEdit = () => {
	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].name = form.name;
	tableData.value[idx].hall_name = form.address;
};


// 新增弹窗和保存
const addVisible = ref(false);
let addForm = reactive({
    name: '',
    hall_name: '',
	introduction:'',
	temperature: 0,
    humidity: 0,
	light:0,
    state: '',
    others: '',
});
const handleAdd = () => {
    addVisible.value = true;
};
const saveAdd = () => {
    addVisible.value = false;
    const newItem = {
        id: tableData.value.length + 1,
        name: addForm.name,
		hall_name:addForm.hall_name,
        introduction: addForm.introduction,
		temperature: addForm.temperature,
		humidity: addForm.humidity,
		light: addForm.light,
        state: addForm.state,
        others:addForm.others,
    };
    addedData.value.push(newItem); // 将新增的数据保存到addedData数组中
    tableData.value.push(newItem);
    ElMessage.success('新增成功');
};

// 返回展厅
const router = useRouter();
const goback = () => {
	router.push( 'table' );
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