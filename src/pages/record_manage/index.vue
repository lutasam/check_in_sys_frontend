<template>
  <div class="container">
    <el-form :inline="true" :model="searchFormInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchFormInline.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="打卡状态">
        <el-select v-model="searchFormInline.today_record_status" placeholder clearable>
          <el-option label="已打卡" key="已打卡" value=true></el-option>
          <el-option label="未打卡" key="未打卡" value=false></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="健康码">
        <el-select v-model="searchFormInline.today_health_code_status" placeholder clearable>
          <el-option label="绿码" value=1></el-option>
          <el-option label="灰码" value=2></el-option>
          <el-option label="黄码" value=3></el-option>
          <el-option label="红码" value=4></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-upload2" @click="handleNoticeAllUserNotRecord"
        >一键提醒打卡</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="tableData"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="用户id"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="department" label="部门"></el-table-column>
      <el-table-column prop="today_record_status" label="打卡状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.today_record_status === false" type="danger">未打卡</el-tag>
          <el-tag v-else type="success">已打卡</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="today_health_code_status" label="健康码">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.today_health_code_status === '绿码'" type="success">{{ scope.row.today_health_code_status }}</el-tag>
          <el-tag v-else type="danger" >{{ scope.row.today_health_code_status }}</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column label="商品图片">-->
<!--        <template slot-scope="scope">-->
<!--          <el-image-->
<!--            lazy-->
<!--            style="width: 50px; height: 50px;border-radius: 5px"-->
<!--            :src="scope.row.img"-->
<!--            :preview-src-list="scope.row.srcList"-->
<!--          ></el-image>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="商品状态">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag v-if="scope.row.status === 0" type="danger">异常</el-tag>-->
<!--          <el-tag v-else type="success">正常</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="updated_at" label="上传时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            @click="openDetailDlg(scope.row)"
            >查看详情</el-button
          >
          <el-button
            size="mini"
            plain
            type="danger"
            @click="handleNotice(scope.row)"
            >提醒打卡</el-button
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

    <!-- 详情窗口 -->
    <el-dialog
        :visible.sync="isDetailDlgVisiable"
        :modal-append-to-body="false"
        width="30%"
    >
      <div class="right-wrapper">
        <el-form ref="detailRef" :model="detailForm"  label-width="80px">
          <div class="login-title">打卡记录</div>
          <el-form-item style="margin-top: 20px" prop="id"  label="记录ID">
            <el-input
                v-model="detailForm.id"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-s-order
"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="user_id"  label="用户ID">
            <el-input
                v-model="detailForm.user_id"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="address" label="地址">
            <el-input
                v-model="detailForm.address"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-s-order"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="temperature_range" label="体温">
            <el-input
                v-model="detailForm.temperature_range"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-warning-outline"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="is_healthy" label="健康状态">
            <el-radio-group v-model="detailForm.is_healthy" size="large" style="width: 300px">
              <el-radio :label="true">健康</el-radio>
              <el-radio :label="false">不健康</el-radio>
            </el-radio-group>
<!--            <el-input-->

<!--                prefix-icon="el-icon-lock"-->
<!--            ></el-input>-->
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="health_code_status" label="健康码">
            <el-input
                v-model="detailForm.health_code_status"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-star-off"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="remark" label="备注">
            <el-input
                v-model="detailForm.remark"
                size="large"
                style="width: 300px"
                type="textarea"
                prefix-icon="el-icon-document-copy"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="appendix" label="附件">
            <div style="width: 300px">{{ this.detailForm.appendix }}</div>
            <el-button
                type="primary"
                style="width: 300px"
                size="large"
                @click="handleDownloadFile"
                :disabled="!isAppendixExist"
            >下载</el-button>
          </el-form-item>
<!--          <el-form-item style="margin-top: 20px" prop="appendix">-->
<!--            <el-input-->
<!--                v-model="detailForm.appendix"-->
<!--                size="large"-->
<!--                style="width: 300px"-->
<!--                prefix-icon="el-icon-lock"-->
<!--                :disabled="true"-->
<!--            ></el-input>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {findAllUserStatus} from "../../api/user";
import {findUserTodayRecord, noticeAllUserNotFinishRecord, noticeUserFinishRecord} from "../../api/record";
import {downloadFile} from "../../api/file";
import fileDownload from 'js-file-download';
export default {
  name: "record_manage",
  data() {
    return {
      isDetailDlgVisiable: false,
      isAppendixExist: false,
      tableData: [
        {
          "id": "10010",
          "name": "大白",
          "department": "计算机22级",
          "today_record_status": true,
          "today_health_code_status": "灰码",
          "updated_at": "2022-12-04 20:26:49"
        },
      ],
      detailForm: {
        id: "",
        user_id: "",
        address: "",
        temperature_range: "",
        is_healthy: null,
        health_code_status: "",
        remark: "",
        appendix: "",
      },
      total: 4,
      pageSize: 10,
      currentPage: 1,
      searchFormInline: {
        name: "",
        today_record_status: null,
        today_health_code_status: null,
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
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
    handleSearch() {
      this.loadData();
    },
    handleReset() {
      this.searchFormInline.name = "";
      this.searchFormInline.today_health_code_status = null;
      this.searchFormInline.today_record_status = null;
      this.loadData();
    },
    openDetailDlg(row) {
      let params = {
        user_id: row.id
      };
      console.log(row.id);
      findUserTodayRecord(params).then((res) => {
        if (res.code === 200 && res.data.user_record.id !== "0") {
          this.detailForm = res.data.user_record;
          this.isDetailDlgVisiable = true;
          console.log(res.data.user_record);
          if (res.data.user_record.appendix !== "") {
            this.isAppendixExist = true;
          }
        } else if (res.data.user_record.id === "0"){
          this.$message.error("该用户今日还未打卡!");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleNotice(row) {
      let params = {
        user_id: row.id
      };
      noticeUserFinishRecord(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("提醒成功!");
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    handleNoticeAllUserNotRecord() {
      this.$confirm('确定要提醒所有用户吗？', '提示', {
        iconClass: 'el-icon-question',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: true,
        type: 'warning'
      }).then(function() {
        // 确认
        let params = {};
        noticeAllUserNotFinishRecord(params).then((res) => {
          if (res.code === 200) {
            this.$message.success("提醒成功!");
          } else {
            this.$message.error(err.msg);
          }
        });
      }).then((data) => {
        // 取消
      })
    },
    handleDownloadFile(){
      let params = {
        filename: this.detailForm.appendix
      };
      downloadFile(params).then((res) => {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        //下载后文件名
        let fileName = this.detailForm.appendix
        let  downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob) //创建下载的链接
        downloadElement.href = href
        downloadElement.download = fileName
        document.body.appendChild(downloadElement)
        downloadElement.click() //点击下载
        document.body.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放掉blob对象
      });
    },
    loadData() {
      let params = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        name: this.searchFormInline.name,
        need_record_status: this.searchFormInline.today_record_status !== null,
        today_record_status: this.searchFormInline.today_record_status === null ? false : this.searchFormInline.today_record_status === "true",
        today_health_code_status: Number(this.searchFormInline.today_health_code_status)
      };
      findAllUserStatus(params).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.user_statuses;
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
