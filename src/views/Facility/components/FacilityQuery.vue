<script setup>
import {onMounted, ref, onUnmounted, reactive, computed} from 'vue'
import {districtOptions} from '@/utils/district'
import {getSQLAPI} from "@/apis/mysql";
import {BorderBox8 as DvBorderBox8} from '@kjgl77/datav-vue3'
import Icon from '../../NursingQuery/components/Icon.vue'
import { House, MapLocation, Tickets, Document } from '@element-plus/icons-vue'

// 挂载
onMounted(() => {
  // 获取搜索条件
  fetchConditions()
})
onUnmounted(() => {

})

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
  results: []
})

const emits = defineEmits(['passResults']);

const onChangePage = (page) => {
  state.page = page
}

const searchNursingHomes = () => {
  let sql = 'select * from nursinghome'
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

    emits('passResults', data)

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

// 查询筛选条件中选择框使用的选项数据
const fetchConditions = () => {
  getSQLAPI('SELECT DISTINCT kind FROM hospitals').then(res => {
    state.hospitalConditions.kinds = res.map(item => {return item[0]})
  })
  getSQLAPI('SELECT DISTINCT category FROM hospitals').then(res => {
    state.hospitalConditions.categories = res.map(item => {return item[0]})
  })
  getSQLAPI('SELECT DISTINCT key_department FROM hospitals').then(res => {
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
}

</script>

<template>
  <div class="container">
    <div class="positions">
      <el-button @click="state.currentShow=0" color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">养老院</span>
      </el-button>
      <el-button @click="state.currentShow=1" color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">医院</span>
      </el-button>
      <el-button @click="state.currentShow=2" color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">药店</span>
      </el-button>
      <el-button @click="state.currentShow=3" color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">公园</span>
      </el-button>
      <el-button @click="state.currentShow=4" color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">其他</span>
      </el-button>
    </div>
    <div class="conditions">
      <p class="title">丨筛选条件</p>
      <div class="nursing content" v-if="state.currentShow===0">
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
                       style="font-size: 1vw; z-index: 100001; width: 100%">
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
            <el-button @click="searchNursingHomes" type="primary" style="font-size: 1vw">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="hospital content" v-if="state.currentShow===1">
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">性质：</div>
          </el-col>
          <el-col :span="14">
            <el-select
                v-model="state.hospitalQuery.kinds"
                multiple
                collapse-tags
                style="font-size: 1vw; width: 100%"
                popper-class="mapSelect"
                filterable
                placeholder="请选择">
              <el-option
                  v-for="item in state.hospitalConditions.kinds"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">类型：</div>
          </el-col>
          <el-col :span="14">
            <el-select
                v-model="state.hospitalQuery.categories"
                multiple
                collapse-tags
                style="font-size: 1vw; width: 100%"
                popper-class="mapSelect"
                filterable
                placeholder="请选择">
              <el-option
                  v-for="item in state.hospitalConditions.categories"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label standard-font-size">重点科室：</div>
          </el-col>
          <el-col :span="14">
            <el-select
                v-model="state.hospitalQuery.keyDepartments"
                multiple
                collapse-tags
                style="font-size: 1vw; width: 100%"
                popper-class="mapSelect"
                filterable
                placeholder="请选择">
              <el-option
                  v-for="item in state.hospitalConditions.keyDepartments"
                  :key="item"
                  :label="item"
                  :value="item">
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
            <el-button @click="searchNursingHomes" type="primary" style="font-size: 1vw">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="results">
      <p class="title">丨检索结果</p>
      <div class="content">
        <div class="con">
          <div class="con-item-box">
            <div class="con-item" v-for="(item, index) in results" :key="index">
              <dv-border-box8 :reverse="true">
                <div style="padding: 0.5vw;">
                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span><Icon class="icon" :Components='House'></Icon></span>
                      <span>{{ item[1] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="24">
                      <span><Icon class="icon" :Components='MapLocation'></Icon></span>
                      <span>{{ item[3] }}</span>
                    </el-col>
                  </el-row>

                  <el-row class="standard-font-size">
                    <el-col :span="12">
                      <span><Icon class="icon" :Components='Tickets'></Icon></span>
                      <span>可用床位：</span>
                      <span>{{ item[6] }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span><Icon class="icon" :Components='Document'></Icon></span>
                      <span>全部床位：</span>
                      <span>{{ item[5] }}</span>
                    </el-col>
                  </el-row>
                </div>
              </dv-border-box8>
            </div>
          </div>
          <div v-if="results.length === 0" class="standard-font-size" style="text-align: center; color: #c4bbbb; padding: 0.75vw">
            暂无数据
          </div>
        </div>
        <div class="page">
          <el-pagination
              background
              :current-page="state.page"
              :page-size="state.pageSize"
              @current-change="onChangePage"
              layout="prev, pager, next"
              :total="state.total">
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

.standard-font-size {
  font-size: 1.0vw;
}

.container {
  position: absolute;
  padding-right: 1vw;
  padding-bottom: 1vh;
  width: 30vw;
  z-index: 10000;
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
    background-color: #0000006b;
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
    background-color: #0000006b;
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