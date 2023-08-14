<template>
  <div class="detail">
    <div class="detail-top">
      <span class="title">筛选条件</span>
      <el-select class="conditionSelect" v-model="state.conditionSelectValue" placeholder="请选择">
        <el-option
          v-for="item in conditionSelectHealth"
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
              <span class="age"><Icon  class="icon" :Components='iconObj.age'></Icon>{{ item[1] }}</span>
            </div>
            <span class="domicile text-ellipsis"><Icon  class="icon" :Components='iconObj.address'></Icon>{{ item[9] }}{{ item[10] }}{{ item[4] }}</span>
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
import { reactive, computed, watch } from "vue";
import { conditionSelectHealth, gender, ageHealth,isLift, isLivingAlone, some } from '@/utils/data';
import { User, MagicStick, Files, Phone, HomeFilled, Collection, EditPen, Refrigerator, Postcard, Coordinate } from '@element-plus/icons-vue'
import Icon from './Icon.vue';
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
import { getSQLAPI } from "@/apis/mysql";
import { useTime } from '@/stores/time';
const infoObj = useTime();
const updateData = computed(()=> infoObj.update)
const iconObj = {
  name: User,
  gender: MagicStick,
  age: Files,
  phone: Phone,
  address: HomeFilled,
  child_phone: Phone,
  medical_history: Collection,
  allergy: EditPen,
  elevator: Refrigerator,
  diet: Postcard,
  solitude: Coordinate
}
const state = reactive({
  conditionSelectValue: '全部',
  selectValue: '',
  information: [],
  page: 1,
  street: [],
  medicalHistory: [],
  allergy: [],
})
// 根据第一个下框判断应该展示那个
const screenArr = computed(() => {
  switch (state.conditionSelectValue) {
    case '性别':
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      state.selectValue = gender[0].label
      return gender
    case '年龄':
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      state.selectValue = ageHealth[0].label
      return ageHealth
    case '所在街道':
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      state.selectValue = state.street[0].label
      return state.street
    case '住址有无电梯':
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      state.selectValue = isLift[0].label
      return isLift
    case '是否独居':
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      state.selectValue = isLivingAlone[0].label
      return isLivingAlone
    case '病史':
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      state.selectValue = state.medicalHistory[0].label
      return state.medicalHistory
    case '过敏药物':
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      state.selectValue = state.allergy[0].label
      return state.allergy
    default:
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      state.selectValue = some[0].label
      return some
  }
});
// 切换分页后更新数据
const informationData = computed(() => {
  const data = JSON.parse(JSON.stringify(state.information))
  return data.splice((Number(state.page) - 1) * 6, 6);
});
const onChangePage = (page) => {
  state.page = page;
}
// 筛选判断
const onSelect = () => {
  let sql = 'SELECT name, age, gender, phone,address, child_phone, medical_history, allergy,elevator,district, subdistrict,diet, solitude,  id FROM health_files'
  if (state.conditionSelectValue !== '全部' && state.selectValue !== '全部') {
    if (state.conditionSelectValue === '性别') {
      sql += ` WHERE gender = '${state.selectValue}'`
    } else if (state.conditionSelectValue === '年龄'){
      if (state.selectValue === '100岁以上') {
        sql += ` WHERE age >= 100`
      } else {
        sql += ` WHERE age >= ${state.selectValue.split('-')[0]} AND age <= ${state.selectValue.split('-')[1].slice(0,2)}`
      }
    } else if (state.conditionSelectValue === '所在街道') {
      sql += ` WHERE subdistrict = '${state.selectValue}'`
    } else if (state.conditionSelectValue === '住址有无电梯') {
      sql += ` WHERE elevator = '${state.selectValue}'`
    } else if (state.conditionSelectValue === '是否独居') {
      sql += ` WHERE solitude = '${state.selectValue}'`
    } else if (state.conditionSelectValue === '病史') {
      sql += ` WHERE medical_history LIKE '%${state.selectValue}%'`
    } else if (state.conditionSelectValue === '过敏药物') {
      sql += ` WHERE allergy LIKE '%${state.selectValue}%'`
    }
  }
  getSQLAPI(sql).then((res) => {
    state.information = res
  })
}
// 点击详情
const onToDetail = (infoArr) => {
  console.log(1111111111, infoArr, infoArr[9])
  const str = `${infoArr[9]}-${infoArr[10]}-${infoArr[4]}`
  const obj = {
    name: infoArr[0],
    age: infoArr[1],
    gender: infoArr[2],
    phone: infoArr[3],
    address: str,
    child_phone: infoArr[5],
    medical_history: infoArr[6],
    allergy: infoArr[7],
    elevator: infoArr[8],
    district: infoArr[9],
    subdistrict: infoArr[10],
    diet: infoArr[11],
    solitude: infoArr[12],
    id: infoArr[13],
  }
  infoObj.setInfoHealthObj(obj)
}
// 监听是否触发修改数据
watch(updateData, () => {
  const sql = 'SELECT name, age, gender, phone,address, child_phone, medical_history, allergy,elevator,district, subdistrict,diet, solitude,  id FROM health_files'
  getSQLAPI(sql).then((res) => {
    state.information = res
  })
})
// 初始化获取数据
const init = () => {
  const sql = 'SELECT name, age, gender, phone,address, child_phone, medical_history, allergy,elevator,district, subdistrict,diet, solitude,  id FROM health_files'
  getSQLAPI(sql).then((res) => {
    console.log(11111111, res)
    
    state.street = [...new Set((res).map((item) =>item[10]))].map((item, index)=> {return {label: item, index}})
    const medicalHistory = [...new Set((res).map((item) =>item[6]))].map((item, index)=> item)
    state.allergy = [...new Set((res).map((item) => item[7]))].map((item, index) => { return { label: item, index } })
    const medicalHistoryArr = (medicalHistory.map(item => {
      if (item.includes('、')) {
          return item.split('、')
      } else {
          return item
        }
      })).flat()
    state.medicalHistory = [...new Set(medicalHistoryArr)].map((item, index) => { return { label: item, index } })
    state.information = res;
  })
}
init()
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