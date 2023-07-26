<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// init
const mapRef = ref(null)  // DOM
const shanghai = ref([])
let chartInstance

const initChart = async () => {
  chartInstance = echarts.init(mapRef.value, 'dark')

  // 获取上海矢量数据
  // const sql = "SELECT data FROM shanghai WHERE district = 'all2';"
  // const res = await getSQLAPI(sql)
  // console.log(res)
  // shanghai.value = res[0][1]

  // const res2 = await getSQLAPI('shanghai')
  // console.log(res2)

  // fetch('/map/shanghai')
  // .then(response => response.json())
  // .then(data => {
  //   // 在这里处理返回的JSON数据
  //   console.log(data);
  // });


  // const filename = "shanghai.json"; // 文件名，根据实际情况调整
  // fetch(`/map/${filename}`)
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     console.log(data);
  //   })
  //   .catch(error => {
  //     console.error('Fetch error:', error);
  //   });

  function fetchGeoJSONFromGitHub() {
    const url = 'https://raw.githubusercontent.com/hollis-yang/hollisyang.github.io/main/simplified_geojson_file.geojson';

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`文件下载失败，状态码：${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // 输出解析后的JavaScript对象到控制台
        console.log('获取到的GeoJSON数据：', data);

        // 在这里可以继续处理数据，比如渲染地图等操作
      })
      .catch(error => {
        console.error(error.message);
      });
  }
  // 调用函数来下载GeoJSON文件
  fetchGeoJSONFromGitHub();



  // 将矢量数据注册到地图
  echarts.registerMap('shanghai', shanghai.value)

  // 图表初始化配置
  const initOption = {
    geo: [
      {
        type: 'map',
        map: 'shanghai',
        itemStyle: {
          areaColor: '#2e72bf',
          borderColor: '#333'
        },
        zoom: 1.2
      }
    ]
  }
  chartInstance.setOption(initOption)
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div ref="mapRef"></div>
</template>

<style scoped lang="less"></style>