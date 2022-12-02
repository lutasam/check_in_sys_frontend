<template>
  <div class="container">
    <el-form :inline="true" :model="searchFormInline" class="demo-form-inline">
      <el-form-item label="商品名">
        <el-input v-model="searchFormInline.name" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="学校">
        <el-select v-model="formInline.region" placeholder clearable>
          <el-option label="南京航空航天大学" value="nuaa"></el-option>
          <el-option label="南京理工大学" value="nust"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="warning" icon="el-icon-refresh" @click="handleReset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="商品序号"></el-table-column>
      <el-table-column prop="name" label="商品名"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="count" label="数量"></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <el-image
            lazy
            style="width: 50px; height: 50px;border-radius: 5px"
            :src="scope.row.img"
            :preview-src-list="scope.row.srcList"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="danger">异常</el-tag>
          <el-tag v-else type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="入库时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            plain
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="this.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { findCommodities, deleteCommodity } from "../../api/commodity";
export default {
  name: "commodity",
  data() {
    return {
      tableData: [
        {
          id: "123456",
          name: "apple",
          price: 3.5,
          date: "2020-10-01",
          count: 5,
          img: "https://www.qihuishou.club/images/logo.png",
          srcList: ["https://www.qihuishou.club/images/logo.png"],
          status: 1,
        },
        {
          id: "123456",
          name: "apple",
          price: 3.5,
          date: "2020-10-01",
          count: 5,
          img: "https://www.qihuishou.club/images/logo.png",
          srcList: ["https://www.qihuishou.club/images/logo.png"],
          status: 1,
        },
        {
          id: "123456",
          name: "apple",
          price: 3.5,
          date: "2020-10-01",
          count: 5,
          img: "https://www.qihuishou.club/images/logo.png",
          srcList: ["https://www.qihuishou.club/images/logo.png"],
          status: 0,
        },
        {
          id: "123456",
          name: "apple",
          price: 3.5,
          date: "2020-10-01",
          count: 5,
          img: "https://www.qihuishou.club/images/logo.png",
          srcList: ["https://www.qihuishou.club/images/logo.png"],
          status: 1,
        },
      ],
      total: 4,
      pageSize: 10,
      currentPage: 1,
      searchFormInline: {
        name: "",
      },
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.loadData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.loadData();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSearch() {
      this.loadData();
    },
    handleReset() {
      this.formInline.name = "";
      this.loadData();
    },
    handleEdit(row) {
      console.log(row);
    },
    handleDelete(row) {
      console.log(row);
      let params = {
        id: row.id,
      };
      deleteCommodity(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("删除成功！");
          this.loadData();
          return;
        } else {
          this.$message.error(res.msg);
          return;
        }
      });
    },
    loadData() {
      let params = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        search_name: this.searchFormInline.name,
      };
      findCommodities(params).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.commodity_vos;
          this.total = res.data.total;
          return;
        } else {
          this.$message.error(res.msg);
          return;
        }
      });
    },
  },
};
</script>

<style scoped></style>
