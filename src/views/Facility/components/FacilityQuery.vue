
<script setup>
import { onMounted, ref, reactive, computed, watch } from 'vue'
import { districtOptions } from '@/utils/district'
import { getSQLAPI } from "@/apis/mysql";
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
import Icon from '../../NursingQuery/components/Icon.vue'
import { House, MapLocation, Tickets, Document, HomeFilled, StarFilled, PictureFilled, HelpFilled} from '@element-plus/icons-vue'
import { calculateDistance, formatDistance } from "@/utils/distance"
import { gcj02towgs84 } from "@/utils/lanlatTrans";
import AMapLoader from '@amap/amap-jsapi-loader';

// 挂载
onMounted(() => {
  // 获取搜索条件
  fetchConditions()
})

const props = defineProps({
  selectedPoint: {
    type: Object,
    default: () => {
      return {
        x: '',
        y: '',
        longitude: '',
        latitude: ''
      }
    }
  },
});

const state = reactive({
  conditionSelectValue: '全部',
  selectValue: '',
  information: [],
  page: 1,
  pageSize: 4,
  total: 1,
  currentShow: 0,
  nursingQuery: {
    bedAvailable: [],
    minPrice: '',
    maxPrice: '',
    district: ''
  },
  hospitalQuery: {
    kinds: [],
    categories: [],
    keyDepartments: [],
    district: ''
  },
  hospitalConditions: {
    kinds: [],
    categories: [],
    keyDepartments: [],
  },
  facilityQuery: {
    types: [],
    district: ''
  },
  facilityConditions: {
    types: []
  },
  configs: {
    contentMaxHeight: ['35vh', '26vh', '29vh', '47vh', '']
  },
  results: [],
  selectedPoint: {
    x: 0.0,
    y: 0.0,
    longitude: 0.0,
    latitude: 0.0
  }
})

const emits = defineEmits(['passResults', 'changeMapMode', 'addMark', 'changeDisplay']);

const onChangePage = (page) => {
  state.page = page
}

const searchNursingHomes = () => {
  let sql = 'select * from nursing_homes'
  getSQLAPI(sql).then(data => {
    // 筛选数据
    let bedAvailable = state.nursingQuery.bedAvailable
    if (bedAvailable.length !== 0) {
      // 选中有床位，未选中无床位
      if (bedAvailable.indexOf('has') !== -1 && bedAvailable.indexOf('hasnot') === -1) {
        data = data.filter(item => {
          return item[6] > 0
        })
        // 选中无床位，未选中有床位
      } else if (bedAvailable.indexOf('has') === -1 && bedAvailable.indexOf('hasnot') !== -1) {
        data = data.filter(item => {
          return item[6] === 0
        })
      }
    }

    // 最小价格
    let minPrice = state.nursingQuery.minPrice
    if (minPrice) {
      data = data.filter(item => {
        return item[8] >= minPrice
      })
    }

    // 最大价格
    let maxPrice = state.nursingQuery.maxPrice
    if (maxPrice) {
      data = data.filter(item => {
        return item[9] <= maxPrice
      })
    }

    // 区域
    let district = state.nursingQuery.district
    if (district && district !== '全市') {
      data = data.filter(item => {
        return item[4] === district
      })
    }

    emits('passResults', {
      idx: 0,
      points: data
    })

    state.results = data
    state.total = data.length
  })
}

const searchHospitals = () => {
  let sql = 'select * from hospital'
  getSQLAPI(sql).then(data => {
    // 筛选数据
    let kinds = state.hospitalQuery.kinds
    // 性质
    if (kinds.length !== 0) {
      data = data.filter(item => {
        return kinds.includes(item[3].trim())
      })
    }

    // 类型
    let categories = state.hospitalQuery.categories
    if (categories.length !== 0) {
      data = data.filter(item => {
        return categories.includes(item[4].trim())
      })
    }

    // 重点科室
    let keyDepartments = state.hospitalQuery.keyDepartments
    if (keyDepartments.length !== 0) {
      data = data.filter(item => {
        for (let kd of keyDepartments) {
          if (item[6].indexOf(kd) !== -1) return true
        }
        return false
      })
    }

    // 区域
    let district = state.hospitalQuery.district
    if (district && district !== '全市') {
      data = data.filter(item => {
        return item[13].indexOf(district) !== -1
      })
    }

    emits('passResults', {
      idx: 1,
      points: data
    })

    state.results = data
    state.total = data.length
  })
}

const getPointByAddress = async (address) => {

  let AMap = await AMapLoader.load({
    "key": "5278a4565c9a98ec83ec56a13b93ec07",              // 申请好的Web端开发者Key，首次调用 load 时必填
    "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    "plugins": ['AMap.Geocoder'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })

  // 创建地理编码实例
  const myGeo = new AMap.Geocoder();
  return new Promise((resolve, reject) => {
    // 对地址进行地理编码
    console.log(myGeo.getLocation)
    myGeo.getLocation(address, (status, point) => {
      if (status === 'complete') {
        // 地理编码成功，返回经纬度坐标对象
        resolve([point.geocodes[0].location.lng, point.geocodes[0].location.lat]);
      } else {
        // 地理编码失败
        reject('地理编码失败');
      }
    }, '上海市');
  });
}

// 搜索条件
const radio2 = ref('1')  // 默认为地址输入
// 搜索范围
const radioRange = ref('1')
const keyWorld = ref(null)

// 经纬度换算墨卡托坐标
function lonLatToMercator(longitude, latitude) {
  var E = longitude;
  var N = latitude;
  var x = E * 20037508.34 / 180;
  var y = Math.log(Math.tan((90 + N) * Math.PI / 360)) / (Math.PI / 180);
  y = y * 20037508.34 / 180;
  return {
    x: x, //墨卡托x坐标——对应经度
    y: y, //墨卡托y坐标——对应维度
  }
}

// 搜索事件
const searchDrugStores = async () => {
  // 根据地址名称获取经纬度坐标
  let xyArr = []
  let point = []
  if (radio2.value == '1') {
    try {
      point = await getPointByAddress(keyWorld.value);

      point = gcj02towgs84(point[0], point[1])
      // console.log('wgs84', point)
      xyArr = lonLatToMercator(point[0], point[1])
    } catch (error) {
      console.error(error, '获取经纬度报错');
    }
  }


  let sql = 'select * from drugstore'
  getSQLAPI(sql).then(res => {
    // 计算与选中点位距离
    let x = null;
    let y = null;
    if (radio2.value == '1') {
      x = xyArr.x
      y = xyArr.y
    } else {
      x = parseFloat(state.selectedPoint.x)
      y = parseFloat(state.selectedPoint.y)
    }
    if (radioRange.value == '1') {
      res = res.filter(e => {
        e[5] = parseFloat(calculateDistance(e[3], e[4], x, y))
        return e[5] <= 0.5
      })
    } else if (radioRange.value == '2') {
      res = res.filter(e => {
        e[5] = parseFloat(calculateDistance(e[3], e[4], x, y))
        if (e[5] > 0.5 && e[5] <= 1) {
          return true
        } else {
          return false
        }

      })
    } else if (radioRange.value == '3') {
      res = res.filter(e => {
        e[5] = parseFloat(calculateDistance(e[3], e[4], x, y))
        if (e[5] > 1 && e[5] <= 2) {
          return true
        } else {
          return false
        }

      })
    }

    res.forEach((e, index) => {

      e[5] = parseFloat(calculateDistance(e[3], e[4], x, y))
      if (index < 5) {
        console.log(e)
      }
    })

    // 按距离排序
    res.sort((a, b) => {
      return a[5] - b[5]
    })
    if (radio2.value == '1') {
      emits('addMark', {
        mapPoint: {
          x: x,
          y: y,
          lng: point[0],
          lat: point[1]
        }
      })
    }
    emits('passResults', {
      idx: 2,
      points: res
    })

    state.results = res
    state.total = res.length
  })
}

const searchParks = async () => {
  let xyArr = []
  let point = null;
  if (radio2.value == '1') {
    try {
      point = await getPointByAddress(keyWorld.value);
      console.log('经度：', point.lng);
      console.log('纬度：', point.lat, state.selectedPoint.x);
      point = gcj02towgs84(point[0], point[1])
      xyArr = lonLatToMercator(point[0], point[1])
    } catch (error) {
      console.error(error, '获取经纬度报错');
    }
  }
  let sql = 'select * from park'
  getSQLAPI(sql).then(res => {
    // 计算与选中点位距离
    let x = null;
    let y = null;

    if (radio2.value == '1') {
      x = xyArr.x
      y = xyArr.y
    } else {
      x = parseFloat(state.selectedPoint.x)
      y = parseFloat(state.selectedPoint.y)
    }

    res.forEach(e => {
      e[4] = parseFloat(calculateDistance(e[2], e[3], x, y))
    })

    // 按距离排序
    res.sort((a, b) => {
      return a[4] - b[4]
    })

    if (radio2.value == '1') {
      emits('addMark', {
        mapPoint: {
          x: x,
          y: y,
          lng: point[0],
          lat: point[1]
        }
      })
    }
    emits('passResults', {
      idx: 3,
      points: res
    })

    state.results = res
    state.total = res.length
  })
}

const searchFacilities = () => {
  let sql = 'select * from facility'
  getSQLAPI(sql).then(data => {
    // 筛选数据
    let types = state.facilityQuery.types
    // 性质
    if (types.length !== 0) {
      data = data.filter(item => {
        return types.includes(item[4].trim())
      })
    }

    // 区域
    let district = state.facilityQuery.district
    if (district && district !== '全市') {
      data = data.filter(item => {
        return item[5].trim() === district
      })
    }

    emits('passResults', {
      idx: 4,
      points: data
    })

    state.results = data
    state.total = data.length
  })
}

// 分页
const results = computed(() => {
  if (state.results.length === 0) {
    return []
  }

  let results = []

  let start = (state.page - 1) * state.pageSize
  let end = Math.min(start + state.pageSize, state.results.length)

  for (let i = start; i < end; i++) {
    results.push(state.results[i])
  }

  return results
})

watch(() => props.selectedPoint, () => {
  console.log(state.selectedPoint, '改變')
  Object.assign(state.selectedPoint, props.selectedPoint)
})

const pointInfo = computed(() => {
  if (state.selectedPoint.longitude && state.selectedPoint.latitude) {
    return state.selectedPoint.longitude.toFixed(4) + ',' + state.selectedPoint.latitude.toFixed(4)
  } else {
    return ''
  }
})

// 查询筛选条件中选择框使用的选项数据
const fetchConditions = () => {
  getSQLAPI('SELECT DISTINCT kind FROM hospital').then(res => {
    state.hospitalConditions.kinds = res.map(item => {
      return item[0]
    })
  })
  getSQLAPI('SELECT DISTINCT category FROM hospital').then(res => {
    state.hospitalConditions.categories = res.map(item => {
      return item[0]
    })
  })
  getSQLAPI('SELECT DISTINCT key_department FROM hospital').then(res => {
    let temp = res.map(item => {
      if (item[0]) {
        if (item[0].indexOf(',') !== -1) {
          return item[0].split(',')
        } else if (item[0].indexOf('、') !== -1) {
          return item[0].split('、')
        } else if (item[0].indexOf('，') !== -1) {
          return item[0].split('，')
        } else {
          return item
        }
      }
    }).flat()

    let emptyIndex = temp.indexOf('')
    let undefinedIndex = temp.indexOf(undefined)
    temp.splice(emptyIndex, 1)
    temp.splice(undefinedIndex, 1)

    temp.forEach(e => {
      if (!state.hospitalConditions.keyDepartments.includes(e)) {
        state.hospitalConditions.keyDepartments.push(e)
      }
    })
  })
  getSQLAPI('SELECT DISTINCT type FROM facility').then(res => {
    state.facilityConditions.types = res.map(item => {
      return item[0]
    })
    let idx = state.facilityConditions.types.indexOf('')
    if (idx === -1) idx = state.facilityConditions.types.indexOf(undefined)
    state.facilityConditions.types.splice(idx, 1)
  })
}

const initSelect = () => {
  state.nursingQuery = {
    bedAvailable: [],
    minPrice: '',
    maxPrice: '',
    district: ''
  }
  state.hospitalQuery = {
    kinds: [],
    categories: [],
    keyDepartments: [],
    district: ''
  }

  state.facilityQuery = {
    types: [],
    district: ''
  }

  state.selectedPoint = {
    x: 0.0,
    y: 0.0,
    longitude: 0.0,
    latitude: 0.0
  }

  radio2.value = '1'
  radioRange.value = '1'
  keyWorld.value = null
}

const changeDisplay = (idx) => {
  state.currentShow = idx
  state.results = []
  state.page = 1
  state.total = 0
  emits('changeDisplay', idx)
  initSelect()
  if (idx === 0 || idx === 1) {
    emits('changeMapMode', 'normal')
  } else if (idx === 2 || idx === 3) {

    emits('changeMapMode', 'normal') // selectPoint
  }
}
const radioChange = () => {
  if (radio2.value == 2) {
    alert('请点击地图选取位置')
    emits('changeMapMode', 'selectPoint')
  } else if (radio2.value == 1) {
    emits('changeMapMode', 'normal')
  }
}

</script>

<template>
  <div class="container">
    <div class="positions">
      <el-button @click="changeDisplay(0)" color="#2642AA" size="small" :class="{ 'chosen-btn': state.currentShow === 0 }"
        class="el-button" plain>
        <Icon class="icon" :Components='HomeFilled'></Icon>
        <span class="desc">养老院</span>
      </el-button>
      <el-button @click="changeDisplay(1)" color="#2642AA" size="small" :class="{ 'chosen-btn': state.currentShow === 1 }"
        class="el-button" plain>
        <Icon class="icon" :Components='StarFilled'></Icon>
        <span class="desc">医院</span>
      </el-button>
      <el-button @click="changeDisplay(2)" color="#2642AA" size="small" :class="{ 'chosen-btn': state.currentShow === 2 }"
        class="el-button" plain>
        <Icon class="icon" :Components='HelpFilled'></Icon>
        <span class="desc">药店</span>
      </el-button>
      <el-button @click="changeDisplay(3)" color="#2642AA" size="small" :class="{ 'chosen-btn': state.currentShow === 3 }"
        class="el-button" plain>
        <Icon class="icon" :Components='PictureFilled'></Icon>
        <span class="desc">公园</span>
      </el-button>
<!--      <el-button @click="changeDisplay(4)" color="#2642AA" size="small" :class="{ 'chosen-btn': state.currentShow === 4 }"-->
<!--        class="el-button" plain>-->
<!--        <Icon class="icon" :Components='Promotion'></Icon>-->
<!--        <span class="desc">其他</span>-->
<!--      </el-button>-->
    </div>
    <div class="conditions">
      <p class="title">丨筛选条件</p>
      <div class="nursing content" v-if="state.currentShow === 0">
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">有无床位：</div>
          </el-col>
          <el-col :span="14">

            <el-checkbox-group v-model="state.nursingQuery.bedAvailable" style="margin-top: 1.0vh;">
              <el-checkbox label="has" style="height: auto">有床位</el-checkbox>
              <el-checkbox label="hasnot" style="height: auto">无床位</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">价格区间：</div>
          </el-col>
          <el-col :span="14">
            <el-input v-model="state.nursingQuery.minPrice" style="width: 40%; font-size: 1vw"></el-input>
            <span style="display: inline-block; width: 20%; text-align: center">-</span>
            <el-input v-model="state.nursingQuery.maxPrice" style="width: 40%; font-size: 1vw"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">所在区：</div>
          </el-col>
          <el-col :span="9">
            <el-select v-model="state.nursingQuery.district" popper-class="mapSelect" placeholder="请选择"
              style="font-size: 1vw; z-index: 100; width: 100%">
              <el-option v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.label">
                <span style="
          float: left;
          font-size: 1.6vh;">{{ item.label }}</span>
                <span style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 1.6vh;
          padding-left: 2vh;
        ">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5" style="text-align: right;">
            <el-button color="#2642AA" @click="searchNursingHomes" type="primary" style="font-size: 1vw">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="hospital content" v-if="state.currentShow === 1">
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">性质：</div>
          </el-col>
          <el-col :span="14">
            <el-select v-model="state.hospitalQuery.kinds" multiple collapse-tags style="font-size: 1vw; width: 100%"
              popper-class="mapSelect" filterable placeholder="请选择">
              <el-option v-for="item in state.hospitalConditions.kinds" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">类型：</div>
          </el-col>
          <el-col :span="14">
            <el-select v-model="state.hospitalQuery.categories" multiple collapse-tags style="font-size: 1vw; width: 100%"
              popper-class="mapSelect" filterable placeholder="请选择">
              <el-option v-for="item in state.hospitalConditions.categories" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">重点科室：</div>
          </el-col>
          <el-col :span="14">
            <el-select v-model="state.hospitalQuery.keyDepartments" multiple collapse-tags
              style="font-size: 1vw; width: 100%" popper-class="mapSelect" filterable placeholder="请选择">
              <el-option v-for="item in state.hospitalConditions.keyDepartments" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">所在区：</div>
          </el-col>
          <el-col :span="9">
            <el-select v-model="state.hospitalQuery.district" popper-class="mapSelect" placeholder="请选择"
              style="font-size: 1vw; width: 100%">
              <el-option v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.label">
                <span style="
          float: left;
          font-size: 1.6vh;">{{ item.label }}</span>
                <span style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 1.6vh;
          padding-left: 2vh;
        ">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5" style="text-align: right;">
            <el-button color="#2642AA" @click="searchHospitals" type="primary" style="font-size: 1vw">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="drag-store content" v-if="state.currentShow === 2">
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size" style="margin-top: 1.05vh;">筛选条件：</div>
          </el-col>
          <el-col :span="12" style="display: flex;">
            <el-radio-group v-model="radio2" class="ml-4" @change="radioChange">
              <el-radio label="1" size="large"><span style="font-size: 1vw">地址输入</span></el-radio>
              <el-radio label="2" size="large"><span style="font-size: 1vw">地图选点</span></el-radio>
            </el-radio-group>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">您的位置：</div>
          </el-col>
          <el-col :span="9">
            <el-input v-if="radio2 == '1'" v-model="keyWorld" style="width: 100%; font-size: 1vw"></el-input>
            <el-input v-else disabled v-model="pointInfo" style="width: 100%; font-size: 1vw"></el-input>
          </el-col>
          <el-col :span="5" style="text-align: right;">
            <el-button color="#2642AA" @click="searchDrugStores" type="primary" style="font-size: 1vw">搜索</el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size" style="margin-top: 1.05vh;">范围：</div>
          </el-col>
          <el-col :span="12" style="display: flex;">
            <el-radio-group v-model="radioRange" class="ml-4">
              <el-radio label="1" size="large"><span style="font-size: 1vw">500米内</span></el-radio>
              <el-radio label="2" size="large"><span style="font-size: 1vw">500-1000米</span></el-radio>
              <el-radio label="3" size="large"><span style="font-size: 1vw">1000-2000米</span></el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="park content" v-if="state.currentShow === 3">
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size" style="margin-top: 1.05vh;">筛选条件：</div>
          </el-col>
          <el-col :span="12" style="display: flex;">
            <el-radio-group v-model="radio2" class="ml-4" @change="radioChange">
              <el-radio label="1" size="large"><span style="font-size: 1vw">地址输入</span></el-radio>
              <el-radio label="2" size="large"><span style="font-size: 1vw">地图选点</span></el-radio>
            </el-radio-group>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">您的位置：</div>
          </el-col>
          <el-col :span="9">
            <el-input v-if="radio2 == '1'" v-model="keyWorld" style="width: 100%; font-size: 1vw"></el-input>
            <el-input v-else disabled v-model="pointInfo" style="width: 100%; font-size: 1vw"></el-input>
            <!-- <el-input disabled v-model="pointInfo" style="width: 100%; font-size: 1vw"></el-input> -->
          </el-col>
          <el-col :span="5" style="text-align: right;">
            <el-button color="#2642AA" @click="searchParks" type="primary" style="font-size: 1vw">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="facility content" v-if="state.currentShow === 4">
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">类型：</div>
          </el-col>
          <el-col :span="14">
            <el-select v-model="state.facilityQuery.types" multiple collapse-tags style="font-size: 1vw; width: 100%"
              popper-class="mapSelect" filterable placeholder="请选择">
              <el-option v-for="item in state.facilityConditions.types" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">所在区：</div>
          </el-col>
          <el-col :span="9">
            <el-select v-model="state.facilityQuery.district" popper-class="mapSelect" placeholder="请选择"
              style="font-size: 1vw; width: 100%">
              <el-option v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.label">
                <span style="
          float: left;
          font-size: 1.6vh;">{{ item.label }}</span>
                <span style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 1.6vh;
          padding-left: 2vh;
        ">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5" style="text-align: right;">
            <el-button color="#2642AA" @click="searchFacilities" type="primary" style="font-size: 1vw">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="results">
      <p class="title">丨检索结果</p>
      <div class="content">
        <div class="con" v-if="state.currentShow === 0"
          :style="{ maxHeight: state.configs.contentMaxHeight[state.currentShow] }">
          <div class="con-item-box">
            <div class="con-item" v-for="(item, index) in results" :key="index">
              <dv-border-box8 :reverse="true">
                <div style="padding: 0.5vw;">
                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='House'></Icon>
                      </span>
                      <span>{{ item[1] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='MapLocation'></Icon>
                      </span>
                      <span>{{ item[3] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="12">
                      <span>
                        <Icon class="icon" :Components='Tickets'></Icon>
                      </span>
                      <span>可用床位：</span>
                      <span>{{ item[6] }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span>
                        <Icon class="icon" :Components='Document'></Icon>
                      </span>
                      <span>全部床位：</span>
                      <span>{{ item[5] }}</span>
                    </el-col>
                  </el-row>
                </div>
              </dv-border-box8>
            </div>
          </div>
          <div v-if="results.length === 0" class="standard-font-size"
            style="text-align: center; color: #c4bbbb; padding: 0.75vw">
            暂无数据
          </div>
        </div>
        <div class="con" v-if="state.currentShow === 1"
          :style="{ maxHeight: state.configs.contentMaxHeight[state.currentShow] }">
          <div class="con-item-box">
            <div class="con-item" v-for="(item, index) in results" :key="index">
              <dv-border-box8 :reverse="true" :key="item[0]" style="height: 100%">
                <div style="padding: 0.5vw;">
                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='House'></Icon>
                      </span>
                      <span>{{ item[1] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='MapLocation'></Icon>
                      </span>
                      <span>{{ item[2] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="8">
                      <span>
                        <Icon class="icon" :Components='Tickets'></Icon>
                      </span>
                      <span>性质：</span>
                      <span>{{ item[3] }}</span>
                    </el-col>
                    <el-col :span="16">
                      <span>
                        <Icon class="icon" :Components='Document'></Icon>
                      </span>
                      <span>类型：</span>
                      <span>{{ item[4] }}</span>
                    </el-col>
                  </el-row>

                  <el-row v-if="item[6]" class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='Tickets'></Icon>
                      </span>
                      <span>重要科室：</span>
                      <span>{{ item[6] }}</span>
                    </el-col>
                  </el-row>
                </div>
              </dv-border-box8>
            </div>
          </div>
          <div v-if="results.length === 0" class="standard-font-size"
            style="text-align: center; color: #c4bbbb; padding: 0.75vw">
            暂无数据
          </div>
        </div>
        <div class="con" v-if="state.currentShow === 2"
          :style="{ maxHeight: state.configs.contentMaxHeight[state.currentShow] }">
          <div class="con-item-box">
            <div class="con-item" v-for="(item, index) in results" :key="index">
              <dv-border-box8 :reverse="true" :key="item[0]" style="height: 100%">
                <div style="padding: 0.5vw;">
                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='House'></Icon>
                      </span>
                      <span>{{ item[1] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='MapLocation'></Icon>
                      </span>
                      <span>{{ item[2] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='Tickets'></Icon>
                      </span>
                      <span>距当前位置距离：</span>
                      <span>{{ formatDistance(item[5]) }}</span>
                    </el-col>
                  </el-row>
                </div>
              </dv-border-box8>
            </div>
          </div>
          <div v-if="results.length === 0" class="standard-font-size"
            style="text-align: center; color: #c4bbbb; padding: 0.75vw">
            暂无数据
          </div>
        </div>
        <div class="con" v-if="state.currentShow === 3"
          :style="{ maxHeight: state.configs.contentMaxHeight[state.currentShow] }">
          <div class="con-item-box">
            <div class="con-item" v-for="(item, index) in results" :key="index">
              <dv-border-box8 :reverse="true" :key="item[0]" style="height: 100%">
                <div style="padding: 0.5vw;">
                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='House'></Icon>
                      </span>
                      <span>{{ item[1] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='Tickets'></Icon>
                      </span>
                      <span>距当前位置距离：</span>
                      <span>{{ formatDistance(item[4]) }}</span>
                    </el-col>
                  </el-row>
                </div>
              </dv-border-box8>
            </div>
          </div>
          <div v-if="results.length === 0" class="standard-font-size"
            style="text-align: center; color: #c4bbbb; padding: 0.75vw">
            暂无数据
          </div>
        </div>
        <div class="con" v-if="state.currentShow === 4"
          :style="{ maxHeight: state.configs.contentMaxHeight[state.currentShow] }">
          <div class="con-item-box">
            <div class="con-item" v-for="(item, index) in results" :key="index">
              <dv-border-box8 :reverse="true" :key="item[0]" style="height: 100%">
                <div style="padding: 0.5vw;">
                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span>
                        <Icon class="icon" :Components='House'></Icon>
                      </span>
                      <span>{{ item[1] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="12">
                      <span>
                        <Icon class="icon" :Components='Tickets'></Icon>
                      </span>
                      <span>类型：</span>
                      <span>{{ item[4] }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span>
                        <Icon class="icon" :Components='Document'></Icon>
                      </span>
                      <span>所在区：</span>
                      <span>{{ item[5] }}</span>
                    </el-col>
                  </el-row>
                </div>
              </dv-border-box8>
            </div>
          </div>
          <div v-if="results.length === 0" class="standard-font-size"
            style="text-align: center; color: #c4bbbb; padding: 0.75vw">
            暂无数据
          </div>
        </div>
        <div class="page">
          <el-pagination background :current-page="state.page" :page-size="state.pageSize" @current-change="onChangePage"
            layout="prev, pager, next" :total="state.total">
          </el-pagination>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="less">
.container ::-webkit-scrollbar {
  width: 4px !important;
  height: 4px !important;
  /*background-color:#F5F5F5;*/
}

.container ::-webkit-scrollbar-thumb {
  border-radius: 2px !important;
  -webkit-box-shadow: inset 0 0 6px rgba(88, 130, 171, 0.8) !important;
}

.container .el-checkbox__label {
  font-size: 1vw !important;
  color: white;
}

.el-select .el-input__inner {
  font-size: 1vw !important;
}
</style>

<style scoped lang="less">
.chosen-btn {
  color: var(--el-button-hover-text-color);
  border-color: var(--el-button-hover-border-color);
  background-color: var(--el-button-hover-bg-color);
  outline: 0;
}

.standard-font-size {
  font-size: 1.0vw;
}

.container {
  position: absolute;
  padding-right: 1vw;
  padding-bottom: 1vh;
  width: 30vw;
  z-index: 1000;
  top: 1vw;
  right: 1vh;

  .positions {
    display: flex;
    justify-content: space-evenly;

    .el-button {
      font-size: 1vw;
      padding: 1vw 1vh;
    }
  }

  .conditions {
    margin-top: 1.2vh;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0.5vw;

    .title {
      margin-top: 0;
      margin-bottom: 1vh;
      font-size: 1.2vw;
      padding-top: 1vh;
      padding-left: 0.5vw;
      font-weight: 600
    }

    .content {
      padding: 0 1vw;
      padding-bottom: 1vw;
      font-size: 1.0vw !important;

      .label {
        text-align: right;
        margin-top: 0.5vh;
      }

      .el-row {
        padding: 1vh 0;
      }
    }
  }

  .results {
    margin-top: 1.2vh;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0.5vw;

    .title {
      margin-top: 0;
      margin-bottom: 1vh;
      font-size: 1.2vw;
      padding-top: 1vh;
      padding-left: 0.5vw;
      font-weight: 600
    }

    .content {
      padding: 0 0.75vw 2vh 0.75vw;

      .page {
        margin-top: 1.5vh;
        display: flex;
        justify-content: center;
      }
    }
  }

}

.con {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 35vh;
  overflow: auto;

  .con-item-box {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    flex-wrap: wrap;
    padding: 1.0vh;
    width: calc(100% - 1.5vw);
    gap: 0.5vh;
    flex: 1;
    align-content: flex-start;

    .con-item {
      cursor: pointer;
      width: 100%;
      border: 0.1vh solid #000;
      background-color: #0000006b;
      color: #fff;

      .domicile {
        font-size: 1.0vw;

        .icon {
          position: relative;
          top: 0.3vh;
        }
      }

      .item-detail-top {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        padding-bottom: 0.5vh;

        span {
          display: flex;
          align-items: center;
        }
      }

      .el-row {
        padding: 0.5vh 0;
      }

      .item-detail {
        display: flex;
        justify-content: flex-end;
        padding-bottom: 0.5vh;
      }
    }
  }

  .page {
    display: flex;
    justify-content: center;
  }
}

.icon {
  width: 1.0vw;
  height: 1.0vw;
  margin-right: 0.5em;
}
</style>
