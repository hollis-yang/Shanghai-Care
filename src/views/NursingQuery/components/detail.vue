<template>
  <div class="detail">
    <div class="detail-top">
      <span class="title">筛选条件</span>
      <el-select class="conditionSelect" v-model="state.conditionSelectValue" placeholder="请选择">
        <el-option
          v-for="item in conditionSelect"
          :key="item.id"
          :label="item.label"
          :value="item.label"
        >
        </el-option>
      </el-select>
      <el-select class="selectValue" v-model="state.selectValue" placeholder="请选择">
        <el-option
          v-for="item in screenArr"
          :key="item.id"
          :label="item.label"
          :value="item.label"
        >
        </el-option>
      </el-select>
      <div class="btn footer">
          <el-button type="primary" @click="onSelect">筛选</el-button>
      </div>
    </div>
    <div class="con">
      <div class="con-item-box">
        <div class="con-item" v-for="(item, index) in informationData" :key="index">
        <dv-border-box8 :reverse="true">
          <div style="padding: 10px;">
            <div class="item-detail-top">
              <span class="name"><Icon class="icon" :Components='iconObj.name'></Icon>{{ item[0] }}</span>
              <span class="gender"><Icon  class="icon" :Components='iconObj.gender'></Icon>{{ item[2] }}</span>
              <span class="age"><Icon  class="icon" :Components='iconObj.age'></Icon>{{ item[3] }}</span>
            </div>
            <span class="domicile text-ellipsis"><Icon  class="icon" :Components='iconObj.organization'></Icon>{{ item[1] }}</span>
            <div class="btn item-detail">
                <el-button size="small" type="primary" @click="onToDetail(item)">详情</el-button>
            </div>
          </div>
        </dv-border-box8>
        </div>
      </div>
      <div class="page">
        <el-pagination
          background
          :page-size="6"
          @current-change="onChangePage"
          layout="prev, pager, next"
          :total="state.information.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed, watch } from "vue"
import { conditionSelect, gender, age, domicile, situation, grade, some } from '@/utils/data'
import { User, MagicStick, Files, HomeFilled, OfficeBuilding, Collection, EditPen, GoldMedal, Trophy } from '@element-plus/icons-vue'
import Icon from './Icon.vue'
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
import { getSQLAPI } from "@/apis/mysql"
import { useTime } from '@/stores/time'
const infoObj = useTime()
const updateData = computed(()=> infoObj.update)
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
    } else if (state.conditionSelectValue === '年龄'){
      if (state.selectValue === '29岁及以下') {
        sql += ` WHERE age < 30`
      }else if (state.selectValue === '60岁以上') {
        sql += ` WHERE age >= 60`
      } else {
        sql += ` WHERE age >= ${state.selectValue.split('-')[0]} AND age <= ${state.selectValue.split('-')[1].slice(0,2)}`
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
<style lang="less" scoped>
.detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .detail-top {
    padding: 2vh 2vw;
    width: 46vw;
    color: #fff;    
    background-color: #0000006b;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin: 0 2vw;
    flex-wrap: wrap;
    .title {
      font-weight: 600;
      padding-right: 1vw;
    }
    .conditionSelect {
      width: 14vw;
      margin-right: 1vw;
    }
    .selectValue {
      width: 22vw;

    }
  }
  .con {
    width: 100%;
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
        width: 40%;
        border: 0.1vh solid #000;
        background-color: #0000006b;
        color: #fff;
        .domicile {
          font-size: 1.5vh;
          .icon {
            position: relative;
            top: 0.3vh;
          }
        }
        
        .item-detail-top {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          padding-bottom: 1vh;
          span {
            display: flex;
            align-items: center;
          }
        }
        .item-detail {
          display: flex;
          justify-content: flex-end;
          padding-bottom: 1vh;
        }
      }
    }
    .page {
      display: flex;
      justify-content: center;
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
}
.text-ellipsis {
  display: inline-block;
  width: 100%;
  white-space: nowrap; /* 防止文字换行 */
  text-overflow: ellipsis; /* 使用省略号代替超出的部分 */
  overflow: hidden;
}
        .icon {
          width: 1.5vh;
          height: 1vw;
          margin-right: 0.5em;
        }
</style>