<template>
  <div class="container">
    <el-row style="display: inline-block;">
      <el-col>
        <el-button type="primary" icon="el-icon-upload2" @click="openNoticeDlg"
        >发布通知</el-button
        >
      </el-col>
    </el-row>
    <el-table
        ref="tableData"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="admin_name" label="负责人"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
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

    <!-- 编辑窗口 -->
    <el-dialog
        :visible.sync="isNoticeDlgVisiable"
        :modal-append-to-body="false"
        width="30%"
    >
      <div class="right-wrapper">
        <el-form ref="noticeRef" :model="noticeForm" label-width="80px">
          <div class="login-title">发布通知</div>
          <el-form-item style="margin-top: 20px" prop="email"  label="内容">
            <el-input
                v-model="noticeForm.content"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-user"
                type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button
                type="primary"
                style="width: 300px"
                size="large"
                @click="handleNotice"
            >上传</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {deleteNotice, findAllNotices, uploadNotice} from "../../api/notice";
export default {
  name: "notice",
  data() {
    return {
      isNoticeDlgVisiable: false,
      tableData: [
        {
          id: "",
          date: "",
          admin_name: "",
          content: "",
        },
      ],
      noticeForm: {
        content: "",
      },
      total: 4,
      pageSize: 10,
      currentPage: 1,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadData();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.tableData.toggleRowSelection(row);
        });
      } else {
        this.$refs.tableData.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(row) {
      this.$confirm('确定要删除该通知吗？', '提示', {
        iconClass: 'el-icon-question',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: true,
        type: 'warning'
      }).then(() => {
        // 确认
        let params = {
          notice_id: row.id,
        };
        deleteNotice(params).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功！");
            this.loadData();
          } else {
            this.$message.error(res.msg);
          }
        });
      }).then((data) => {
        // 取消
      })
    },
    loadData() {
      let params = {
        current_page: this.currentPage,
        page_size: this.pageSize,
      };
      findAllNotices(params).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.notices;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    openNoticeDlg() {
      this.isNoticeDlgVisiable = true;
    },
    handleNotice() {
      if (this.noticeForm.content !== "") {
        let params = {
          content: this.noticeForm.content
        };
        uploadNotice(params).then((res) => {
          if (res.code === 200) {
            this.$message.success("发布成功!");
            this.isNoticeDlgVisiable = false;
            this.loadData();
          }
        })
      }
    },
  },
};
</script>

<style scoped>
.right-wrapper {
  flex: 1;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.login-title {
  width: 400px;
  text-align: center;
  font-size: 30px;
  margin-bottom: 40px;
}
</style>
