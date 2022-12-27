<template>
  <div class="container">
    <div         v-if="this.isSuperAdmin">
      <el-table
          ref="tableData"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"

      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="部门ID"></el-table-column>
        <el-table-column prop="name" label="部门名"></el-table-column>
        <el-table-column prop="admin_name" label="管理员"></el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                plain
                type="primary"
                @click="openAddPermissionDlg(scope.row)"
            >分配权限</el-button
            >
            <el-button
                size="mini"
                plain
                type="danger"
                @click="handleRetrive(scope.row)"
            >收回权限</el-button
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

    <h1 v-else>您没有权限访问该界面!</h1>

    <!-- 添加权限窗口 -->
    <el-dialog
        :visible.sync="isAddPermissionDlgVisiable"
        :modal-append-to-body="false"
        width="30%"
    >
      <div class="right-wrapper">
        <el-form ref="addPermissionRef" :model="addPermissionForm" label-width="80px">
          <div class="login-title">分配权限</div>
          <el-form-item style="margin-top: 20px" prop="department_id"  label="部门ID">
            <el-input
                v-model="addPermissionForm.department_id"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-s-order"
                :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="name"  label="负责人">
            <el-cascader :options="users" v-model="addPermissionForm.admin_id" class="input-wrapper" size="large">
              <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button
                type="primary"
                style="width: 100%"
                size="large"
                @click="handleAddPermission"
            >分配权限</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {findAllAdmins, takeUserInfo} from "../../api/user";
import {addDepartmentPermission, deleteDepartmentPermission, findAllDepartments} from "../../api/department";
import {deleteNotice} from "@/api/notice";
export default {
  name: "department",
  data() {
    return {
      isAddPermissionDlgVisiable: false,
      isSuperAdmin: false,
      departments: [
        {value: "计算机19级", label: "计算机19级"},
      ],
      tableData: [
        {
          id: "1",
          name: "计算机19级",
          admin_name: "小马",
          created_at: "2022-12-04 20:19:48"
        },
      ],
      users: [
        { label: "小马", value: "10001"},
        { label: "小顾", value: "10002"},
      ],
      addPermissionForm: {
        department_id: "",
        admin_id: ""
      },
      total: 4,
      pageSize: 10,
      currentPage: 1,
      searchFormInline: {
        name: "",
        department: "",
      },
    };
  },
  created() {
    this.isSuperAdmin = localStorage.getItem("identity") === "2"
    if (this.isSuperAdmin) {
      this.loadData();
      this.loadDepartmentAdmins();
      // this.$message.error("您不是超级管理员，无权进入本模块!");
      // this.$router.push("/403");
    }
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
      this.searchFormInline.department = "";
      this.loadData();
    },
    openAddPermissionDlg(row) {
      console.log(row);
      this.isAddPermissionDlgVisiable = true;
      this.addPermissionForm.department_id = row.id;
      // let params = {
      //   user_id: row.user_id
      // };
      // takeUserInfo(params).then((res) => {
      //   if (res.code === 200) {
      //     this.addPermissionForm = res.data.user;
      //   } else {
      //     this.$message.error(res.msg);
      //   }
      // });
    },
    handleAddPermission() {
      if (this.addPermissionForm.admin_id === "") {
        this.$message.error("需要指定负责人");
        return;
      }
      let params = {
        department_id: this.addPermissionForm.department_id,
        admin_id: this.addPermissionForm.admin_id[0]
      }
      addDepartmentPermission(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("添加成功！");
          this.isAddPermissionDlgVisiable = false;
          this.loadData();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    handleRetrive(row) {
      this.$confirm('确定要收回改部门权限吗？', '提示', {
        iconClass: 'el-icon-question',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: true,
        type: 'warning'
      }).then(() => {
        // 确认
        if (row.admin_name === "超级管理员") {
          this.$message.info("该部门权限已收回!");
          return;
        }
        let params = {
          department_id: row.id
        };
        deleteDepartmentPermission(params).then((res) => {
          if (res.code === 200) {
            this.$message.success("收回成功！");
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
      findAllDepartments(params).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.departments;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    loadDepartmentAdmins() {
      let params = {};
      findAllAdmins(params).then((res) => {
        if (res.code === 200) {
          let batchdata = res.data.admins
          let dataValueBatch = batchdata  => batchdata.map(({id, name}) => ({
            value    : id,
            label    : name,
          }));
          this.users = dataValueBatch(batchdata);
        } else {
          this.$message.error(res.msg);
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
