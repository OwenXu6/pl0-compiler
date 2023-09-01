<template>
	<div>
		<div class="container">
			<div class="form-box"> <!--包裹表单元素-->
				<el-form ref="ruleFormRef" :model="form" label-width="110px" label-position="left" :rules="rules">
					<!--el-form-item label="文物编号" prop="CollectionID">
						<el-input v-model="form.CollectionID" placeholder="请输入文物编号" class="handle-input mr10"></el-input>
					</el-form-item-->
					<!--文物编码：表示文物的唯一性编码，计算机生成的代码，在录入文物信息时生成-->

					<el-form-item label="文物原名" prop="OriginalName">
						<el-input v-model="form.OriginalName" placeholder="请输入文物原名" class="handle-input mr10"></el-input>
					</el-form-item>

					<el-form-item label="文物类别" prop="CollectionType">
						<el-autocomplete v-model="form.CollectionType" :fetch-suggestions="typeQuerySearch" clearable
							class="inline-input w-50" placeholder="请输入文物的种类" @select="typeHandleSelect" />
					</el-form-item>

					<el-form-item label="是否已考证" prop="Researched">
						<el-select v-model="form.Researched" class="handle-select mr10" required>
							<el-option key="1" label="已考证" value="1"></el-option>
							<el-option key="2" label="未考证" value="0"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item v-if="form.Researched === '1'" label="文物年代" prop="Era">
						<el-autocomplete v-model="form.Era" :fetch-suggestions="eraQuerySearch" clearable
							class="inline-input w-50" placeholder="请输入文物的年代" @select="eraHandleSelect" />
					</el-form-item>

					<el-form-item v-if="form.Researched === '1'" label="文物地域" prop="Area">
						<el-input v-model="form.Area" placeholder="请输入文物地域" class="handle-input mr10"></el-input>
					</el-form-item>

					<el-form-item v-if="form.Researched === '1'" label="文物质地类别" prop="TextureType">
						<el-select v-model="form.TextureType" class="handle-select mr10" required>
							<el-option key="1" label="无机质质地" value="无机质质地"></el-option>
							<el-option key="2" label="有机质质地" value="有机质质地"></el-option>
							<el-option key="2" label="复合材料质地" value="复合材料质地"></el-option>
							<el-option key="2" label="组合材料质地" value="组合材料质地"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item v-if="form.Researched === '1'" label="文物完残程度" prop="CompletenessType">
						<el-select v-model="form.CompletenessType" class="handle-select mr10" required>
							<el-option key="1" label="完" value="无完"></el-option>
							<el-option key="2" label="残" value="残"></el-option>
							<el-option key="2" label="缺" value="缺"></el-option>
							<el-option key="2" label="失" value="失"></el-option>
						</el-select>
					</el-form-item>



					<el-form-item label="文物在库/在展" prop="Location">
						<el-select v-model="form.Location" class="handle-select mr10" required>
							<el-option key="1" label="在库" value="1"></el-option>
							<el-option key="2" label="在展" value="0"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item v-if="form.Location === '1'" label="所在仓库编号" prop="StorageID">
						<el-input v-model="form.StorageID" placeholder="请输入文物所在仓库编号" class="handle-input mr10"></el-input>
					</el-form-item>

					<el-form-item v-if="form.Location === '0'" label="所在展厅编号" prop="ExhibitionHallID">
						<el-input v-model="form.ExhibitionHallID" placeholder="请输入文物所在展厅编号"
							class="handle-input mr10"></el-input>
					</el-form-item>

					<el-form-item label="文物图片URL" prop="CollectionPhoto">
						<el-input v-model="form.CollectionPhoto" placeholder="请输入文物图片URL"
							class="handle-input mr10"></el-input>
					</el-form-item>

					<!--el-form-item label="单位编码" prop="CollectionID">
						<el-input v-model="form.MuseumID" placeholder="请输入单位编码" class="handle-input mr10"></el-input>
					</el-form-item-->
					<!--单位编码：登记信息时文物所在文博收藏单位的编码，在登入系统时已经确定-->

					<el-form-item>
						<el-button type="primary" @click="submitForm(ruleFormRef)">
							提交
						</el-button>
						<el-button @click="resetForm(ruleFormRef)">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import { onMounted } from 'vue'
import axios from 'axios';
import type { FormInstance, FormRules } from 'element-plus'

let form = reactive({
	CollectionID: null,
	OriginalName: '',
	Name: '',
	CollectionType: '',
	Era: '',
	Area: '',
	TextureType: '',
	CompletenessType: '',
	MuseumID: null,
	CollectionPhoto: '',
	ExhibitionHallID: '',
	StorageID: '',
	Researched: null,
	Location: ''
});

const ruleFormRef = ref<FormInstance>()

interface TableItem {
	CollectionID: number,
	OriginalName: string,
	Name: string,
	CollectionType: string,
	Era: string,
	Area: string,
	TextureType: string,
	CompletenessType: string,
	MuseumID: number,
	CollectionPhoto: string,
	ExhibitionHallID: string,
	StorageID: string
}

const rules = {
	CollectionID: [
		{ required: true, message: '文物编号不能为空', trigger: 'blur' },
	],
	OriginalName: [
		{ required: true, message: '文物原名不能为空', trigger: 'blur' },
	],
	CollectionType: [
		{ required: true, message: '文物类别不能为空', trigger: 'change' },
	],
	Researched: [
		{ required: true, message: '是否已考证不能为空', trigger: 'change' },
	],
	Era: [
		{ required: true, message: '文物年代不能为空', trigger: 'change' },
	],
	Location: [
		{ required: true, message: '文物在展/在库不能为空', trigger: 'change' },
	],
	// 其他表单项的验证规则...
};


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  const valid = await formEl.validate();
  if (valid) {
    try {
      const response = await axios.post('http://42.192.39.198:5000/api/Collections', form);
      console.log(response.data); // 假设后端返回提交结果的数据
      // 处理提交结果，可以显示成功消息或进行相应的跳转
    } catch (error) {
      console.error(error);
      // 处理请求错误，比如显示错误消息
    }
  } else {
    console.log('error submit!');
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
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
		.catch(() => { });
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


