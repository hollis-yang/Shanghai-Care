<script setup>
import { User, MagicStick, Files, HomeFilled, OfficeBuilding, Collection, EditPen, GoldMedal, Trophy } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { getSQLAPI } from '../../../apis/mysql'
import { insertSQLAPI } from '@/apis/insertsql'
import Icon from './Icon.vue'
import { useTime } from '@/stores/time'
import { useAdminStore } from '@/stores/admin'
let adminStore = useAdminStore()

const time = useTime()
const input1 = ref('')
const isSet = ref(true)
const isAdd = ref(false)
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
const infoObj = computed(() => time.infoObj)
const sqlResult = ref([])
const getData = async () => {
  const sql = 'SELECT name, institution, gender, age, census_register,certificate, grade, honor, competition,id FROM nursing_workers'
  const res = await getSQLAPI(sql)
  console.log(res)
  sqlResult.value = res
}
getData()
const onChange = () => {
}
// 删除
const onDel = () => {
  const sql = `DELETE FROM nursing_workers WHERE id='${infoObj.value.id}';`
  insertSQLAPI(sql).then(() => {
    // 处理后端返回的响应数据
    isSet.value = true
    isAdd.value = false
    time.setInfoObj({
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
    time.setUpdate()
  })
}
// 点击添加，并且把数据设置为空
const onAdd = () => {
  isSet.value = false
  isAdd.value = true
  time.setInfoObj({
    name: '',
    gender: '',
    age: '',
    residence: '',
    organization: '',
    certificate: '',
    comprehensive: '',
    honor: '',
    competition: ''
  })
}
// 修改或添加
const onSetAndAdd = () => {
  if (!isSet.value) {
    let sql = ''
    if (isAdd.value) {
      sql = `INSERT INTO nursing_workers (name, institution, gender, age, census_register,certificate, grade, honor, competition) VALUES ('${infoObj.value.name}', '${infoObj.value.organization}', '${infoObj.value.gender}', '${infoObj.value.age}', '${infoObj.value.residence}','${infoObj.value.certificate}', '${infoObj.value.comprehensive}','${infoObj.value.honor}','${infoObj.value.competition}')`
    } else {
      sql = `UPDATE nursing_workers SET name='${infoObj.value.name}', institution='${infoObj.value.organization}', gender='${infoObj.value.gender}', age='${infoObj.value.age}', census_register='${infoObj.value.residence}',certificate='${infoObj.value.certificate}', grade='${infoObj.value.comprehensive}', honor='${infoObj.value.honor}', competition='${infoObj.value.competition}' WHERE id='${infoObj.value.id}'`
    }
    insertSQLAPI(sql).then(() => {
      // 处理后端返回的响应数据
      time.setUpdate()
    })
  }
  isSet.value = !isSet.value
}
async function queryInfo() {
  let isInfo = false
  let infoArr = []
  isAdd.value = false
  sqlResult.value.map(val => {
    if (val[0].replace(/\s*/g, '') === input1.value.replace(/\s*/g, '')) {
      isInfo = true
      infoArr = val
    }
  })
  console.log(isInfo)
  if (!isInfo) {
    alert('暂无查询结果, 请重新输入!')
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
    id: infoArr[9]
  }
  // infoObj.value = obj

  time.setInfoObj(obj)
  // const { data } = await axios({
  //   url: '/query',
  //   method: 'get',
  //   params: {
  //     name: input1.value
  //   }
  // })

  // infoObj.value = data
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
        <el-button v-if="adminStore.isadmin" @click="onAdd" type="primary">新增护工</el-button>
      </div>
    </div>

    <div class="bottom">
      <div class="bottom-box" v-for="(item, index) in Object.keys(infoObj)" :key="index">
        <div class="left" v-if="item !== 'id'">
          <div class="icon">
            <Icon :Components='iconObj[item]'></Icon>
          </div>
          {{ TitleObj[item] }}
        </div>

        <div class="right" v-if="item !== 'id'">
          <span v-if="isSet">{{ infoObj[item] ? infoObj[item] : '-' }}</span>
          <el-input v-else class="information" size="small" v-model="infoObj[item]" :placeholder="`请输入${TitleObj[item]}`"
            @change="onChange"></el-input>
        </div>
      </div>
    </div>

    <div class="btn footer">
      <el-button type="primary" v-if="!isSet" @click="onSetAndAdd" class="save-btn">保存</el-button>
      <div v-else-if="infoObj.name && infoObj.name !== '-'" class="footer-btn">
        <el-button v-if="adminStore.isadmin" type="primary" @click="onSetAndAdd">编辑</el-button>
        <el-button v-if="adminStore.isadmin" type="primary" @click="onDel">删除</el-button>
      </div>
    </div>
  </div>
</template>


<style lang='less' scoped>
.InformationInquiry {
  position: fixed;
  font-size: 1vh;
  top: 50%;
  width: 30vw;
  height: 50vh;
  transform: translate(0%, -50%);

  .top {
    position: absolute;
    top: -2vw;
    width: 33vw;
    height: 4vh;
    display: flex;

    /deep/ .el-input-group__prepend {
      background-color: #1827c4 !important;
      color: #fff !important;
      box-shadow: none !important;
      font-size: 1.5vh;
    }

    /deep/ .el-input__inner {
      font-size: 1.5vh;
    }
  }

  .btn {
    margin-left: 2vw;
    display: flex;

    /deep/ .el-button {
      background-color: #1827c4 !important;
      border: none;
      height: 100%;
      font-size: 1.5vh;
    }
  }

  // .footer {
  //   // justify-content: flex-end;
  //   position: absolute;
  //   left: 15vw;
    
  //   padding: 3vh 2vw;
  // }

  .save-btn {
    position: absolute;
    bottom: -17vh;
    width: 4vw !important;
    height: 4vh !important;
  }

  .footer-btn {
    position: absolute;
    bottom: -17vh;
    left: 20vw;
    width: 20vw;
    height: 4vh;
    display: flex;

    /deep/ .el-button {
      margin-right: 1vw;
    }
  }

  .information {
    border: 0;
    border-bottom: 0.1vh solid #ccc;

    /deep/ .el-input__wrapper {
      background: none;
      border: 0;
      box-shadow: none;
      min-width: 0;
    }
  }

  .bottom {
    background-color: #0000006b;
    color: rgb(255, 255, 255);
    // padding: 1vh 2vw;
    padding-left: 2.5vw;
    padding-right: 2.5vw;
    padding-top: 1vh;
    margin-top: 5vh;
    border-radius: 1vh;
    width: 28vw;
    height: 55vh;

    .bottom-box {
      display: flex;
      margin-top: 3.2vh;
      justify-content: space-between;

      &:first-child {
        margin-top: 2vh;
      }

      .left {
        display: flex;
        align-items: center;
        font-size: 2vh;

        .icon {
          width: 2.2vh;
          height: 2.2vh;
          margin-right: 1vw;
        }
      }

      .right {
        font-size: 1.9vh;
      }
    }
  }
}
</style>