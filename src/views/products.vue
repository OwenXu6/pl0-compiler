<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="selectedCategory" placeholder="产品类别" class="handle-select mr10">
					<el-option label="全部产品" value="all"></el-option>
					<el-option label="文创产品" value="文创"></el-option>
					<el-option label="非文创产品" value="非文创"></el-option>
				</el-select>



				<el-input v-model="query.productName" placeholder="商品名称" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>

			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable"
				header-cell-class-productName="table-header">
				<el-table-column prop="productId" label="ID			" width="55" align="center"></el-table-column>
				<el-table-column prop="productName" label="商品名称"></el-table-column>
				<el-table-column label="商品价格">
					<template #default="scope">￥{{ scope.row.price }}</template>
				</el-table-column>

				<el-table-column prop="monthlySale" label="月销量"></el-table-column>
				<el-table-column label="操作" width="300" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
							删除
						</el-button>

						<el-button @click="viewCreativeProduct(scope.$index, scope.row)">查看</el-button>
					</template>
				</el-table-column>

			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="40%">
			<el-form label-width="90px">
				<el-form-item label="商品名称">
					<el-input v-model="form.productName"></el-input>
				</el-form-item>
				<el-form-item label="商品价格">
					<el-input v-model="form.price"></el-input>
				</el-form-item>
				<el-form-item label="月销量">
					<el-input v-model="form.monthlySale"></el-input>
				</el-form-item>
				<el-form-item label="相关文物Id" v-if="form.isRelated !== 0">
					<el-input v-model="form.relatedCollectionId"></el-input>
				</el-form-item>
				<el-form-item label="设计理念" v-if="form.isRelated !== 0">
					<el-input v-model="form.designIdea"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- 查看文创产品弹出框 -->
		<el-dialog title="查看文创产品" v-model="viewVisible" width="40%">
			<el-form label-width="90px">
				<el-form-item label="相关文物Id">
					<el-input v-model="viewForm.relatedCollectionId" disabled></el-input>
				</el-form-item>
				<el-form-item label="设计理念">
					<el-input v-model="viewForm.designIdea" disabled></el-input>
				</el-form-item>

				<!-- test -->
				<el-form-item label="isRelated">
					<el-input v-model="viewForm.isRelated" disabled></el-input>
				</el-form-item>


			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="viewVisible = false">关闭</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- 新增弹出框 -->
		<el-dialog title="新增" v-model="addVisible" width="40%">
			<el-button @click="updateIsRelated">改变产品类别</el-button>
			<el-form label-width="90px">
				<el-form-item label="商品名称">
					<el-input v-model="addForm.productName"></el-input>
				</el-form-item>
				<el-form-item label="商品价格">
					<el-input v-model="addForm.price"></el-input>
				</el-form-item>
				<el-form-item label="月销量">
					<el-input v-model="addForm.monthlySale"></el-input>
				</el-form-item>
				<el-form-item label="产品类别">
					<el-select v-model="addForm.isRelated" placeholder="产品类别">
						<el-option key="1" label="文创产品" value="1"></el-option>
						<el-option key="2" label="非文创产品" value="0"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="相关文物Id" v-if="addForm.isRelated === 1">
					<el-input v-model="addForm.relatedCollectionId"></el-input>
				</el-form-item>
				<el-form-item label="设计理念" v-if="addForm.isRelated === 1">
					<el-input v-model="addForm.designIdea"></el-input>
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

<script setup lang="ts" productName="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';

import axios from 'axios'


interface TableItem {
	productId: number;
	productName: string;
	price: number;
	isRelated: number;
	relatedCollectionId: number;
	designIdea: string;
	monthlySale: number;
}

const query = reactive({
	designIdea: '',
	isRelated: 0,
	productName: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const addedData = ref<TableItem[]>([]); // 保存新增的数据
const compare = (a: TableItem, b: TableItem) => {
	return a.productId < b.productId ? -1 : 1;
}

const selectedCategory = ref('all');
// 获取表格数据
const getData = async () => {
  try {
    const response = await axios.get('http://42.192.39.198:5000/api/Products');
    const data = response.data;
    //检查data的内容
	console.log(data)
    // Apply filters
    let filteredData = [...data];

    if (query.designIdea !== '') {
      filteredData = filteredData.filter((item: TableItem) => item.designIdea === query.designIdea);
    }

    if (query.productName !== '') {
      filteredData = filteredData.filter((item: TableItem) => item.productName.includes(query.productName));
    }

    if (selectedCategory.value !== 'all') {
      const isRelatedValue = selectedCategory.value === '文创' ? 1 : 0;
      filteredData = filteredData.filter((item: TableItem) => item.isRelated === isRelatedValue);
    }

    // Calculate total count and update pageTotal
    pageTotal.value = filteredData.length;

    // Calculate startIndex and endIndex for pagination
    const startIndex = (query.pageIndex - 1) * query.pageSize;
    const endIndex = startIndex + query.pageSize;

    // Update tableData to display only the relevant range of items
    tableData.value = filteredData.slice(startIndex, endIndex).sort(compare);
  } catch (error) {
    console.error(error);
  }
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

const uploadData = async () => {
	console.log(tableData.value[idx])
	try {
		const response = await axios.put('http://42.192.39.198:5000/api/Products/' + tableData.value[idx].productId, tableData.value[idx]);
		ElMessage.success('数据上传成功');
	} catch (error) {
		ElMessage.error('数据上传失败');
	}
};

const uploadData1 = async () => {
	try {
		const response = await axios.post('http://42.192.39.198:5000/api/Products/', tableData.value[tableData.value.length - 1]);
		console.log(tableData.value[tableData.value.length - 1]);
		ElMessage.success('数据上传成功');
	} catch (error) {
		ElMessage.error('数据上传失败');
	}
};

const updateIsRelated = () => {
	if (addForm.isRelated === 1) {
		addForm.isRelated = 0;
	} else {
		addForm.isRelated = 1;
	}
};


const viewVisible = ref(false);
let viewForm = reactive({
	relatedCollectionId: 0,
	designIdea: '',
	isRelated: 0
});
const viewCreativeProduct = (index: number, row: any) => {
	viewForm.relatedCollectionId = row.relatedCollectionId;
	viewForm.designIdea = row.designIdea;
	viewForm.isRelated = row.isRelated;
	viewVisible.value = true;
};


// 删除操作
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

const saveDelete = async (index: number) => {
	try {
		const deletedItemId = tableData.value[index].productId;
		await axios.delete(`http://42.192.39.198:5000/api/Products/${deletedItemId}`);
		ElMessage.success('数据删除成功');
	} catch (error) {
		ElMessage.error('数据删除失败');
	}
};


// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	productName: '',
	price: 0,
	monthlySale: 0,
	designIdea: '',
	isRelated: 0,
	relatedCollectionId: 0
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.productName = row.productName;
	form.price = row.price;
	form.monthlySale = row.monthlySale;
	form.designIdea = row.designIdea;
	form.isRelated = row.isRelated;
	form.relatedCollectionId = row.relatedCollectionId;
	editVisible.value = true;
};
const saveEdit = () => {
	editVisible.value = false;
	ElMessage.success(`修改成功`);
	tableData.value[idx].productName = form.productName;
	tableData.value[idx].price = form.price;
	tableData.value[idx].monthlySale = form.monthlySale;
	tableData.value[idx].designIdea = form.designIdea;
	tableData.value[idx].relatedCollectionId = form.relatedCollectionId;
	tableData.value[idx].isRelated = form.isRelated;
	uploadData();
};

// 新增弹窗和保存
const addVisible = ref(false);
let addForm = reactive({
	productName: '',
	price: 0,
	monthlySale: 0,
	designIdea: '',
	isRelated: 0, // 默认选择非文创产品
	relatedCollectionId: 0
});

const handleAdd = () => {
	addVisible.value = true;
};
const saveAdd = () => {
	addVisible.value = false;
	const newItem = {
		productId: tableData.value.length + 1,
		productName: addForm.productName,
		price: addForm.price,
		monthlySale: addForm.monthlySale,
		designIdea: addForm.designIdea,
		isRelated: addForm.isRelated,
		relatedCollectionId: addForm.relatedCollectionId
	};
	addedData.value.push(newItem); // 将新增的数据保存到addedData数组中
	tableData.value.push(newItem);
	ElMessage.success('新增成功');
	uploadData1();
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