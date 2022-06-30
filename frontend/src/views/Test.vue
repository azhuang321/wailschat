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
</template>

<script>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star
} from '@element-plus/icons-vue';
export default {
  name: 'Index',
  setup () {
    return {
      Check,
      Delete,
      Edit,
      Message,
      Search,
      Star
    };
  }
};
</script>

<style scoped>

</style>
