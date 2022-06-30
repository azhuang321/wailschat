<template>
    <div id="app">
        <router-view v-if="showView"/>
    </div>

</template>
<script>
import dayjs from 'dayjs';
import 'dayjs/plugin/advancedFormat.js';
import 'dayjs/plugin/customParseFormat.js';
import 'dayjs/plugin/duration';
import 'dayjs/plugin/arraySupport';
import 'dayjs/plugin/localeData.js';
import 'dayjs/plugin/weekOfYear.js';
import 'dayjs/plugin/isSameOrBefore.js';
import 'dayjs/plugin/isSameOrAfter.js';
import 'dayjs/plugin/dayOfYear.js';
import 'dayjs/plugin/weekYear.js';
import escapeHtml from 'escape-html';
// import '';


export default {
    name: 'App',
    data () {
        return {
            // 用于点击当前页的router时，刷新当前页
            showView: true
        };
    },
    mounted () {

    },
    methods: {
        // 刷新当前路由方法
        refreshView () {
            this.showView = false;
            this.$nextTick(() => (this.showView = true));
        }
    }
};

</script>
<script setup>
</script>
