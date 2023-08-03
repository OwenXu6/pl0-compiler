<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
				</el-select>
				<el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
				<el-table-column prop="date" label="日期"></el-table-column>
				<el-table-column prop="totM" label="总门票"></el-table-column>
				<el-table-column prop="sale" label="已预约门票"></el-table-column>
				<el-table-column prop="residue" label="剩余门票"></el-table-column>
				<!-- <el-table-column label="已预约门票">
					<template #default="scope">￥{{ scope.row.money }}</template>
				</el-table-column> -->
				<!-- <el-table-column label="头像(查看大图)" align="center">
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
				</el-table-column> -->
				<!-- <el-table-column prop="address" label="地址"></el-table-column> -->
				<!-- <el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.state === '成功' ? 'success' : scope.row.state === '失败' ? 'danger' : ''"
						>
							{{ scope.row.state }}
						</el-tag>
					</template>
				</el-table-column> -->

				<!-- <el-table-column prop="date" label="注册时间"></el-table-column> -->
				<el-table-column label="操作" width="300" align="center">
					<template #default="scope">
						<el-button text class="green" @click="handleEdit(scope.$index, scope.row,1)" v-permiss="15">
							<button class="el-icon-lx-add btnSty green" ></button>
							增加门票
						</el-button>
						<el-button  text class="red" @click="handleEdit(scope.$index, scope.row, 0)" v-permiss="16">
							<button class="el-icon-lx-move btnSty red" ></button>
							减少门票
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
				<el-form-item label="修改为">
					<el-input v-model="form.residue"></el-input>
				</el-form-item>
				<!-- <el-form-item label="地址">
					<el-input v-model="form.address"></el-input>
				</el-form-item> -->
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
import { fetchData } from '../api/index';

// id: number;
	// name: string;
	// money: string;
	// state: string;
	//date: string;
	//address: string;
interface TableItem {
	
	date: string;
	totM:number;
	sale :number;
	residue:number;
	
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
	residue:0
});
let idx: number = -1;
let flag1: number = -1;
const handleEdit = (index: number, row: any,flag:number) => {
	idx = index;
	flag1=flag;
	form.residue = row.residue;
	editVisible.value = true;
};

const saveEdit = () => {
	editVisible.value = false;
	if(flag1===1){
		if(parseInt(form.residue.toString())<parseInt(tableData.value[idx].residue.toString())){
		editVisible.value = false;
		ElMessageBox.confirm('请大于原来剩余票数', {
      type: 'warning',
      callback: () => {}
    });
		return;
	}
	}

	else{
		if(parseInt(form.residue.toString())>parseInt(tableData.value[idx].residue.toString())){
		editVisible.value = false;
		ElMessageBox.confirm('请小于原来剩余票数', {
      type: 'warning',
      callback: () => {}
    });
		return;
	}
	}
	
	
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	let tmp: number = -1;
	tmp = parseInt(form.residue.toString())+parseInt(tableData.value[idx].sale.toString());
	
	tableData.value[idx].residue = form.residue;
	tableData.value[idx].totM = tmp;

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
.green{
	color: rgb(6, 195, 100);
}
.btnSty{
	
	border: none;
	font-size: 20px;
	font-weight: bold;
	background-color: white;
	margin-right: 10px;
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
