<script setup>
import NursingHeader from './components/NursingHeader.vue'
import NursingAge from './components/NursingAge.vue'
import NursingMap from './components/NursingMap.vue'
import NursingDistrict from './components/NursingDistrict.vue'
import NursingEducation from './components/NursingEducation.vue'
import NursingLicense from './components/NursingLicense.vue'
import NursingWork from './components/NursingWork.vue'
import ChangeRoute from './components/ChangeRoute.vue'
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
</script>

<template>
  <div class="nursing-container">
    <div class="nursing-header">
      <NursingHeader></NursingHeader>
    </div>

    <div class="nursing-route">
      <ChangeRoute></ChangeRoute>
    </div>

    <div class="nursing-age">
      <NursingAge class="chart"></NursingAge>
    </div>

    <div class="nursing-map">
      <NursingMap class="chart"></NursingMap>
    </div>

    <div class="nursing-district">
      <NursingDistrict class="chart"></NursingDistrict>
    </div>

    <div class="nursing-education">
      <NursingEducation class="chart"></NursingEducation>
    </div>

    <div class="nursing-license">
      <NursingLicense class="chart"></NursingLicense>
    </div>

    <div class="nursing-work">
      <NursingWork class="chart"></NursingWork>
    </div>

    <div class="map-title-border">
      <div demo-bg class="dataV">
        <dv-border-box8 :reverse="true">
          <div dv-bg>
            <div class="desc">上海市各区护理员人数</div>
          </div>
        </dv-border-box8>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.nursing-container {
  position: relative;
}

.nursing-route {
  position: absolute;
  top: 12vh;
  left: 4vw;
}

.nursing-age {
  position: absolute;
  top: 18vh;
  left: 4vw;

  .chart {
    width: 22vw;
    height: 38vh;
  }
}

.nursing-map {
  position: absolute;
  top: 9vh;
  left: 28vw;

  .chart {
    width: 44vw;
    height: 51vh;
  }
}

.nursing-district {
  position: absolute;
  top: 64vh;
  left: 28vw;

  .chart {
    width: 44vw;
    height: 33vh;
  }
}

.nursing-education {
  position: absolute;
  top: 58vh;
  left: 4vw;

  .chart {
    width: 22vw;
    height: 37.8vh;
  }
}

.nursing-license {
  position: absolute;
  top: 12vh;
  left: 74vw;

  .chart {
    width: 23vw;
    height: 43vh;
  }
}

.nursing-work {
  position: absolute;
  top: 57vh;
  left: 72vw;

  .chart {
    width: 26vw;
    height: 38.8vh;
  }
}

.map-title-border {
  position: absolute;
  top: 11vh;
  left: 41vw;

  .dataV {
    width: 18vw;
    height: 6vh;
    text-align: center;
    padding-top: 1vh;
  }

  .desc {
    font-weight: 700;
    font-size: 1.5vw;
    padding-top: 1vh;
  }
}
</style>