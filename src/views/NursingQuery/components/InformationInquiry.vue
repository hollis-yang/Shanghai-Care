<script setup>
  import axios from '../../../utils/http'
  import { User, Female, Files, HomeFilled, Menu, GoldMedal, EditPen, Histogram } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { ref } from 'vue'
  import { getSQLAPI } from '../../../apis/mysql'
  import Icon from './Icon.vue'

  const input1 = ref('')

  //从Element中选择图标
  const iconObj = {
    name: User,
    gender: Female,
    age: Files,
    residence: HomeFilled,
    organization: Menu,
    certificate: GoldMedal,
    comprehensive: EditPen,
    honor: GoldMedal,
    competition: Histogram
  }

  //设置行名
  const TitleObj = {
    name: '姓名',
    gender: '性别',
    age: '年龄',
    residence: '户籍情况',
    organization: '当前工作机构',
    certificate: '持证情况',
    comprehensive: '综合评价等级',
    honor: '荣誉级别',
    competition: '竞赛奖项'
  }

  //初始情况下所有信息为‘-’
  const infoObj = ref({
    name: '-',
    gender: '-',
    age: '-',
    residence: '-',
    organization: '-',
    certificate: '-',
    comprehensive: '-',
    honor: '-',
    competition: '-'
  })

  //SQL
  const sqlResult = ref([])
  const getData = async () => {
    const sql = 'SELECT name, institution, gender, age, census_register,certificate, grade, honor, competition FROM nursing_workers'
    const res = await getSQLAPI(sql)
    console.log(res)
    sqlResult.value = res
  }
  getData()
  
  //按照姓名查询
  async function queryInfo() {
    let isInfo = false
    let infoArr = []
    sqlResult.value.map(val => {
      if (val[0].replace(/\s*/g, '') === input1.value.replace(/\s*/g, '')) {
        isInfo = true
        infoArr = val
      }
    })
    console.log(isInfo)
    if (!isInfo) {
      alert('暂无查询结果请重新输入')
      //无查询结果时，所有信息清空
      infoObj.value = {
      name: '-',
    gender: '-',
    age: '-',
    residence: '-',
    organization: '-',
    certificate: '-',
    comprehensive: '-',
    honor: '-',
    competition: '-'
      }
      return
    }

    //匹配数据
    const obj = {
      name: infoArr[0],
      gender: infoArr[2],
      age: infoArr[3],
      residence: infoArr[4],
      organization: infoArr[1],
      certificate: infoArr[5],
      comprehensive: infoArr[6],
      honor: infoArr[7],
      competition: infoArr[8]
    }
    infoObj.value = obj
  }
</script>

<template>
    <div class="InformationInquiry">
      <div class="top">
        <el-input v-model="input1" placeholder="请输入姓名">
          <template #prepend>
            <div>
              按姓名查询
            </div>
          </template>
        </el-input>
        <div class="btn">
          <el-button @click="queryInfo" type="primary">查询</el-button>
        </div>
      </div>
      <div class="bottom">
        <div class="bottom-box" v-for="(item,index) in infoObj" :key="index">
          <div class="left">
            <div class="icon">
              <Icon :Components='iconObj[index]'></Icon>
            </div>
            {{TitleObj[index]}}
          </div>
  
          <div class="right">
            {{item}}
          </div>
        </div>
      </div>
    </div>
</template>

<style lang='less' scoped>
.InformationInquiry {
  position: fixed;
  font-size: 16px;
  top: 60%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
  .top {
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    /deep/ .el-input-group__prepend {
      background-color: #1827c4 !important;
      color: #fff !important;
      box-shadow: none !important;
    }
    .btn {
      margin-left: 30px;
      /deep/ .el-button {
        background-color: #1827c4 !important;
        border: none;
      }
    }
  }
  .bottom {
    background-color: #0000006b;
    color: rgb(255, 255, 255);
    padding: 10px 20px;
    margin-top: 50px;
    border-radius: 5px;
    .bottom-box {
      display: flex;
      margin-top: 18px;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        .icon {
          width: 16px;
          height: 16px;
          margin-right: 0.5em;
        }
      }
      .right {
      }
    }
  }
}
</style>
