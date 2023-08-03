<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="query.address" placeholder="所属展厅" class="handle-select mr10">
    <el-option key="1" label="全部" value="全部"></el-option>
    <el-option key="2" label="安馆" value="安馆"></el-option>
    <el-option key="3" label="博馆" value="博馆"></el-option>
    <el-option key="4" label="诚馆" value="诚馆"></el-option>
	<el-option key="5" label="德馆" value="德馆"></el-option>
</el-select>
				<el-input v-model="query.name" placeholder="活动名称" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="活动ID" width="55" align="center"></el-table-column>
				<el-table-column prop="name" label="活动名称"></el-table-column>
				<el-table-column prop="hall_name" label="所属展厅"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="theme" label="主题"></el-table-column>
				<el-table-column prop="paticipants" label="参与人数"></el-table-column>
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column prop="begin" label="开始时间"></el-table-column>
                <el-table-column prop="end" label="结束时间"></el-table-column>

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
				<el-form-item label="活动名称">
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
				<el-form-item label="活动名称">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
                <el-form-item label="所属展厅">
					<el-input v-model="addForm.hall_name"></el-input>
				</el-form-item>
                <el-form-item label="类型">
					<el-input v-model="addForm.type"></el-input>
				</el-form-item>
				<el-form-item label="主题">
					<el-input v-model="addForm.theme"></el-input>
				</el-form-item>
                <el-form-item label="参与人数">
					<el-input v-model="addForm.paticipants"></el-input>
				</el-form-item>
				<el-form-item label="日期">
					<el-input v-model="addForm.date"></el-input>
				</el-form-item>
                <el-form-item label="开始时间">
					<el-input v-model="addForm.begin"></el-input>
				</el-form-item>
                <el-form-item label="结束时间">
					<el-input v-model="addForm.end"></el-input>
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

<script setup lang="ts" name="activity">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Sort, More } from '@element-plus/icons-vue';
import { fetchActivityData } from '../api/index';
import { useRouter } from 'vue-router';


interface TableItem {
	id: number;
	name: string;
    hall_name:string;
    type:string;
	theme: string;
	paticipants: number;
    date:string;
    begin:string;
    end:string;
}

const query = reactive({
	address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const addedData = ref<TableItem[]>([]); // 保存新增的数据


// 获取表格数据
const getData = () => {
	fetchActivityData().then(res => {
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
    hall_name:'',
    type: '',
    theme: '',
    paticipants: 0,
    date: '',
    begin: '',
    end: '',
});
const handleAdd = () => {
    addVisible.value = true;
};
const saveAdd = () => {
    addVisible.value = false;
    const newItem = {
        id: tableData.value.length + 1,
        name: addForm.name,
        hall_name: addForm.hall_name,
        type: addForm.type,
        theme: addForm.theme,
        paticipants:addForm.paticipants,
        date:addForm.date,
        begin:addForm.begin,
        end:addForm.end,
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