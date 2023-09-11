<script setup>
import { User, MagicStick, Files, Phone, HomeFilled, Collection, EditPen, Refrigerator, Postcard, Coordinate } from '@element-plus/icons-vue'
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
  phone: Phone,
  address: HomeFilled,
  child_phone: Phone,
  medical_history: Collection,
  allergy: EditPen,
  elevator: Refrigerator,
  diet: Postcard,
  solitude: Coordinate
}
const TitleObj = {
  name: '姓名',
  age: '年龄',
  gender: '性别',
  phone: '联系方式',
  address: '家庭住址',
  child_phone: '子女联系方式',
  medical_history: '病史',
  allergy: '过敏药物',
  elevator: '是否配备电梯',
  diet: '饮食注意事项',
  solitude: '是否独居',
}
const infoObj = computed(() => time.infoHealthObj)
const sqlResult = ref([])
const getData = async () => {
  const sql = 'SELECT name, age, gender, phone,address, child_phone, medical_history, allergy,elevator,district, subdistrict,diet, solitude,  id FROM health_files'
  const res = await getSQLAPI(sql)
  console.log(res)
  sqlResult.value = res
}
getData()
const onChange = () => {
}
// 删除
const onDel = () => {
  const sql = `DELETE FROM health_files WHERE id='${infoObj.value.id}';`
  insertSQLAPI(sql).then(() => {
    // 处理后端返回的响应数据
    isSet.value = true;
    isAdd.value = false;
    time.setInfoHealthObj({
      name: '',
      age: '',
      gender: '',
      phone: '',
      address: '',
      child_phone: '',
      medical_history: '',
      allergy: '',
      elevator: '',
      diet: '',
      solitude: '',
    })
    time.setUpdate()
  })
}
// 点击添加，并且把数据设置为空
const onAdd = () => {
  isSet.value = false
  isAdd.value = true
  time.setInfoHealthObj({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    child_phone: '',
    medical_history: '',
    allergy: '',
    elevator: '',
    diet: '',
    solitude: '',
  })
}
// 修改或添加
const onSetAndAdd = () => {
  if (!isSet.value) {
    let sql = ''
    if (isAdd.value) {
      sql = `INSERT INTO health_files (name, age, gender, phone,address, child_phone, medical_history, allergy,elevator,district, subdistrict,diet, solitude) VALUES ('${infoObj.value.name}', '${infoObj.value.age}', '${infoObj.value.gender}', '${infoObj.value.phone}', '${infoObj.value.address.split('-')[0]}','${infoObj.value.child_phone}', '${infoObj.value.medical_history}','${infoObj.value.allergy}','${infoObj.value.elevator}','${infoObj.value.address.split('-')[1]}','${infoObj.value.address.split('-')[2]}','${infoObj.value.diet}','${infoObj.value.solitude}')`
    } else {
      sql = `UPDATE health_files SET name='${infoObj.value.name}', age='${infoObj.value.age}', gender='${infoObj.value.gender}',  phone='${infoObj.value.phone}',address='${infoObj.value.address.split('-')[2]}', child_phone='${infoObj.value.child_phone}', medical_history='${infoObj.value.medical_history}', allergy='${infoObj.value.allergy}', elevator='${infoObj.value.elevator}', district='${infoObj.value.address.split('-')[0]}',subdistrict='${infoObj.value.address.split('-')[1]}', diet='${infoObj.value.diet}', diet='${infoObj.value.solitude}' WHERE id='${infoObj.value.id}'`
    }
    insertSQLAPI(sql).then(() => {
      // 处理后端返回的响应数据
      time.setUpdate()
    })
  }
  isSet.value = !isSet.value;
}
async function queryInfo() {
  let isInfo = false
  let infoArr = []
  isAdd.value = false;
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
      name: '',
      age: '',
      gender: '',
      phone: '',
      address: '',
      child_phone: '',
      medical_history: '',
      allergy: '',
      elevator: '',
      diet: '',
      solitude: '',
    }
    return
  }
  const obj = {
    name: infoArr[0],
    age: infoArr[1],
    gender: infoArr[2],
    phone: infoArr[3],
    address: infoArr[4],
    child_phone: infoArr[5],
    medical_history: infoArr[6],
    allergy: infoArr[7],
    elevator: infoArr[8],
    diet: infoArr[11],
    solitude: infoArr[12],
    id: infoArr[13],
  }
  // infoObj.value = obj

  time.setInfoHealthObj(obj)
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
        <el-button v-if="adminStore.isadmin" @click="onAdd" type="primary">新增档案</el-button>
      </div>
    </div>

    <div class="bottom">
      <div class="bottom-box" v-for="(item, index) in Object.keys(infoObj)" :key="index">
        <div class="left" v-if="item !== 'id' && item !== 'district' && item !== 'subdistrict'">
          <div class="icon">
            <Icon :Components='iconObj[item]'></Icon>
          </div>
          {{ TitleObj[item] }}
        </div>

        <div class="right" v-if="item !== 'id' && item !== 'district' && item !== 'subdistrict'">
          <span v-if="isSet">{{ infoObj[item] ? infoObj[item] : '-' }}</span>
          <el-input v-else class="information" size="small" v-model="infoObj[item]" :placeholder="`请输入${TitleObj[item]}`"
            @change="onChange"></el-input>
        </div>
      </div>
    </div>

    <div class="btn footer" :class="!isSet ? 'footer-position' : ''">
      <el-button type="primary" v-if="!isSet" @click="onSetAndAdd" class="save-btn">保存</el-button>
      <div v-else-if="infoObj.name && infoObj.name !== '-' && adminStore.isadmin" class="footer-btn">
        <el-button type="primary" @click="onSetAndAdd">编辑</el-button>
        <el-button type="primary" @click="onDel">删除</el-button>
      </div>
    </div>
  </div>
</template>



<style lang='less' scoped>
.InformationInquiry {
  position: fixed;
  font-size: 1vh;
  top: 47%;
  width: 30vw;
  height: 50vh;
  transform: translate(0%, -50%);

  .top {
    position: absolute;
    top: -5vh;
    width: 33vw;
    height: 4vh;
    display: flex;

    /deep/ .el-input-group__prepend {
      background-color: #1827c4 !important;
      color: #fff !important;
      box-shadow: none !important;
      font-size: 1.8vh;
    }

    /deep/ .el-input__inner {
      font-size: 1.8vh;
    }
  }

  .btn {
    margin-left: 2vw;
    display: flex;

    /deep/ .el-button {
      background-color: #1827c4 !important;
      border: none;
      height: 100%;
      font-size: 1.8vh;
    }
  }

  // .footer {
  //   justify-content: flex-end;
  //   padding: 1.5vh 0;
  // }

  // .footer-position {
  //   position: absolute;
  //   right: -1vw;
  //   top: 103%;
  // }

  .save-btn {
    position: absolute;
    bottom: -23vh;
    width: 4vw !important;
    height: 4vh !important;
  }

  .footer-btn {
    position: absolute;
    bottom: -23vh;
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
    font-size: 1.8vh;
    margin-top: -0.4vh;

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
    margin-top: 3vh;
    border-radius: 1vh;
    width: 28vw;
    height: 63vh;

    .bottom-box {
      display: flex;
      justify-content: space-between;
      // max-height: 4vh;
      // padding: 0.5vh 0;
      margin-top: 2.7vh;

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