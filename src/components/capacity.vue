<template>
    <div id="main" :style="{ width: '600px', height: '300px' }"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
    props: {
        onSet: {
            type: Number as PropType<number>,
            required: true,
        },
    },
    setup(props) {
        const validOnSet = typeof props.onSet === 'number' ? props.onSet : 0;
        let table_data = [
            { value: validOnSet, name: '在馆人数' },
            { value: 500, name: '剩余容量' },
        ];
        const option = {
            title: {
                text: '展厅容量统计'
            },
            scale: true,
            legend: {
                top: '5%',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },

            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: table_data
                }
            ]
        };


        onMounted(() => {
            let myChart = echarts.init(document.getElementById('main'));
            myChart.setOption(option);
            setInterval(() => {
                table_data[0].value = table_data[0].value + Math.random() * 10;
                myChart.setOption(option);
            }, 1000);
            // 自适应
            window.onresize = function () {
                myChart.resize()
            }
        })
        
        return {}
    },
})
</script>
