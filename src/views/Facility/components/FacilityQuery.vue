<script setup>
import {onMounted, ref, onUnmounted, reactive, computed} from 'vue'
import {districtOptions} from '@/utils/district'
import {getSQLAPI} from "@/apis/mysql";
import {BorderBox8 as DvBorderBox8} from '@kjgl77/datav-vue3'
import Icon from '../../NursingQuery/components/Icon.vue'
import { House, MapLocation, Tickets, Document } from '@element-plus/icons-vue'

// 挂载
onMounted(() => {

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
  nursingQuery: {
    bedAvailable: [],
    minPrice: '',
    maxPrice: '',
    district: ''
  },
  results: []
})

const emits = defineEmits(['passResults'])

const onChangePage = (page) => {
  state.page = page
}

const searchFacilities = () => {
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

    emits('passResults', data)

    state.results = data
    state.total = data.length
  })
}

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

</script>

<template>
  <div class="container">
    <div class="positions">
      <el-button color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">养老院</span>
      </el-button>
      <el-button color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">医院</span>
      </el-button>
      <el-button color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">药店</span>
      </el-button>
      <el-button color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">公园</span>
      </el-button>
      <el-button color="#2642AA" size="small" class="el-button" plain>
        <span class="desc">其他</span>
      </el-button>
    </div>
    <div class="conditions">
      <p class="title">丨筛选条件</p>
      <div class="nursing content">
        <el-row>
          <el-col :span="7">
            <div class="label" style="padding-top: 4px">有无床位：</div>
          </el-col>
          <el-col :span="14">
            <el-checkbox-group v-model="state.nursingQuery.bedAvailable" style="margin-top: 5px;">
              <el-checkbox label="has" style="height: auto">有床位</el-checkbox>
              <el-checkbox label="hasnot" style="height: auto">无床位</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label">价格区间：</div>
          </el-col>
          <el-col :span="14">
            <el-input v-model="state.nursingQuery.minPrice" size="small" style="width: 40%; font-size: 1vw"></el-input>
            <span style="display: inline-block; width: 20%; text-align: center">-</span>
            <el-input v-model="state.nursingQuery.maxPrice" size="small" style="width: 40%; font-size: 1vw"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="label">所在区：</div>
          </el-col>
          <el-col :span="9">
            <el-select v-model="state.nursingQuery.district" popper-class="mapSelect" placeholder="请选择" size="small"
                       style="font-size: 1vw; z-index: 100001; width: 100%">
              <el-option v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.label">
            <span style="
          float: left;
          font-size: 1.6vh;">{{ item.label }}</span>
                <span style="
          float: right;
          color: var(--el-text-color-secondary)
          font-size: 1.6vh;
          padding-left: 2vh;
        ">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5" style="text-align: right;">
            <el-button @click="searchFacilities" type="primary" size="small" style="font-size: 1vw">搜索</el-button>
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
                <div style="padding: 10px;">
                  <el-row>
                    <el-col :span="24">
                      <span><Icon class="icon" :Components='House'></Icon></span>
                      <span>{{ item[1] }}</span>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24">
                      <span><Icon class="icon" :Components='MapLocation'></Icon></span>
                      <span>{{ item[3] }}</span>
                    </el-col>
                  </el-row>

                  <el-row>
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
          <div v-if="results.length === 0" style="text-align: center; color: #c4bbbb; padding: 10px">
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

.container {
  position: absolute;
  padding-right: 15px;
  padding-bottom: 15px;
  width: 30vw;
  z-index: 10000;
  top: 15px;
  right: 15px;

  .positions {
    display: flex;
    justify-content: space-evenly;

    .el-button {
      font-size: 1vw;
      padding: 15px 10px;
    }
  }

  .conditions {
    margin-top: 15px;
    background-color: #0000006b;
    border-radius: 7px;

    .title {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 1.2vw;
      padding-top: 10px;
      padding-left: 5px;
      font-weight: 600
    }

    .content {
      padding: 0 15px;
      padding-bottom: 15px;
      font-size: 1.0vw !important;

      .label {
        text-align: right;
      }

      .el-row {
        padding: 7px 0;
      }
    }
  }

  .results {
    margin-top: 15px;
    background-color: #0000006b;
    border-radius: 7px;

    .title {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 1.2vw;
      padding-top: 10px;
      padding-left: 5px;
      font-weight: 600
    }

    .content {
      padding: 0 10px 20px 10px;

      .page {
        margin-top: 15px;
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
    //padding: 20px;
    padding: 10px;
    width: calc(100% - 20px);
    gap: 5px;
    flex: 1;
    align-content: flex-start;

    .con-item {
      cursor: pointer;
      width: 100%;
      //min-height: 75px;
      border: 1px solid #000;
      background-color: #0000006b;
      color: #fff;
      //height: 109px;

      .domicile {
        font-size: 14px;

        .icon {
          position: relative;
          top: 3px;
        }
      }

      .item-detail-top {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        padding-bottom: 5px;

        span {
          display: flex;
          align-items: center;
        }
      }

      .el-row {
        padding: 5px 0;
      }

      .item-detail {
        display: flex;
        justify-content: flex-end;
        padding-bottom: 5px;
      }
    }
  }

  .page {
    display: flex;
    justify-content: center;
  }
}

.icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5em;
}
</style>