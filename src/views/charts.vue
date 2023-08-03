<template>
	<div class="container">
		<!-- <div class="plugins-tips">
			vue-schart：vue.js封装sChart.js的图表组件。 访问地址：
			<a href="https://github.com/lin-xin/vue-schart" target="_blank">vue-schart</a>
		</div> -->
		
		<!--<div class="schart-box">
			<div class="content-title">折线图</div>
			<schart class="schart" canvasId="line" :options="options2"></schart>
		</div> -->
		<!-- <div class="schart-box">
			<div class="content-title">饼状图</div>
			<schart class="schart" canvasId="pie" :options="options3"></schart>
		</div> -->
		<h1>
			博物馆人数
		</h1>
		<div class="showPeo">
			<div class="txtBox">
			
				<!-- <p class="dqsd" >当前时段</p> -->
				<p class="dqsd" >在馆人数:{{ inAndOut.inData-inAndOut.outData }}/ {{inAndOut.maxPeople}} </p>
				<p class="rs">进馆人数:{{ inAndOut.inData }}</p>
	
				<p class="rs">出馆人数:{{ inAndOut.outData }}</p>
				
			</div>
			<div class="schart-box">
				<div class="content-title"></div> 
				
				<schart class="schart" canvasId="ring" :options="options4"></schart>
				<el-button type="primary" @click="test1">实时显示</el-button>
			</div>
			
		</div>
		<button @click="showThirty" v-show="vis.btn1vis">显示6天</button>
				<button @click="showSeven" v-show="vis.btn2vis">显示14天</button>

		<div class="showDayPeo" v-if="inAndOut.flag===1">
			<div class="schart-box2" v-if="vis.btn1vis">
				<div class="content-title">柱状图1</div>
				<schart class="schart2" canvasId="bar1" :options="options1"></schart>
			</div>
	
	
			<!-- <div class="schart-box2" v-if="vis.btn2vis">
				<div class="content-title">柱状图5</div>
				<schart class="schart2" canvasId="bar5" :options="options5"></schart>
			</div>		-->
		</div> 
	</div>


</template>

<script setup lang="ts" name="basecharts">
import Schart from 'vue-schart';
import axios from 'axios';
import { onBeforeUnmount,onMounted,watch,reactive, ref ,watchEffect, compile, onBeforeMount, onBeforeUpdate } from 'vue';

const showThirty=()=>{
	vis.btn2vis = true;
	vis.btn1vis = false;
	
}
const showSeven=()=>{
	vis.btn1vis = true;
	vis.btn2vis = false;
}
const timer1 = ref(0); // 创建一个引用变量来存储定时器
const test1=()=>{
	//unWatch();
	if(vis.endTime===true)
	{
		vis.endTime=false;
		vis.startTime=true;
		timer1.value = setInterval(myFunction, 1000); // 每隔一秒触发 myFunction 函数
	}
	else{
		vis.endTime=true;
		vis.startTime=false;
		clearInterval(timer1.value);
	}
	//clearInterval(timer1.value);
}
const vis= reactive({
	btn1vis:true,
	btn2vis:false,
	startTime:false,
	endTime:true,
});


interface listItem {
	date:string,
	inMuseumCount:number,
	totalTickets:number,
	soldTickets:number
};
const listData = ref<listItem[]>([]);
const listData2 = reactive<listItem[]>([]);
const inAndOut = reactive({
	inData:1000,
	outData:500,
	maxPeople:5000,
	flag:0,
	li1:[{date:"7.2",inData1:0},
	{date:"7.3",inData1:2000},
	{date:"7.4",inData1:1500},
	{date:"7.5",inData1:1800},
	{date:"7.3",inData1:2000},
	{date:"7.4",inData1:1500},]
	

});
const fetchData = async () => {
	try {
		const response = await axios.get('http://42.192.39.198:5000/api/VisitorStatistics/6');
		//const data = response.data;
		// console.log(response.data); 
		//listData.value = data.statisticsList;
		// //console.log(listData); 
		// for(let i=0;i<6;i++)
		// {
		// 	console.log(listData.value[i].date); 
		// 	console.log(listData.value[i].inMuseumCount); 
		// }
		
		return response.data;
	} catch (error) {
		console.error(error);
	}
};
fetchData();


const getData = async () => {
	const data = await fetchData();
	
	console.log(data); 
	listData.value = data.statisticsList;
	inAndOut.inData = listData.value[0].inMuseumCount;
	inAndOut.maxPeople = listData.value[0].totalTickets;

	listData2.concat(listData.value);

	for(let i=1;i<listData.value.length;i++)
	{
		inAndOut.li1[i-1].inData1 = listData.value[i].inMuseumCount;
	}
	inAndOut.flag=1;
	
	
};
getData();

const myFunction = () => {
      // 在这里编写你要执行的代码
	  //updateChart();
	  //options4.datasets[0].data = [inAndOut.inData-inAndOut.outData, inAndOut.totData-(inAndOut.inData-inAndOut.outData)];
	let num1=18;
	let num2=15;
	///var nowData=inAndOut.inData-inAndOut.outData;
	
	let nowData = inAndOut.inData -inAndOut.outData;
	if(nowData<600){
		inAndOut.inData+=Math.floor(Math.random()*(num1-10)+10);
		inAndOut.outData+=Math.floor(Math.random()*(num2-10)+10);
	}
	else{
		inAndOut.inData+=Math.floor(Math.random()*(num2-10)+10);
		inAndOut.outData+=Math.floor(Math.random()*(num1-10)+10);
	}
};

const options1 = {
	type: 'bar',
	title: {
		text: '1各品类销售图'
	},
	bgColor: '#fbfbfb',
	labels: ["8.1","8.2","8.3","8.4","8.2","8.3"],
	datasets: [
		// {
		// 	label: '家电',
		// 	fillColor: 'rgba(241, 49, 74, 0.5)',
		// 	data: [234, 278, 270, 190, 230]
		// },
		{
			label: '百货',
			
			 data: [inAndOut.li1[0].inData1, inAndOut.li1[1].inData1,inAndOut.li1[2].inData1, inAndOut.li1[3].inData1, inAndOut.li1[4].inData1,inAndOut.li1[5].inData1]
		},
		// {
		// 	label: '食品',
		// 	data: [144, 198, 150, 235, 120]
		// }
	]
};
// const options5 = {
// 	type: 'bar',
// 	title: {
// 		text: '5各品类销售图'
// 	},
// 	bgColor: '#fbfbfb',
// 	labels: [inAndOut.li2[0].date, inAndOut.li2[1].date, inAndOut.li2[2].date, inAndOut.li2[3].date,inAndOut.li2[4].date, inAndOut.li2[5].date, inAndOut.li2[6].date],
// 	datasets: [
// 		// {
// 		// 	label: '家电',
// 		// 	fillColor: 'rgba(241, 49, 74, 0.5)',
// 		// 	data: [234, 278, 270, 190, 230]
// 		// },
// 		{
// 			label: '百货',
// 			data: [inAndOut.li2[0].inData1, inAndOut.li2[1].inData1, inAndOut.li2[2].inData1, inAndOut.li2[3].inData1,inAndOut.li2[4].inData1, inAndOut.li2[5].inData1, inAndOut.li2[6].inData1]
// 		},
// 	]
// };

const options4 = reactive({
	type: 'ring',
	title: {
		text: ''
	},
	showValue: true,
	legend: {
		position: 'bottom',
		bottom: 40
	},
	bgColor: '#fff',
	labels: ['在馆人数', '馆内剩余容量'],
	datasets: [
		{
			data:  [inAndOut.inData-inAndOut.outData, inAndOut.maxPeople-(inAndOut.inData-inAndOut.outData)],
		}
	],
});
const unWatch=watch(inAndOut, () => {
      updateChart();
   }, { deep: true });



const updateChart = () => {
      // 在这里更新图表数据
      options4.datasets[0].data = [inAndOut.inData-inAndOut.outData, inAndOut.maxPeople-(inAndOut.inData-inAndOut.outData)];
	  options1.datasets[0].data = [inAndOut.li1[0].inData1, inAndOut.li1[1].inData1,inAndOut.li1[2].inData1, inAndOut.li1[3].inData1, inAndOut.li1[4].inData1,inAndOut.li1[5].inData1];
};

// onBeforeUnmount(() => {
// 	//show.showRing = false;
//    // 清除定时器
//    //clearInterval(timer1.value); 
//    //clearTimeout(timer1.value)

//    unWatch();
  
// });


</script>
<style scoped>

.showPeo{
	height:380px;
	
	position: relative;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
.showPeo .txtBox{
	display: inline-block;
	position: relative;
	height:320px;

	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
} 
p.dqsd{
	height:100px;
	font-size: 50px;
}
p.rs{
	height:100px;
	font-size: 40px;
}



.schart-box {
	display: inline-block;
	position: absolute;
	left:500px;
	width: 600px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
	/*left:1000px;*/
	
}
.schart {
	width: 600px;
	height: 340px;
}


.showDayPeo
{
	margin-top: 50px;
	position: relative;
	height:600px;
}
.schart-box2 {
	display: inline-block;
	position: absolute;
	
	width: 100%;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
	/*left:1000px;*/
	
}
.schart2 {
	width: 100%;
	height: 340px;
}
.content-title {
	clear: both;
	font-weight: 400;
	line-height: 50px;
	margin: 10px 0;
	font-size: 22px;

}
</style>
