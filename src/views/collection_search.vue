<template>
	<div>
		<div class="container">
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
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="110" align="center"></el-table-column>
				<el-table-column prop="name" label="文物名称"></el-table-column>
				<!--<el-table-column prop="name" label="文物图片"></el-table-column>-->
				<el-table-column prop="type" label="文物种类">
					<!--<template #default="scope">￥{{ scope.row.money }}</template>-->
				</el-table-column>
				<el-table-column prop="era" label="文物年代" align="center">
					<!--<template #default="scope">
						<el-image
							class="table-td-thumb"
							:src="scope.row.thumb"
							:z-index="10"
							:preview-src-list="[scope.row.thumb]"
							preview-teleported
						>
						</el-image>
					</template>-->
				</el-table-column>
				<!--<el-table-column prop="address" label="地址"></el-table-column>-->
				<el-table-column prop="status" label="藏品状态" align="center">
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
						<el-button text :icon="Edit" @click="handleDelete(scope.$index)" v-permiss="16">
							查看
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
				<el-form-item label="用户名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="地址">
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
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';

interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	address: string;
}

const query = reactive({
	address: '',
	name: '',
	id: '',
	type: ' ',
	era: ' ',
	status: ' ',
	excavation_site: ' ',
	excavation_date: ' ',
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
	name: '',
	address: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.name = row.name;
	form.address = row.address;
	editVisible.value = true;
};
const saveEdit = () => {
	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].name = form.name;
	tableData.value[idx].address = form.address;
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
