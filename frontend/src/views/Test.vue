<template>
    <!--  <el-row class="mb-4">-->
    <!--    <el-button>Default</el-button>-->
    <!--    <el-button type="primary">Primary</el-button>-->
    <!--    <el-button type="success">Success</el-button>-->
    <!--    <el-button type="info">Info</el-button>-->
    <!--    <el-button type="warning">Warning</el-button>-->
    <!--    <el-button type="danger">Danger</el-button>-->
    <!--    <el-button>中文</el-button>-->
    <!--  </el-row>-->

    <!--  <el-row class="mb-4">-->
    <!--    <el-button plain>Plain</el-button>-->
    <!--    <el-button type="primary" plain>Primary</el-button>-->
    <!--    <el-button type="success" plain>Success</el-button>-->
    <!--    <el-button type="info" plain>Info</el-button>-->
    <!--    <el-button type="warning" plain>Warning</el-button>-->
    <!--    <el-button type="danger" plain>Danger</el-button>-->
    <!--  </el-row>-->

    <!--  <el-row class="mb-4">-->
    <!--    <el-button round>Round</el-button>-->
    <!--    <el-button type="primary" round>Primary</el-button>-->
    <!--    <el-button type="success" round>Success</el-button>-->
    <!--    <el-button type="info" round>Info</el-button>-->
    <!--    <el-button type="warning" round>Warning</el-button>-->
    <!--    <el-button type="danger" round>Danger</el-button>-->
    <!--  </el-row>-->

    <el-row>
        <el-button :icon="Search" circle />
        <el-button type="primary" :icon="Edit" circle />
        <el-button type="success" :icon="Check" circle />
        <el-button type="info" :icon="Message" circle />
        <el-button type="warning" :icon="Star" circle />
        <el-button type="danger" :icon="Delete" circle />
    </el-row>

    <!--  <el-icon color="#000" size="225">-->
    <!-- 自动导入必须遵循名称格式 {prefix：默认为i}-{collection：图标集合的名称}-{icon：图标名称}  -->
    <!--    <i-ep-expand />-->
    <!--  </el-icon>-->

    <!--  <el-icon><i-ep-AddLocation /></el-icon>-->

    <grid-layout
        v-model:layout="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
    >
        <grid-item
            v-for="item in layout"
            :key="item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
        >
            {{ item.i }}
        </grid-item>
    </grid-layout>
</template>

<script>
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue';
import VueGridLayout from 'vue-grid-layout';
export default {
    name: 'Index',
    components: {
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem
    },
    setup() {
        return {
            Check,
            Delete,
            Edit,
            Message,
            Search,
            Star
        };
    },
    data: function () {
        return {
            layout: [
                { x: 0, y: 0, w: 2, h: 2, i: '0' },
                { x: 2, y: 0, w: 2, h: 4, i: '1' },
                { x: 4, y: 0, w: 2, h: 5, i: '2' },
                { x: 6, y: 0, w: 2, h: 3, i: '3' },
                { x: 8, y: 0, w: 2, h: 3, i: '4' },
                { x: 10, y: 0, w: 2, h: 3, i: '5' },
                { x: 0, y: 5, w: 2, h: 5, i: '6' },
                { x: 2, y: 5, w: 2, h: 5, i: '7' },
                { x: 4, y: 5, w: 2, h: 5, i: '8' },
                { x: 6, y: 3, w: 2, h: 4, i: '9' },
                { x: 8, y: 4, w: 2, h: 4, i: '10' },
                { x: 10, y: 4, w: 2, h: 4, i: '11' },
                { x: 0, y: 10, w: 2, h: 5, i: '12' },
                { x: 2, y: 10, w: 2, h: 5, i: '13' },
                { x: 4, y: 8, w: 2, h: 4, i: '14' },
                { x: 6, y: 8, w: 2, h: 4, i: '15' },
                { x: 8, y: 10, w: 2, h: 5, i: '16' },
                { x: 10, y: 4, w: 2, h: 2, i: '17' },
                { x: 0, y: 9, w: 2, h: 3, i: '18' },
                { x: 2, y: 6, w: 2, h: 2, i: '19' }
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
.vue-grid-item {
    background-color: red;
}
</style>
