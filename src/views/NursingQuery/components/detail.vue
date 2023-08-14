<script setup>
import { reactive, computed, watch } from "vue"
import { conditionSelect, gender, age, domicile, situation, grade, some } from '@/utils/data'
import { User, MagicStick, Files, HomeFilled, OfficeBuilding, Collection, EditPen, GoldMedal, Trophy } from '@element-plus/icons-vue'
import Icon from './Icon.vue'
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
import { getSQLAPI } from "@/apis/mysql"
import { useTime } from '@/stores/time'
const infoObj = useTime()
const updateData = computed(() => infoObj.update)
const iconObj = {
  name: User,
  gender: MagicStick,
  age: Files,
  residence: HomeFilled,
  organization: OfficeBuilding,
  certificate: Collection,
  comprehensive: EditPen,
  honor: GoldMedal,
  competition: Trophy
}
const state = reactive({
  conditionSelectValue: '全部',
  selectValue: '',
  information: [],
  page: 1
})
// 根据第一个下框判断应该展示那个
// 假设gender、age、domicile等都是合法的数组
const screenArr = computed(() => {
  switch (state.conditionSelectValue) {
    case '性别':
      return gender
    case '年龄':
      return age
    case '户籍情况':
      return domicile
    case '持证情况':
      return situation
    case '综合评价等级':
      return grade
    default:
      return some
  }
})
watch(() => state.conditionSelectValue, (newValue) => {
  switch (newValue) {
    case '性别':
      state.selectValue = gender[0].label
      break
    case '年龄':
      state.selectValue = age[0].label
      break
    case '户籍情况':
      state.selectValue = domicile[0].label
      break
    case '持证情况':
      state.selectValue = situation[0].label
      break
    case '综合评价等级':
      state.selectValue = grade[0].label
      break
    default:
      state.selectValue = some[0].label
      break
  }
})
// 切换分页后更新数据
const informationData = computed(() => {
  const data = JSON.parse(JSON.stringify(state.information))
  return data.splice((Number(state.page) - 1) * 6, 6)
})
const onChangePage = (page) => {
  state.page = page
}
// 筛选判断
const onSelect = () => {
  let sql = `SELECT name, institution, gender, age, census_register,certificate, grade, honor, competition FROM nursing_workers`
  if (state.conditionSelectValue !== '全部' && state.selectValue !== '全部') {
    if (state.conditionSelectValue === '性别') {
      sql += ` WHERE gender = '${state.selectValue}'`
    } else if (state.conditionSelectValue === '年龄') {
      if (state.selectValue === '29岁及以下') {
        sql += ` WHERE age < 30`
      } else if (state.selectValue === '60岁以上') {
        sql += ` WHERE age >= 60`
      } else {
        sql += ` WHERE age >= ${state.selectValue.split('-')[0]} AND age <= ${state.selectValue.split('-')[1].slice(0, 2)}`
      }
    } else if (state.conditionSelectValue === '户籍情况') {
      sql += ` WHERE census_register = '${state.selectValue}'`
    } else if (state.conditionSelectValue === '持证情况') {
      sql += ` WHERE certificate = '${state.selectValue}'`
    } else if (state.conditionSelectValue === '综合评价等级') {
      sql += ` WHERE grade = '${state.selectValue}'`
    }
  }
  getSQLAPI(sql).then((res) => {
    state.information = res
  })
}
// 点击详情
const onToDetail = (infoArr) => {
  const obj = {
    name: infoArr[0],
    gender: infoArr[2],
    age: infoArr[3],
    residence: infoArr[4],
    organization: infoArr[1],
    certificate: infoArr[5],
    comprehensive: infoArr[6],
    honor: infoArr[7],
    competition: infoArr[8],
    id: infoArr[9],
  }
  infoObj.setInfoObj(obj)
}
// 监听是否触发修改数据
watch(updateData, () => {
  const sql = 'SELECT name, institution, gender, age, census_register,certificate, grade, honor, competition,  id FROM nursing_workers'
  getSQLAPI(sql).then((res) => {
    state.information = res
  })
})
// 初始化获取数据
const init = () => {
  const sql = 'SELECT name, institution, gender, age, census_register, certificate, grade, honor, competition, id FROM nursing_workers'
  getSQLAPI(sql).then((res) => {
    state.information = res
  })
}
init();
</script>

<template>
  <div class="detail">
    <div class="detail-top">
      <span class="title">筛选条件</span>
      <el-select class="conditionSelect" v-model="state.conditionSelectValue" placeholder="请选择">
        <el-option v-for="item in conditionSelect" :key="item.id" :label="item.label" :value="item.label">
        </el-option>
      </el-select>
      <el-select class="selectValue" v-model="state.selectValue" placeholder="请选择">
        <el-option v-for="item in screenArr" :key="item.id" :label="item.label" :value="item.label">
        </el-option>
      </el-select>
      <div class="footer">
        <el-button type="primary" @click="onSelect">筛选</el-button>
      </div>
    </div>
    <div class="con">
      <div class="con-item-box">
        <div class="con-item" v-for="(item, index) in informationData" :key="index">
          <dv-border-box8 :reverse="true">
            <div style="padding: 10px;">
              <div class="item-detail-top">
                <span class="name">
                  <Icon class="icon" :Components='iconObj.name'></Icon>{{ item[0] }}
                </span>
                <span class="gender">
                  <Icon class="icon" :Components='iconObj.gender'></Icon>{{ item[2] }}
                </span>
                <span class="age">
                  <Icon class="icon" :Components='iconObj.age'></Icon>{{ item[3] }}
                </span>
              </div>
              <span class="domicile text-ellipsis">
                <Icon class="icon" :Components='iconObj.organization'></Icon>{{ item[1] }}
              </span>
              <div class="btn item-detail">
                <el-button size="small" type="primary" @click="onToDetail(item)">详情</el-button>
              </div>
            </div>
          </dv-border-box8>
        </div>
      </div>
      <div class="page">
        <el-pagination background :page-size="6" @current-change="onChangePage" layout="prev, pager, next"
          :total="state.information.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .detail-top {
    position: absolute;
    top: -5vh;
    right: -7vw;
    padding: 2vh 2vw;
    width: 50vw;
    color: #fff;
    background-color: #0000006b;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin: 0 2vw;
    flex-wrap: wrap;

    .title {
      font-weight: 600;
      padding-right: 1.5vw;
      font-size: 2.2vh;
    }

    .conditionSelect {
      width: 14vw;
      margin-right: 2vw;
    }

    .selectValue {
      width: 22vw;
    }
  }

  .con {
    position: absolute;
    top: 0vh;
    left: 1vw;
    width: 50vw;
    margin-top: 2vw;
    flex: 1;
    display: flex;
    flex-direction: column;

    .con-item-box {
      display: flex;
      justify-content: space-between;
      flex-shrink: 0;
      flex-wrap: wrap;
      padding: 2vw;
      width: 100%;
      gap: 1vh 1vw;
      flex: 1;
      align-content: flex-start;

      .con-item {
        width: 23vw;
        height: 17vh;
        border: 0.1vh solid #000;
        background-color: #0000006b;
        color: #fff;
        margin-bottom: 2vh;

        .domicile {
          font-size: 1.5vh;
          margin-left: 1vw;
          margin-right: 1vw;
          margin-top: 0.5vh;
          font-size: 2vh;

          .icon {
            position: relative;
            top: 0.6vh;
            width: 2.3vh;
            height: 2.3vh;
          }
        }

        .item-detail-top {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          padding-bottom: 1vh;
          margin-top: 2vh;
          margin-left: 1vw;
          margin-right: 1vw;
          font-size: 2vh;

          .icon {
            width: 2.3vh;
            height: 2.3vh;
          }

          span {
            display: flex;
            align-items: center;
          }
        }

        .item-detail {
          position: absolute;
          right: -0.5vw;
          bottom: 2vh;
          margin-right: 2vw;

          /deep/ .el-button {
            background-color: #1827c4 !important;
            width: 4vw;
            height: 3.5vh;
            font-size: 2vh;
          }
        }
      }
    }

    .page {
      // display: flex;
      // justify-content: center;
      position: absolute;
      bottom: -2vh;
      left: 15vw;
    }
  }

  .btn {
    display: flex;
    margin-top: 1vh;

    /deep/ .el-button {
      background-color: #1827c4 !important;
      border: none;
    }
  }

  .footer {
    position: absolute;
    right: 2.5vw;

    /deep/ .el-button {
      background-color: #1827c4 !important;
      border: none;
    }
  }
}

.text-ellipsis {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  /* 防止文字换行 */
  text-overflow: ellipsis;
  /* 使用省略号代替超出的部分 */
  overflow: hidden;
}

.icon {
  width: 1.5vh;
  height: 1vw;
  margin-right: 0.5em;
}
</style>