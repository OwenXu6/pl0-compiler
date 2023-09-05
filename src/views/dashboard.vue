<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20" style="height: 252px">
					<div class="user-info">
						<el-avatar :size="120" :src="imgurl" />
						<div class="user-info-cont">
							<div class="user-info-name">{{ name }}</div>
							<div>{{ role }}</div>
						</div>
					</div>
					<div class="user-info-list">
						上次登录时间：
						<span>2022-10-01</span>
					</div>
					<div class="user-info-list">
						上次登录地点：
						<span>东莞</span>
					</div>
				</el-card>
				<el-card class="ringbox" shadow="hover" style="height: 330px">
					<schart class="ringschart" canvasId="ring" :options="options4"></schart>
					<button class="btn" @click="realTime">实时显示</button>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-1">
								<el-icon class="grid-con-icon">
									<User />
								</el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">1234</div>
									<div>用户访问量</div>
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
									<div class="grid-num">321</div>
									<div>系统消息</div>
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
									<div class="grid-num">5000</div>
									<div>商品数量</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-card shadow="hover" style="height: 403px">
					<template #header>
						<div class="clearfix">
							<span>待办事项</span>
							<el-button style="float: right; padding: 3px 0" text @click="addTodo">添加</el-button>
						</div>
					</template>

					<div class="todo-list-container">
						<el-table :show-header="false" :data="todoList" style="width: 100%">
							<el-table-column width="40">
								<template #default="scope">
									<el-checkbox v-model="scope.row.status"></el-checkbox>
								</template>
							</el-table-column>
							<el-table-column>
								<template #default="scope">
									<div class="todo-item" :class="{ 'todo-item-del': scope.row.status }">
										{{ scope.row.title }}
									</div>
									<el-button @click="viewTodo(scope.row)" size="mini">查看</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-card>

			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
				</el-card>
			</el-col>
		</el-row>

	</div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from 'vue-schart';
import { reactive, ref, watch } from 'vue';
import imgurl from '../assets/img/img.jpg';
import { CENTERED_ALIGNMENT } from 'element-plus/es/components/virtual-list/src/defaults';

const viewTodo = (todo) => {
	// 在这里处理查看待办事项的逻辑，你可以在控制台输出待办事项内容
	console.log('查看待办事项:', todo);
};



const name = localStorage.getItem('ms_username');
const role: string = name === 'admin' ? '超级管理员' : '普通用户';
const vis = reactive({
	btn1vis: true,
	btn2vis: false,
	startTime: false,
	endTime: true,
});
const timer1 = ref(0); // 创建一个引用变量来存储定时器
const realTime = () => {
	//unWatch();
	if (vis.endTime === true) {
		vis.endTime = false;
		vis.startTime = true;
		timer1.value = setInterval(myFunction, 1000); // 每隔一秒触发 myFunction 函数
	}
	else {
		vis.endTime = true;
		vis.startTime = false;
		clearInterval(timer1.value);
	}
	//clearInterval(timer1.value);
}
const myFunction = () => {
	// 在这里编写你要执行的代码
	//updateChart();
	//options4.datasets[0].data = [inAndOut.inData-inAndOut.outData, inAndOut.totData-(inAndOut.inData-inAndOut.outData)];
	let num1 = 18;
	let num2 = 15;
	///var nowData=inAndOut.inData-inAndOut.outData;

	let nowData = inAndOut.inData - inAndOut.outData;
	if (nowData < 600) {
		inAndOut.inData += Math.floor(Math.random() * (num1 - 10) + 10);
		inAndOut.outData += Math.floor(Math.random() * (num2 - 10) + 10);
	}
	else {
		inAndOut.inData += Math.floor(Math.random() * (num2 - 10) + 10);
		inAndOut.outData += Math.floor(Math.random() * (num1 - 10) + 10);
	}
};
const inAndOut = reactive({
	inData: 1000,
	outData: 500,
	maxPeople: 5000,
	flag: 0,
	li1: [{ date: "7.2", inData1: 0 },
	{ date: "7.3", inData1: 2000 },
	{ date: "7.4", inData1: 1500 },
	{ date: "7.5", inData1: 1800 },
	{ date: "7.6", inData1: 2000 },
	{ date: "7.7", inData1: 1500 },
	{ date: "7.8", inData1: 0 },
	{ date: "7.9", inData1: 2000 },
	{ date: "7.10", inData1: 1500 },
	{ date: "7.11", inData1: 1800 },
	{ date: "7.12", inData1: 2000 },
	{ date: "7.13", inData1: 1500 },
	{ date: "7.14", inData1: 2000 },
	{ date: "7.15", inData1: 1500 },]


});
const options4 = reactive({
	type: 'ring',
	title: {
		text: ''
	},
	showValue: true,
	legend: {
		position: 'bottom',
		bottom: 5
	},
	bgColor: '#fff',
	labels: ['在馆人数', '馆内剩余容量'],
	datasets: [
		{
			data: [inAndOut.inData - inAndOut.outData, inAndOut.maxPeople - (inAndOut.inData - inAndOut.outData)],
		}
	],
});

const unWatch = watch(inAndOut, () => {
	updateChart();
}, { deep: true });
const updateChart = () => {
	// 在这里更新图表数据
	options4.datasets[0].data = [inAndOut.inData - inAndOut.outData, inAndOut.maxPeople - (inAndOut.inData - inAndOut.outData)];
	//options1.datasets[0].data = [inAndOut.li1[0].inData1, inAndOut.li1[1].inData1,inAndOut.li1[2].inData1, inAndOut.li1[3].inData1, inAndOut.li1[4].inData1,inAndOut.li1[5].inData1];
};
const options = {
	type: 'bar',
	title: {
		text: '最近一周各品类销售图'
	},
	xRorate: 25,
	labels: ['周一', '周二', '周三', '周四', '周五'],
	datasets: [
		{
			label: '家电',
			data: [234, 278, 270, 190, 230]
		},
		{
			label: '百货',
			data: [164, 178, 190, 135, 160]
		},
		{
			label: '食品',
			data: [144, 198, 150, 235, 120]
		}
	]
};
const options2 = {
	type: 'line',
	title: {
		text: '最近几个月各品类销售趋势图'
	},
	labels: ['6月', '7月', '8月', '9月', '10月'],
	datasets: [
		{
			label: '家电',
			data: [234, 278, 270, 190, 230]
		},
		{
			label: '百货',
			data: [164, 178, 150, 135, 160]
		},
		{
			label: '食品',
			data: [74, 118, 200, 235, 90]
		}
	]
};
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

}
</style>
