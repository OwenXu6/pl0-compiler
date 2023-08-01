<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="query.work_type" placeholder="工作方向" class="handle-select mr10">
					<el-option key="1" label="大领导" value="大领导"></el-option>
					<el-option key="2" label="全能神" value="全能神"></el-option>
					<el-option key="3" label="藏品管理员" value="藏品管理员"></el-option>
					<el-option key="4" label="导览人员" value="导览人员"></el-option>
					<el-option key="5" label="考古人员" value="考古人员"></el-option>
					<el-option key="6" label="其他工作人员" value="其他工作人员"></el-option>
				</el-select>
				<el-input v-model="query.name" placeholder="ID/姓名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handlenew">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="staffId" label="ID" width="85" align="center"></el-table-column>
				<el-table-column prop="staffName" label="姓名" align="center"></el-table-column>
				<el-table-column prop="staffAge" label="年龄" align="center"></el-table-column>
				<el-table-column prop="staffGender" label="性别" align="center"></el-table-column>
				<el-table-column prop="staffPostRank" label="职级" align="center"></el-table-column>
				<el-table-column prop="staffSalary" label="薪资" align="center"></el-table-column>
				<el-table-column prop="workType" label="工作方向" align="center"></el-table-column>
				<el-table-column prop="job" label="工作内容" align="center"></el-table-column>
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
					:total="tableData.values.length"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑信息" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="姓名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input v-model="form.age"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-select v-model="form.gender" placeholder="请选择性别"  class="full-width-select">
						<el-option label="男" value="男"></el-option>
						<el-option label="女" value="女"></el-option>
						<el-option label="双性人" value="双性人"></el-option>
						<el-option label="跨性别男性" value="跨性别男性"></el-option>
						<el-option label="跨性别女性" value="跨性别女性"></el-option>
						<el-option label="非二元性别" value="非二元性别"></el-option>
						<el-option label="性别流动" value="性别流动"></el-option>
						<el-option label="其他" value="其他"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="职级">
					<el-input v-model="form.post_rank"></el-input>
				</el-form-item>
				<el-form-item label="薪资">
					<el-input v-model="form.salary"></el-input>
				</el-form-item>
				<el-form-item label="工作方向">
					<el-select v-model="form.work_type" placeholder="请选择工作方向"  class="full-width-select">
						<el-option label="大领导" value="大领导"></el-option>
						<el-option label="全能神" value="全能神"></el-option>
						<el-option label="藏品管理员" value="藏品管理员"></el-option>
						<el-option label="导览人员" value="导览人员"></el-option>
						<el-option label="考古人员" value="考古人员"></el-option>
						<el-option label="其他工作人员" value="其他工作人员"></el-option>
					</el-select>
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

		<!-- 新增弹出框 -->
		<el-dialog title="新增人员信息" v-model="newVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="ID">
					<el-input v-model="form.id" ></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input v-model="form.age"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-select v-model="form.gender" placeholder="请选择性别"  class="full-width-select">
						<el-option label="男" value="男"></el-option>
						<el-option label="女" value="女"></el-option>
						<el-option label="双性人" value="双性人"></el-option>
						<el-option label="跨性别男性" value="跨性别男性"></el-option>
						<el-option label="跨性别女性" value="跨性别女性"></el-option>
						<el-option label="非二元性别" value="非二元性别"></el-option>
						<el-option label="性别流动" value="性别流动"></el-option>
						<el-option label="其他" value="其他"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="职级">
					<el-input v-model="form.post_rank"></el-input>
				</el-form-item>
				<el-form-item label="薪资">
					<el-input v-model="form.salary"></el-input>
				</el-form-item>
				<el-form-item label="工作方向">
					<el-select v-model="form.work_type" placeholder="请选择工作方向"  class="full-width-select">
						<el-option label="大领导" value="大领导"></el-option>
						<el-option label="藏品管理员" value="藏品管理员"></el-option>
						<el-option label="导览人员" value="导览人员"></el-option>
						<el-option label="考古人员" value="考古人员"></el-option>
						<el-option label="其他工作人员" value="其他工作人员"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="工作内容">
					<el-input v-model="form.job"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="newVisible = false">取 消</el-button>
					<el-button type="primary" @click="savenew">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import axios from 'axios'; 
import { ta } from 'element-plus/es/locale';


const fetchData = async () => {
	try {
		const response = await axios.get('http://42.192.39.198:5000/api/Staffs');
		console.log(response.data); 
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

interface TableItem {
	staffId: number;
	staffName: string;
	staffAge: string;
	staffGender: string;
	staffPostRank: string;
	staffSalary: number;
	workType: string;
	job: string;

}

const query = reactive({
	id: 0,
	name: '',
	gender: '',
	post_rank: '',
	work_type: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const addedData = ref<TableItem[]>([]); // 保存新增的数据
const compare = (a:TableItem,b:TableItem)=>{
	return a.staffId < b.staffId ? -1:1;
}

// 获取表格数据
const getData = async () => {
	const res = await fetchData();
	let filteredData = res.concat(addedData.value);
	//if (query.designIdea !== '') {
		//filteredData = filteredData.filter((item: TableItem) => item.designIdea === query.designIdea);
	//}
	if (query.name !== '') {
		filteredData = filteredData.filter((item: TableItem) => item.staffName.includes(query.name));
	}
	tableData.value = filteredData.sort(compare);
	console.log(tableData.value); 
};
getData();


const editData = async () => {
    try {
		console.log(idx,tableData.value[idx].staffId, tableData.value[idx]);
        const response = await axios.put('http://42.192.39.198:5000/api/Staffs/'+tableData.value[idx].staffId, tableData.value[idx]);
        ElMessage.success('数据上传成功');
    } catch (error) {
        ElMessage.error('数据上传失败');
    }
};

const uploadData = async () => {
    try {
		console.log(tableData.value[tableData.value.length-1]);
        const response = await axios.post('http://42.192.39.198:5000/api/Staffs', tableData.value[tableData.value.length-1]);
        ElMessage.success('数据上传成功');
    } catch (error) {
        ElMessage.error('数据上传失败');
    }
};

const deleteData = async () => {
    try {
		console.log(idx,tableData.value[idx]);
        const response = await axios.delete('http://42.192.39.198:5000/api/Staffs/'+tableData.value[idx].staffId);
		ElMessage.success('删除成功');
        ElMessage.success('数据上传成功');
		getData();
    } catch (error) {
        ElMessage.error('数据上传失败');
    }
};

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
	idx = index;
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			deleteData();
		})
		.catch(() => {});
};



//新增操作
const handlenew = () => {
	idx = tableData.value.length;
	form.id = 0;
	form.name = '';           
	form.age = '',
	form.gender = '',
	form.post_rank = '',
	form.salary = 0,
	form.work_type = '',
	form.job = '',
	newVisible.value = true;
};


// 表格编辑时弹窗和保存
const editVisible = ref(false);
const newVisible = ref(false);
let form = reactive({
	id: 0,
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

	form.id = row.staffId;
	form.name = row.staffName;           //命名不同
	form.age = row.staffAge,
	form.gender = row.staffGender,
	form.post_rank = row.staffPostRank,
	form.salary = row.staffSalary,
	form.work_type = row.workType,
	form.job = row.job,
	editVisible.value = true;
};

const saveEdit = () => {
	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	console.log(idx,tableData);
	tableData.value[idx].staffId = form.id;
	tableData.value[idx].staffName = form.name;
	tableData.value[idx].staffAge = form.age;
	tableData.value[idx].staffGender = form.gender;
	tableData.value[idx].staffPostRank = form.post_rank;
	tableData.value[idx].staffSalary = form.salary;
	tableData.value[idx].workType = form.work_type;
	tableData.value[idx].job = form.job; //应该要至后端修改之
	editData();
};

const savenew = () => {
	newVisible.value = false;
	let newEmployee: TableItem = {
	staffId: 0,
	staffName: '',
	staffAge: '',
	staffGender: '',
	staffPostRank: '',
	staffSalary: 0,
	workType: '',
	job: ''
	};
	tableData.value.push(newEmployee);
	ElMessage.success(`添加成功`);
	console.log(idx,tableData);
	tableData.value[idx].staffId = form.id;
	tableData.value[idx].staffName = form.name;
	tableData.value[idx].staffAge = form.age;
	tableData.value[idx].staffGender = form.gender;
	tableData.value[idx].staffPostRank = form.post_rank;
	tableData.value[idx].staffSalary = form.salary;
	tableData.value[idx].workType = form.work_type;
	tableData.value[idx].job = form.job; //应该要至后端修改之
	uploadData();
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

.full-width-select {
	width: 100%;
}

</style>
