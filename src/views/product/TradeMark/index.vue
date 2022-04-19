<template>
  <div>
    <!-- eslint-disable -->
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <!-- 表格组件 -->
    <el-table style="width:100%;margin:10px auto" border>
      <el-table-column prop="prop" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="prop" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width"></el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <el-pagination
      style="textAlign:center"
      :current-page="6"
      :total="99"
      :page-size="3"
      :pager-count="5"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, ->, sizes, total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TradeMark'
}
</script>
