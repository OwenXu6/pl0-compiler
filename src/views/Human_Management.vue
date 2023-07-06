<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="query.address" placeholder="工作方向" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
				</el-select>
				<el-input v-model="query.name" placeholder="ID/姓名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handlenew">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="Staff_id" label="ID" width="85" align="center"></el-table-column>
				<el-table-column prop="Staff_Name" label="姓名" align="center"></el-table-column>
				<el-table-column prop="Staff_Age" label="年龄" align="center"></el-table-column>
				<el-table-column prop="Staff_Gender" label="性别" align="center"></el-table-column>
				<el-table-column prop="Staff_Post_Rank" label="职级" align="center"></el-table-column>
				<el-table-column prop="Staff_Salary" label="薪资" align="center"></el-table-column>
				<el-table-column prop="Work_Type" label="工作方向" align="center"></el-table-column>
				<el-table-column prop="Job" label="工作内容" align="center"></el-table-column>
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

		<!-- 新增/编辑弹出框 -->
		<el-dialog title="信息填写" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="姓名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input v-model="form.age"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-input v-model="form.gender"></el-input>
				</el-form-item>
				<el-form-item label="职级">
					<el-input v-model="form.post_rank"></el-input>
				</el-form-item>
				<el-form-item label="薪资">
					<el-input v-model="form.salary"></el-input>
				</el-form-item>
				<el-form-item label="工作方向">
					<el-input v-model="form.work_type"></el-input>
				</el-form-item>
				<el-form-item label="工作内容">
					<el-input v-model="form.job"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { Human_fetchData } from '../api/index';

interface TableItem {
	id: number;
	name: string;
	age: string;
	gender: string;
	post_rank: string;
	salary: number;
	work_type: string;
	job: string;

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
	Human_fetchData().then(res => {
		tableData.value = res.data.list;
		pageTotal.value = res.data.pageTotal || 50;
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

//新增操作
const handlenew = () => {
	idx = pageTotal.value;
	editVisible.value = true;
};


// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	name: '',
	age: '',
	gender: '',
	post_rank: '',
	salary: 0,
	work_type: '',
	job: '',
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;

	form.name = row.Staff_Name;
	form.age = row.Staff_Age,
	form.gender = row.Staff_Gender,
	form.post_rank = row.Staff_Post_Rank,
	form.salary = row.Staff_Salary,
	form.work_type = row.Work_Type,
	form.job = row.Job,
	editVisible.value = true;
};

const saveEdit = () => {
	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].name = form.name;
	tableData.value[idx].age = form.age;
	tableData.value[idx].gender = form.gender;
	tableData.value[idx].post_rank = form.post_rank;
	tableData.value[idx].salary = form.salary;
	tableData.value[idx].work_type = form.work_type;
	tableData.value[idx].job = form.job; //应该要至后端修改之
	getData();
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
