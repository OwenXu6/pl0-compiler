<template>
	<div>
		<el-row gutter="20">
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20" style=" height: 220px">
					<div class="user-info">
						<el-avatar :size="100" :src="imgurl" />
						<div class="user-info-cont">
							<div class="user-info-name">{{ name }}</div>
							<div>{{ role }}</div>
						</div>
					</div>
					<div class="user-info-list">
						上次登录时间：
						<span>{{ new Date().toDateString() }}</span>
					</div>
					<div class="user-info-list">
						上次登录地点：
						<span>深圳</span>
					</div>
				</el-card>
			</el-col>
			<el-col :span="16"><capacity :onSet="inAndOut.onSet"></capacity></el-col>
				
		</el-row>
			<!-- <el-col :span="16"> -->
				<!-- <el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-1">
								<el-icon class="grid-con-icon">
									<User />
								</el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{ inAndOut.inData - inAndOut.outData }}/ {{ inAndOut.maxPeople }}
									</div>
									<div>在馆人数</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-2">
								<el-icon class="grid-con-icon">
									<ChatDotRound />
								</el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{ inAndOut.inData }}</div>
									<div>进馆人数</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-3">
								<el-icon class="grid-con-icon">
									<Goods />
								</el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{ inAndOut.outData }}</div>
									<div>出馆人数</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row> -->
				<!-- <el-card shadow="hover" style="height: 403px">
					<template #header>
						<div class="clearfix">
							<span>待办事项</span>
							<el-button style="float: right; padding: 3px 0" text @click="addTodo">添加</el-button>
						</div>
					</template>
					<el-table :show-header="false" :data="todoList" style="width: 100%">
						<el-table-column width="40">
							<template #default="scope">
								<el-checkbox v-model="scope.row.status"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope">
								<div class="todo-item" :class="{
									'todo-item-del': scope.row.status
								}">
									{{ scope.row.title }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-card> -->
			<!-- </el-col> -->	
		
		<el-row><dynamicChart :inData="inAndOut.inData" :outData="inAndOut.outData"></dynamicChart></el-row>

	</div>
</template>

<script setup lang="ts" name="dashboard">
import { reactive, ref, watch } from 'vue';
import imgurl from '../assets/img/img.jpg';
import { CENTERED_ALIGNMENT } from 'element-plus/es/components/virtual-list/src/defaults';
import dynamicChart from '../components/dynamicChart.vue'
import capacity from '../components/capacity.vue'

const viewTodo = (todo) => {
	// 在这里处理查看待办事项的逻辑，你可以在控制台输出待办事项内容
	console.log('查看待办事项:', todo);
};



const name = localStorage.getItem('ms_username');
const role: string = name === 'admin' ? '超级管理员' : '普通用户';

const inAndOut = reactive({
	inData: 0,
	outData: 0,
	onSet:0,
});
let inCount = 0;
let outCount = 0;
const stiIn = function () {
	return 5 + Math.round(Math.random() * 5);
};
const stiOut = function () {
	return Math.round(Math.random() * 5);
};

setInterval(() => {
	inAndOut.inData = stiIn();
	inAndOut.outData = stiOut();
	inAndOut.onSet += inAndOut.inData - inAndOut.outData;
}, 1000);

const todoList = reactive([
	{
		title: '今天要修复100个bug',
		status: false
	},
	{
		title: '今天要修复100个bug',
		status: false
	},
	{
		title: '今天要写100行代码加几个bug吧',
		status: false
	},
	{
		title: '今天要修复100个bug',
		status: false
	},
	{
		title: '今天要修复100个bug',
		status: true
	},
	{
		title: '今天要写100行代码加几个bug吧',
		status: true
	}
]);
</script>

<style scoped>

.todo-list-container {
  max-height: 300px; /* 设置合适的高度 */
  overflow-y: auto; /* 启用纵向滚动 */
}

.el-row {
	margin-bottom: 20px;
}

.grid-content {
	display: flex;
	align-items: center;
	height: 100px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #999;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	color: #fff;
}

.grid-con-1 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
	color: rgb(242, 94, 67);
}

.user-info {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 2px solid #ccc;
	margin-bottom: 20px;
}

.user-info-cont {
	padding-left: 50px;
	flex: 1;
	font-size: 14px;
	color: #999;
}

.user-info-cont div:first-child {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	font-size: 14px;
	color: #999;
	line-height: 25px;
}

.user-info-list span {
	margin-left: 70px;
}

.mgb20 {
	margin-bottom: 20px;
}

.todo-item {
	font-size: 14px;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.ringbox {}

.ringschart {
	left: 22%;
	width: 250px;
	height: 250px;
	position: relative;
}

.btn {

	height: 30px;
	width: 150px;
	position: relative;
	top: 15px;
	left: 32%;
	background-color: rgb(45, 140, 240);
	border: none;
	text-align: center;
	border-radius: 8px;
	color: white;
	font-size: 15px;

}</style>
