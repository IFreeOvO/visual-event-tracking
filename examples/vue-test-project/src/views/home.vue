<template>
    <div style="border:1px solid red;height: 200px;overflow: auto">
        <div style="min-height: 1000px">
            <div style="border: 1px dashed yellow;height: 50px" v-for="i in 1000" :key="i" :class='row'>{{ i }}<span>内容{{ i }}</span></div>
        </div>
        <div class='bottom'>底部</div>
    </div>
</template>

<script setup>

</script>

