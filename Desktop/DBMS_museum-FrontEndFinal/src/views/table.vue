 <template>
	<div>
		<div id="main" style="width: 100%; height: 400px;"></div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="query.address" placeholder="展厅位置" class="handle-select mr10">
    <el-option key="1" label="全部" value="全部"></el-option>
    <el-option key="2" label="安楼" value="安楼"></el-option>
    <el-option key="3" label="博楼" value="博楼"></el-option>
    <el-option key="4" label="诚楼" value="诚楼"></el-option>
	<el-option key="5" label="德楼" value="德楼"></el-option>
</el-select>

				<el-input v-model="query.name" placeholder="展厅名称" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="exhibitionHallId" label="展厅ID" width="55" align="center"></el-table-column>
				<el-table-column prop="exhibitionHallName" label="展厅名称"></el-table-column>
				<el-table-column prop="exhibitionHallTheme" label="展厅主题"></el-table-column>
				
        <!-- <el-table-column prop="exhibits_amount" label="展品数量"></el-table-column>
        	<el-table-column prop="activity_amount" label="活动数量"></el-table-column> -->
				<el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.exhibitionHallStatus === '运营中' ? 'success' : scope.row.exhibitionHallStatus === '闲置中' ? 'danger' : ''"
						>
							{{ scope.row.exhibitionHallStatus }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="exhibitionHallPosition" label="展厅位置"></el-table-column>

				<el-table-column prop="collections" label="展品"></el-table-column>

				<el-table-column label="操作" width="300" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
							删除
						</el-button>	
						<!-- <el-button text :icon="More" @click="goToDetail(scope.row.name)">
                            详情
                        </el-button> -->
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
				<el-form-item label="展厅名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="展厅位置">
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
				<el-form-item label="展厅名称">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="展厅主题">
					<el-input v-model="addForm.theme"></el-input>
				</el-form-item>
        <el-form-item label="状态">
					<el-select v-model="addForm.state" placeholder="状态">
						<el-option key="1" label="营业中" value="营业中"></el-option>
						<el-option key="2" label="闲置中" value="闲置中"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="展厅位置">
					<el-input v-model="addForm.position"></el-input>
				</el-form-item>
				<el-form-item label="展品">
					<el-input v-model="addForm.collection"></el-input>
				</el-form-item>
        <!-- <el-form-item label="展品数量">
					<el-input v-model="addForm.exhibits_amount"></el-input>
				</el-form-item>
         <el-form-item label="活动数量">
					<el-input v-model="addForm.activity_amount"></el-input>
				</el-form-item>				 -->
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



<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Sort, More } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import axios from 'axios'
import * as echarts from 'echarts';


const fetchData = async () => {
	try {
		const response = await axios.get('http://42.192.39.198:5000/api/ExhibitionHall');
		console.log(response.data); 
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

interface TableItem {
	exhibitionHallId: number;
	exhibitionHallName: string;
	exhibitionHallTheme:string;
	exhibitionHallStatus: string;
	exhibitionHallPosition: string;
	collections:string[];
// 	exhibits_amount:number;
//   activity_amount:number;
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
	const compare = (a:TableItem,b:TableItem)=>{
	return a.exhibitionHallId < b.exhibitionHallId ? -1:1;
	}

// 获取表格数据
const getData = async () => {
	const res = await fetchData();
	let filteredData = res.concat(addedData.value);
	//if (query.designIdea !== '') {
		//filteredData = filteredData.filter((item: TableItem) => item.designIdea === query.designIdea);
	//}
	if (query.name !== '') {
		filteredData = filteredData.filter((item: TableItem) => item.exhibitionHallName.includes(query.name));
	}

	tableData.value = filteredData.sort(compare);
	console.log(JSON.stringify(tableData.value));

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

const uploadData = async (id:number, data:any) => {
    try {
		const response = await axios.put(`http://42.192.39.198:5000/api/ExhibitionHall/${id}`, data);
        ElMessage.success('数据上传成功');
    } catch (error) {
        ElMessage.error('数据上传失败');
    }
};

const uploadData1 = async (data:any) => {
    try {
        const response = await axios.post('http://42.192.39.198:5000/api/ExhibitionHall', data);
        ElMessage.success('数据上传成功');
    } catch (error) {
        ElMessage.error('数据上传失败');
    }
};

// 请求删除数据到服务器
const deleteData = async (id:number) => {
  try {
    const response = await axios.delete(`http://42.192.39.198:5000/api/ExhibitionHall/${id}`);
    ElMessage.success('数据删除成功');
  } catch (error) {
    ElMessage.error('数据删除失败');
  }
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
	.then(async () => {
      ElMessage.success('删除成功');
      const itemId = tableData.value[index].exhibitionHallId;
      tableData.value.splice(index, 1);
      await deleteData(itemId);
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

const saveEdit = async () => {
	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].exhibitionHallName = form.name;
	tableData.value[idx].exhibitionHallPosition = form.address;
	await uploadData(tableData.value[idx].exhibitionHallId, tableData.value[idx]);
};

// 新增弹窗和保存
const addVisible = ref(false);
let addForm = reactive({
    name: '',
    theme: '',
    state: '',
    position: '',
	collection:[] as string[]
    // exhibits_amount: 0,
    // activity_amount: 0,
});
const handleAdd = () => {
    addVisible.value = true;
};
const saveAdd = async () => {
    addVisible.value = false;
    const newItem = {
        exhibitionHallId: tableData.value.length + 1,
        exhibitionHallName: addForm.name,
        exhibitionHallTheme: addForm.theme,
        exhibitionHallStatus: addForm.state,
        exhibitionHallPosition: addForm.position,
		collections:addForm.collection
        // exhibits_amount: addForm.exhibits_amount,
        // activity_amount: addForm.activity_amount,
       
    };

    addedData.value.push(newItem); // 将新增的数据保存到addedData数组中
    tableData.value.push(newItem);
    ElMessage.success('新增成功');
	await uploadData1(newItem);
};

// // 详情页面跳转
// const router = useRouter();
// const goToDetail = (name:string) => {
// 	router.push( {name:'collections',params:{name}} );
// };

onMounted(() => {
  // 获取图表容器
  const chartDom = document.getElementById('main');

  // 使用 ECharts 初始化图表
  const myChart = echarts.init(chartDom);

  // ECharts 配置选项
  const option = {
    series: [
      {
        type: 'treemap',
        clickable: true,
        data: [
          {
            name: 'nodeA',
            value: 10,
            children: [
              {
                name: 'nodeAa',
                value: 4,
              },
              {
                name: 'nodeAb',
                value: 6,
              },
            ],
          },
          {
            name: 'nodeB',
            value: 20,
            children: [
              {
                name: 'nodeBa',
                value: 20,
                children: [
                  {
                    name: 'nodeBa1',
                    value: 20,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  // 使用配置选项设置图表
  myChart.setOption(option);

  // 监听点击事件
  myChart.on('click', function (params) {
    // 检查是否点击了有效的图表元素
	console.log('Click event params:',params.data);

    if (params.data.name === 'nodeBa1') {
      // 在这里执行路由导航或其他跳转操作
      // 示例中使用 Vue Router 进行导航
	 
      const router = useRouter();
      router.push({ name: 'collections', params: { nodeName: 'nodeBa1' } });
    }
  });

  // 在组件销毁前销毁 ECharts 实例
  onBeforeUnmount(() => {
    console.log('Component is unmounted. Disposing ECharts instance.');
    myChart.dispose();
  });
});

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