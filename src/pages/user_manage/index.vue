<template>
  <div class="container">
    <el-form :inline="true" :model="searchFormInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchFormInline.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader :disabled="!isSuperAdmin" :options="departments" v-model="searchFormInline.department" class="input-wrapper">
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
          </template>
        </el-cascader>
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
        <el-button type="primary" icon="el-icon-search" @click="openAddDlg"
        >新增用户</el-button
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
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="department" label="部门"></el-table-column>
      <el-table-column prop="identity" label="身份"></el-table-column>
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
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="updated_at" label="上次操作时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              plain
              type="primary"
              @click="openEditDlg(scope.row)"
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

    <!-- 新增窗口 -->
    <el-dialog
        :visible.sync="isAddDlgVisiable"
        :modal-append-to-body="false"
        width="30%"
    >
      <div class="right-wrapper">
        <el-form ref="addRef" :model="addForm" label-width="80px">
          <div class="login-title">新增用户</div>
          <el-form-item style="margin-top: 20px" prop="email"  label="邮箱">
            <el-input
                v-model="addForm.email"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="password"  label="密码">
            <el-input
                v-model="addForm.password"
                size="large"
                show-password
                type="password"
                style="width: 300px"
                prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="name"  label="姓名">
            <el-input
                v-model="addForm.name"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-s-order"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="department" label="部门">
            <el-cascader :options="departments" v-model="addForm.department" class="input-wrapper" size="large">
              <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="identity" label="身份">
            <el-radio-group v-model="editForm.identity" :disabled="!isSuperAdmin">
              <el-radio label="普通用户" key="普通用户" value=0>普通用户</el-radio>
              <el-radio label="部门管理员" key="部门管理员" value=1>部门管理员</el-radio>
            </el-radio-group>
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
          <el-form-item style="margin-top: 30px">
            <el-button
                type="primary"
                style="width: 100%"
                size="large"
                @click="handleAdd"
            >添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 编辑窗口 -->
    <el-dialog
        :visible.sync="isEditDlgVisiable"
        :modal-append-to-body="false"
        width="30%"
    >
      <div class="right-wrapper">
        <el-form ref="editRef" :model="editForm" label-width="80px">
          <div class="login-title">编辑用户</div>
          <el-form-item style="margin-top: 20px" prop="email"  label="邮箱">
            <el-input
                v-model="editForm.email"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="name"  label="姓名">
            <el-input
                v-model="editForm.name"
                size="large"
                style="width: 300px"
                prefix-icon="el-icon-s-order"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="department" label="部门">
            <el-cascader :options="departments" v-model="editForm.department" class="input-wrapper" size="large">
              <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="today_record_status" label="打卡状态">
              <el-radio-group v-model="editForm.today_record_status">
                <el-radio :label=true value="true">已打卡</el-radio>
                <el-radio :label=false value="false">未打卡</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="today_health_code_status" label="健康码">
            <el-radio-group v-model="editForm.today_health_code_status">
              <el-radio :label=1 value=1>绿码</el-radio>
              <el-radio :label=2 value=2>灰码</el-radio>
              <el-radio :label=3 value=3>黄码</el-radio>
              <el-radio :label=4 value=4>红码</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="identity" label="身份">
            <el-radio-group v-model="editForm.identity" :disabled="!isSuperAdmin">
              <el-radio label="普通用户" key="普通用户" value=0>普通用户</el-radio>
              <el-radio label="部门管理员" key="部门管理员" value=1>部门管理员</el-radio>
            </el-radio-group>
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
          <el-form-item style="margin-top: 30px">
            <el-button
                type="primary"
                style="width: 100%"
                size="large"
                @click="handleUpdate"
            >更新</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {addUser, deleteUser, findAllUsers, takeUserInfo, updateUserInfo} from "../../api/user";
import {findAllDepartments} from "../../api/department";
import {noticeAllUserNotFinishRecord} from "../../api/record";
export default {
  name: "user_manage",
  data() {
    return {
      isAddDlgVisiable: false,
      isEditDlgVisiable: false,
      isSuperAdmin: false,
      departments: [
        {value: "计算机19级", label: "计算机19级"},
      ],
      tableData: [
        {
          "id": "10000",
          "email": "chenweigu1027+1@gmail.com",
          "name": "小马",
          "department": "计算机19级",
          "identity": "部门管理员",
          "created_at": "2022-12-04 20:11:58",
          "updated_at": "2022-12-04 20:12:01"
        },
      ],
      editForm: {
        email: "",
        name: "",
        department: "",
        today_record_status: null,
        today_health_code_status: null,
        identity: null
      },
      addForm: {
        email: "",
        password: "",
        name: "",
        department: "",
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
    this.loadDepartments();
    if (localStorage.getItem("identity") === "2") {
      this.isSuperAdmin = true;
    } else if (localStorage.getItem("identity") === "1") {
      this.searchFormInline.department = this.departments[0].value;
    }
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
    handleSearch() {
      this.loadData();
    },
    handleReset() {
      this.searchFormInline.name = "";
      this.searchFormInline.department = "";
      this.loadData();
    },
    openEditDlg(row) {
      this.isEditDlgVisiable = true;
      let params = {
        user_id: row.id
      };
      takeUserInfo(params).then((res) => {
        if (res.code === 200) {
          this.editForm = res.data.user;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleUpdate() {
      let params = {};
      if ((typeof this.editForm.department) === "string") {
        params = {
          email: this.editForm.email,
          name: this.editForm.name,
          department: this.editForm.department,
          today_record_status: this.editForm.today_record_status,
          today_health_code_status: this.editForm.today_health_code_status,
          identity: this.editForm.identity
        }
      } else {
        params = {
          email: this.editForm.email,
          name: this.editForm.name,
          department: this.editForm.department[0],
          today_record_status: this.editForm.today_record_status,
          today_health_code_status: this.editForm.today_health_code_status,
          identity: this.editForm.identity
        }
      }
      if (params.identity === "普通用户") {
        params.identity = 0;
      } else {
        params.identity = 1;
      }
      updateUserInfo(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("更新成功！");
          this.isEditDlgVisiable = false;
          this.loadData();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除该用户吗？', '提示', {
        iconClass: 'el-icon-question',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: true,
        type: 'warning'
      }).then(() => {
        // 确认
        let params = {
          user_id: row.id,
        };
        deleteUser(params).then((res) => {
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
    openAddDlg() {
      this.isAddDlgVisiable = true;
    },
    handleAdd() {
      let params = {
        email: this.addForm.email,
        password: this.addForm.password,
        name: this.addForm.name,
        department: this.addForm.department[0]
      }
      addUser(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("新增成功!");
          this.loadData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    loadData() {
      let params = {};
      if (typeof this.searchFormInline.department === "string") {
        params = {
          current_page: this.currentPage,
          page_size: this.pageSize,
          name: this.searchFormInline.name,
          department: this.searchFormInline.department
        };
      } else {
        params = {
          current_page: this.currentPage,
          page_size: this.pageSize,
          name: this.searchFormInline.name,
          department: this.searchFormInline.department[0]
        };
      }

      findAllUsers(params).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.users;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    loadDepartments() {
      let params = { // 服用分页查询接口，pagesize设为最大
        current_page: 1,
        page_size: 100
      };
      findAllDepartments(params).then((res) => {
        if (res.code === 200) {
          let batchdata = res.data.departments
          let dataValueBatch = batchdata  => batchdata.map(({id, name, admin_name, created_at}) => ({
            value    : name,
            label    : name,
          }));
          this.departments = dataValueBatch(batchdata);
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
