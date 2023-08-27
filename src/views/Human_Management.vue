<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.value" placeholder="搜索内容" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handlenew">新增</el-button>
			</div>
			<el-table :data="pageData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
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
						<el-button text :icon="Edit"  @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
							删除
						</el-button>
						<el-button text :icon="More"  @click="" v-permiss="16">
							详细信息
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination" style="display: flex; align-items: center;">
				<el-select v-model="query.tempPageSize" @change="applyPageSize" placeholder="每页个数"
				 size="small" style="width: 100px;" >
				 <el-option label="5" value="5"></el-option>
				 <el-option label="10" value="10"></el-option>
				 <el-option label="20" value="20"></el-option>
				 <el-option label="50" value="50"></el-option>
				</el-select>

				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.pageIndex"
					:page-size="query.pageSize"
					:total="HumantableData.length"
					@current-change="handlePageChange"
					@update:page-size = "PageSizeChange"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑信息" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="姓名">
					<el-input v-model="form.staffName"></el-input>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input v-model="form.staffAge"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-select v-model="form.staffGender" placeholder="请选择性别"  class="full-width-select">
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
					<el-input v-model="form.staffPostRank"></el-input>
				</el-form-item>
				<el-form-item label="薪资">
					<el-input v-model="form.staffSalary"></el-input>
				</el-form-item>
				<el-form-item label="工作方向">
					<el-select v-model="form.workType" placeholder="请选择工作方向"  class="full-width-select">
						<el-option label="大领导" value="大领导"></el-option>
						<el-option label="全能神" value="全能神"></el-option>
						<el-option label="藏品管理员" value="藏品管理员"></el-option>
						<el-option label="库房管理员" value="库房管理员"></el-option>
						<el-option label="系统管理员" value="系统管理员"></el-option>
						<el-option label="导览人员" value="导览人员"></el-option>
						<el-option label="考古人员" value="考古人员"></el-option>
						<el-option label="安保人员" value="安保人员"></el-option>
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
					<el-input v-model="form.staffId" ></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="form.staffName"></el-input>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input v-model="form.staffAge"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-select v-model="form.staffGender" placeholder="请选择性别"  class="full-width-select">
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
					<el-input v-model="form.staffPostRank"></el-input>
				</el-form-item>
				<el-form-item label="薪资">
					<el-input v-model="form.staffSalary"></el-input>
				</el-form-item>
				<el-form-item label="工作方向">
					<el-select v-model="form.workType" placeholder="请选择工作方向"  class="full-width-select">
						<el-option label="大领导" value="大领导"></el-option>
						<el-option label="全能神" value="全能神"></el-option>
						<el-option label="藏品管理员" value="藏品管理员"></el-option>
						<el-option label="库房管理员" value="库房管理员"></el-option>
						<el-option label="系统管理员" value="系统管理员"></el-option>
						<el-option label="导览人员" value="导览人员"></el-option>
						<el-option label="考古人员" value="考古人员"></el-option>
						<el-option label="安保人员" value="安保人员"></el-option>
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
import { Delete, Edit, Search, Plus , More } from '@element-plus/icons-vue';
import axios from 'axios'; 
import { ta } from 'element-plus/es/locale';
import { ITEM_RENDER_EVT } from 'element-plus/es/components/virtual-list/src/defaults';


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
	staffId: string;
	staffName: string;
	staffAge: string;
	staffGender: string;
	staffPostRank: string;
	staffSalary: number;
	workType: string;
	job: string;
}

const query = reactive({
	value : '',
	staffId: 0,
	staffName: '',
	staffAge : '',
	staffGender: '',
	staffPostRank: '',
	staffSalary: 0,
	workType: '',
	job: '',
	pageIndex: 1,
	pageSize: 10,
	tempPageSize : ''
});
const HumantableData = ref<TableItem[]>([]);
const pageData = ref<TableItem[]>([]);   //
const addedData = ref<TableItem[]>([]); // 保存新增的数据
const compare = (a:TableItem,b:TableItem)=>{
	return a.staffId < b.staffId ? -1:1;
}

// 获取表格数据及筛选
const getData = async () => {
	const res = await fetchData();
	HumantableData.value = res;  //記錄全部數據
	let filteredData = res.concat(addedData.value);
	
	//if (query.designIdea !== '') {
		//filteredData = filteredData.filter((item: TableItem) => item.designIdea === query.designIdea);
	//}
	console.log(query.value);
	filteredData = filteredData.filter((item: TableItem) => 
    	item.staffName.includes(query.value) || 
    	item.staffGender.includes(query.value) || 
    	item.staffPostRank.includes(query.value) ||
		item.job.includes(query.value) ||
		item.workType.includes(query.value) ||
		String(item.staffId).includes(query.value)||
		String(item.staffSalary).includes(query.value)
	);

	filteredData = filteredData.sort(compare);

	// 分页逻辑
	const startIndex = (query.pageIndex - 1) * query.pageSize;
	const endIndex = query.pageIndex * query.pageSize;

	// 截取当前页的数据
	const pagedData = filteredData.slice(startIndex, endIndex);

	// 将截取的数据赋值给 HumantableData
	pageData.value = pagedData;

};
getData();


const editData = async () => {
    try {
		console.log(idx,HumantableData.value[idx].staffId, HumantableData.value[idx]);
        const response = await axios.put('http://42.192.39.198:5000/api/Staffs/'+HumantableData.value[idx].staffId, HumantableData.value[idx]);
        ElMessage.success('数据修改成功');
    } catch (error) {
        ElMessage.error('数据修改失败');
    }
};

const uploadData = async () => {
    try {
		console.log(HumantableData.value[HumantableData.value.length-1]);
        const response = await axios.post('http://42.192.39.198:5000/api/Staffs', HumantableData.value[HumantableData.value.length-1]);
        ElMessage.success('数据上传成功');
    } catch (error) {
        ElMessage.error('数据上传失败');
    }
};

const deleteData = async () => {
    try {
		console.log(idx,HumantableData.value[idx]);
        const response = await axios.delete('http://42.192.39.198:5000/api/Staffs/'+HumantableData.value[idx].staffId);
		ElMessage.success('删除成功');
		getData();
    } catch (error) {
        ElMessage.error('删除失败');
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

//改变大小
const applyPageSize = () =>{
	query.pageSize = Number(query.tempPageSize);
	console.log(query.pageSize);
	query.pageIndex = 1;
	getData();
}

const PageSizeChange = () =>{
	query.pageIndex = 1;
	getData();
}

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
	idx = HumantableData.value.length;
	form.staffId = '';
	form.staffName = '';           
	form.staffAge = '',
	form.staffGender = '',
	form.staffPostRank = '',
	form.staffSalary = '',
	form.workType = '',
	form.job = '',
	newVisible.value = true;
};


// 表格编辑时弹窗和保存
const editVisible = ref(false);
const newVisible = ref(false);
let form = reactive({
	staffId: '',
	staffName: '',
	staffAge: '',
	staffGender: '',
	staffPostRank: '',
	staffSalary: '',
	workType: '',
	job: '',
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;

	form.staffId = row.staffId;
	form.staffName = row.staffName;          
	form.staffAge = row.staffAge,
	form.staffGender = row.staffGender,
	form.staffPostRank = row.staffPostRank,
	form.staffSalary = row.staffSalary,
	form.workType = row.workType,
	form.job = row.job,
	editVisible.value = true;
};

const saveEdit = () => {
	const isAllDigits =/^[0-9]+$/.test(form.staffSalary);

	if (!isAllDigits) {
  		console.error("staffSalary 包含非数字字符");
		  ElMessage.error('薪資要是數字！！');
  		return; 
	}


	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	console.log(idx,HumantableData);
	HumantableData.value[idx].staffId = form.staffId;
	HumantableData.value[idx].staffName = form.staffName;
	HumantableData.value[idx].staffAge = form.staffAge;
	HumantableData.value[idx].staffGender = form.staffGender;
	HumantableData.value[idx].staffPostRank = form.staffPostRank;
	HumantableData.value[idx].staffSalary = Number(form.staffSalary);
	HumantableData.value[idx].workType = form.workType;
	HumantableData.value[idx].job = form.job; //应该要至后端修改之
		editData();
	
};

const savenew = () => {         //保存新增人员

	const isSalaryDigits =/^[0-9]+$/.test(form.staffSalary);
	const isIdDigits =/^[0-9]+$/.test(form.staffId);
	if (!isSalaryDigits) {
  		console.error("staffSalary 包含非数字字符");
		  ElMessage.error('薪資和ID要是數字！！');
  		return; 
	}
	if (!isIdDigits) {
  		console.error("staffId 包含非数字字符");
		  ElMessage.error('薪資和ID要是數字！！');
  		return; 
	}


	newVisible.value = false;
	let newEmployee: TableItem = {
	staffId: '',
	staffName: '',
	staffAge: '',
	staffGender: '',
	staffPostRank: '',
	staffSalary: 0,
	workType: '',
	job: ''
	};
	HumantableData.value.push(newEmployee);
	ElMessage.success(`添加成功`);
	console.log(idx,HumantableData);
	HumantableData.value[idx].staffId = form.staffId;
	HumantableData.value[idx].staffName = form.staffName;
	HumantableData.value[idx].staffAge = form.staffAge;
	HumantableData.value[idx].staffGender = form.staffGender;
	HumantableData.value[idx].staffPostRank = form.staffPostRank;
	HumantableData.value[idx].staffSalary = Number(form.staffSalary);
	HumantableData.value[idx].workType = form.workType;
	HumantableData.value[idx].job = form.job; 
	uploadData();             //上传
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
