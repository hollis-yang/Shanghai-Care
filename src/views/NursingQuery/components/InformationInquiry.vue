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
