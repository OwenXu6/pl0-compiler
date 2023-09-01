
<script setup>
import dynamicChart from '../components/dynamicChart.vue'
import capacity from '../components/capacity.vue'
const test = 500;

</script>

<template>
    <div class='ad'>
        <capacity :onSet = "test"></capacity>
        <dynamicChart :onSet="test"></dynamicChart>
    </div>
</template>