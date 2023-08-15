<script setup>
import { onMounted } from "vue"
import { Timer, Grid, HelpFilled } from "@element-plus/icons-vue"
import { useActStore } from "@/stores/activity"
import { useAdminStore } from '@/stores/admin'
let actStore = useActStore()
let adminStore = useAdminStore()
onMounted(async () => {
  await actStore.getdata()
})
</script>

<template>
  <div class="activity-table">
    <div class="tables">
      <el-table :data="actStore.tableData" stripe style="width: 100%;border-bottom: 0; margin: 0 auto"
        header-row-class-name="header-row-class-name">
        <el-table-column label="时间" align="center">
          <template #default="scope">
            <div>
              <el-icon class="icon">
                <timer />
              </el-icon>
              <span style="margin-left: 10px">{{
                ` ${new Date(scope.row[3]).getFullYear()}-${`${new Date(scope.row[3]).getMonth() + 1}`.length <= 1 ?
                  `0${new Date(scope.row[3]).getMonth() + 1}` : `${new Date(scope.row[3]).getMonth() + 1}`}-${`${new
                    Date(scope.row[3]).getDate()}`.length <= 1 ? `0${new Date(scope.row[3]).getDate()}` : `${new
                      Date(scope.row[3]).getDate()}`} ${`${new Date(scope.row[3]).getHours() - 8}`.length <= 1 ? `0${new
                        Date(scope.row[3]).getHours() - 8}` : `${new Date(scope.row[3]).getHours() - 8}`}:${`${new
                          Date(scope.row[3]).getMinutes()}`.length <= 1 ? `0${new Date(scope.row[3]).getMinutes()}` : `${new
                            Date(scope.row[3]).getMinutes()}`}:${`${new Date(scope.row[3]).getSeconds()}`.length <= 1 ? `0${new
                              Date(scope.row[3]).getSeconds()}` : `${new Date(scope.row[3]).getSeconds()}`}` }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="活动名称" align="center">
          <template #default="scope">
            <span style="margin-left: 10px">
              <el-icon class="icon">
                <Grid />
              </el-icon>
              {{ scope.row[2] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属社区" width="400" align="center">
          <template #default="scope">
            <span style="margin-left: 10px">
              <el-icon class="icon">
                <HelpFilled />
              </el-icon>
              {{ scope.row[4] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #default="scope">
            <el-button size="small" @click="actStore.flag(scope.$index, scope.row)" type="primary"
              class="detail-btn">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="activity-bottom">
      <div>
        <el-button v-if="adminStore.isadmin" @click="actStore.flag" type="primary" class="new-btn">新增活动</el-button>

      </div>
      <div class="activity-pagination">
        <el-pagination background layout="prev, pager, next" v-model:current-page="actStore.currentPage"
          v-model:page-size="actStore.pageSize" @current-change="actStore.handleCurrentChange" :total="actStore.allNum" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
input {
  outline: none;
}

::v-deep .el-table,
::v-deep .el-table__expanded-cell {
  background-color: transparent !important;
}

/* 表格内背景颜色 */
::v-deep .el-table th,
::v-deep .el-table tr,
::v-deep .el-table td {
  background-color: transparent !important;
  border: 0; //去除表格
}


/*去除底边框*/
::v-deep.el-table td.el-table__cell {
  font-size: 1.8vh;
  border: 0;
}

::v-deep.el-table th.el-table__cell.is-leaf {
  font-size: 1.8vh;
  border: 0;
}

.tables {
  margin: 1vw;
}

/deep/ .el-table__header {
  thead tr .cell {
    font-size: 2vh !important;
  }
}

.activity-table {
  margin-top: 8vh;
  padding: 1vw;

  ::v-deep td {
    color: #fff !important;
  }

  .activity-bottom {
    width: 90%;
    position: absolute;
    margin: 0 5%;
    bottom: 2vh;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .activity-pagination {
      margin: 1vh 2vw;
    }
  }

}

.detail-btn {
  background-color: #1827c4 !important;
  border: none;
  width: 3vw;
  height: 3.4vh;
  font-size: 1.7vh;
}

.new-btn {
  background-color: #1827c4 !important;
  border: none;
  width: 5vw;
  height: 4.2vh;
  font-size: 1.8vh;
}

.icon {
  width: 2.2vh;
  height: 2.2vh;
  font-size: 2.2vh;
}
</style>