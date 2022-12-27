<template>
  <div class="container">
    <el-row :gutter="15">
      <el-col :span="3">
        <el-card class="box-card">
          <div class="card-item">
            <div>
              <i class="el-icon-notebook-2" style="color: #FE8823; font-size: 30px"></i>
            </div>
            <div style="color: #515a6e;font-size: 14px;margin-top: 10px">系统首页</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="box-card">
          <div class="card-item">
            <div>
              <i class="el-icon-reading" style="color: #EA6646; font-size: 30px"></i>
            </div>
            <div style="color: #515a6e;font-size: 14px;margin-top: 10px">打卡管理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="box-card">
          <div class="card-item">
            <div>
              <i class="el-icon-s-help" style="color: #7687F1; font-size: 30px"></i>
            </div>
            <div style="color: #515a6e;font-size: 14px;margin-top: 10px">个人信息管理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="box-card">
          <div class="card-item">
            <div>
              <i class="el-icon-s-grid" style="color: #4FD3BE; font-size: 30px"></i>
            </div>
            <div style="color: #515a6e;font-size: 14px;margin-top: 10px">用户管理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="box-card">
          <div class="card-item">
            <div>
              <i class="el-icon-upload" style="color: #E6A23C; font-size: 30px"></i>
            </div>
            <div style="color: #515a6e;font-size: 14px;margin-top: 10px">权限分配</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="box-card">
          <div class="card-item">
            <div>
              <i class="el-icon-download" style="color: #E6A23C; font-size: 30px"></i>
            </div>
            <div style="color: #515a6e;font-size: 14px;margin-top: 10px">通知发布</div>
          </div>
        </el-card>
      </el-col>
<!--      <el-col :span="3">-->
<!--        <el-card class="box-card">-->
<!--          <div class="card-item">-->
<!--            <div>-->
<!--              <i class="el-icon-discover" style="color: #F56C6C; font-size: 30px"></i>-->
<!--            </div>-->
<!--            <div style="color: #515a6e;font-size: 14px;margin-top: 10px">自定义图标</div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="3">-->
<!--        <el-card class="box-card">-->
<!--          <div class="card-item">-->
<!--            <div>-->
<!--              <i class="el-icon-pie-chart" style="color: #FF7361; font-size: 30px"></i>-->
<!--            </div>-->
<!--            <div style="color: #515a6e;font-size: 14px;margin-top: 10px">charts图标</div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="3">-->
<!--        <el-card class="box-card">-->
<!--          <div class="card-item">-->
<!--            <div>-->
<!--              <i class="el-icon-aim" style="color: #65CCED; font-size: 30px"></i>-->
<!--            </div>-->
<!--            <div style="color: #515a6e;font-size: 14px;margin-top: 10px">国际化</div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
    </el-row>

    <div style="margin-top: 20px">
      <el-row :gutter="15">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>管理人数</span>
              <el-tooltip style="float:right" content="管理人数" placement="top-start">
                <i class="el-icon-user" style="color: #6190e8"></i>
              </el-tooltip>
            </div>
            <div style="font-size: 30px;color: #515a6e">{{ this.people_num }}人</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>健康码异常人数</span>
              <el-tooltip style="float:right" content="健康码异常人数" placement="top-start">
                <i class="el-icon-document" style="color: #6190e8"></i>
              </el-tooltip>
            </div>
            <div style="font-size: 30px;color: #515a6e">{{ this.abnormal_num }}人</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>今日已完成打卡人数</span>
              <el-tooltip style="float:right" content="今日已完成打卡人数" placement="top-start">
                <i class="el-icon-view" style="color: #6190e8"></i>
              </el-tooltip>
            </div>
            <div style="margin-top: 20px">
              <el-progress :stroke-width="20" :percentage="this.finished_percentage"></el-progress>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div style="margin-top: 20px">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-card>
            <ve-pie :data="health_code"></ve-pie>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <ve-pie :data="records"></ve-pie>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {takeAdminStatistic} from "@/api/statistic";

export default {
  name: "dashboard",
  created() {
    this.loadData();
  },
  data() {
    return {
      people_num: 100,
      abnormal_num: 17,
      finished_percentage: 50,
      health_code: {
        columns: ["健康码", "人数"],
        rows: [
          { 健康码: "绿码", 人数: 1393 },
          { 健康码: "灰码", 人数: 3530 },
          { 健康码: "黄码", 人数: 2923 },
          { 健康码: "红码", 人数: 1723 },
        ],
      },
      records: {
        columns: ["打卡状态", "人数"],
        rows: [
          { 打卡状态: "打卡", 人数: 1 },
          { 打卡状态: "未打卡", 人数: 2 },
        ],
      },
    };
  },
  methods: {
    loadData() {
      let params = {};
      takeAdminStatistic(params).then((res) => {
        if (res.code === 200) {
          this.people_num = res.data.people_num;
          this.abnormal_num = res.data.abnormal_num;
          this.finished_percentage = res.data.finished_percentage;
          this.records.rows[0].人数 = res.data.finish_record_num;
          this.records.rows[1].人数 = res.data.unfinish_record_num;
          let tempList = [];
          for (let i = 0; i < res.data.health_code_parts.length; i++) {
            tempList.push({健康码: res.data.health_code_parts[i].health_code, 人数: res.data.health_code_parts[i].people_num});
          }
          this.health_code.rows = tempList;
        } else {
          this.$message.error(res.msg);
        }
      })
    }
  }
};
</script>

<style scoped>
.card-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>