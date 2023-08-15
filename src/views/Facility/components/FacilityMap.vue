<template>
  <div id="facilityMapId"></div>
  <div class="layers">
    <p class="title">
      <span class="icon-span"><svg t="1692010984183" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5214" width="18" height="18" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M510.3 754.4c-22.9 0-45.7-7.5-63.6-22.6L91.5 537.2l-1.9-1.7C55.8 505.1 51.7 456 80 421.1l34.7 28.2c-12.7 15.7-11.3 36.9 3.1 51.3L472.6 695l1.9 1.7c19.4 17.4 52.1 17.5 71.5 0l1.9-1.7 354.8-194.3c14.4-14.4 15.8-35.6 3.1-51.3l34.7-28.2c28.3 34.8 24.2 84-9.6 114.3l-1.9 1.7-355.2 194.6c-17.8 15-40.7 22.6-63.5 22.6z" p-id="5215" fill="#ffffff"></path><path d="M510.3 946.6c-22.9 0-45.7-7.5-63.6-22.6L91.5 729.4l-1.9-1.7c-33.7-30.4-37.8-79.5-9.6-114.3l34.7 28.2c-12.7 15.7-11.3 36.9 3.1 51.3l354.8 194.3 1.9 1.7c19.4 17.4 52.1 17.5 71.5 0l1.9-1.7 354.8-194.3c14.4-14.4 15.8-35.6 3.1-51.3l34.7-28.2c28.3 34.8 24.2 84-9.6 114.3l-1.9 1.7L573.8 924c-17.8 15.1-40.7 22.6-63.5 22.6zM916.1 275.6L561 85.6c-28-25.2-73.4-25.2-101.4 0l-355.1 190c-25.3 22.8-27.7 58.4-7.2 83.6 2.2 2.7 4.5 5.2 7.2 7.7l56.1 30.7 299 163.8c28 25.2 73.4 25.2 101.4 0l299-163.8 56.1-30.7c2.7-2.4 5-5 7.2-7.7 20.4-25.2 18.1-60.8-7.2-83.6z" p-id="5216" fill="#ffffff"></path></svg></span>
      <span>图层</span>
    </p>
<!--    <el-tooltip-->
<!--        class="box-item"-->
<!--        effect="dark"-->
<!--        content="天地图底图"-->
<!--        placement="right"-->
<!--    >-->
<!--      <div class="item">-->
<!--        <el-checkbox v-model="state.layers.showMap" @change="handleShowMap" style="height: auto; color: white;">地图</el-checkbox>-->
<!--      </div>-->
<!--    </el-tooltip>-->
    <el-tooltip
        class="box-item"
        effect="dark"
        content="反映上海全市范围内养老设施相关地点分布情况"
        placement="right"
    >
      <div class="item">
        <el-checkbox v-model="state.layers.showHeatMap" @change="handleShowHeatMap" style="height: auto; color: white;">热力图</el-checkbox>
      </div>
    </el-tooltip>
    <el-tooltip
        class="box-item"
        effect="dark"
        content="反映上海各区老年人口和养老院的比例"
        placement="right"
    >
      <div class="item">
        <el-checkbox v-model="state.layers.showRatioMap" @change="handleShowRatioMap" style="height: auto; color: white;">比例图</el-checkbox>
      </div>
    </el-tooltip>
  </div>
  <div class="legends">
    <div class="ratio-map-legend" v-if="state.ratioMapLegend.length !== 0">
      <p class="title">比例图图例 </p>
      <p class="unit">单位：人/设施</p>
      <div class="row" v-for="l in state.ratioMapLegend">
        <span class="color" :style="{'background-color': l.color}"></span>
        <span class="value">
          {{ l.min }} ~ {{ l.max }}
        </span>
      </div>
    </div>
  </div>
<!--  <button @click="addHeatMap">生成热力图</button>-->
</template>

<script setup>
import {loadModules} from "esri-loader";
import {onMounted, reactive, ref, watch} from "vue";
import {formatDistance} from "@/utils/distance";
import {getSQLAPI} from "@/apis/mysql";
import {mapRangeToColor} from "@/utils/color";

const emits = defineEmits(['passSelectedPoint']);

const props = defineProps({
  pois: Array,
  displayId: Number,
  mapMode: String,  // normal：常规模式；selectPoint：选点模式
});

let map = null
let mapView = null
// 坐标系
let spatialReference = null
// 切换模式
let isDarkMode = ref(false)

let selectPointLayer = null

let tiandituLayer = null
let tiandituTextLayer = null

let heatMapLayer = null
const heatMapLevel = {
  x: 200,
  y: 200
}

let ratioMapLayer = null

// 展示信息配置项
const configs = [{
  xIdx: 14,
  yIdx: 15,
  symbolUrl: 'static/svg/HomeFilled.svg',
  facilityLayer: null,
  detailPopup: (attrs) => {
    let foundDate = new Date(attrs[2])
    return `
      <div style="color: rgb(209, 209, 209); background-color: rgb(36, 36, 36)">
        <div>成立时间：${foundDate.getFullYear()}年${foundDate.getMonth() + 1}月${foundDate.getDate()}日</div>
        <div>地址：${attrs[3]}</div>
        <div>所在区：${attrs[4]}</div>
        <div>可用/全部床位：${attrs[6]}/${attrs[5]}</div>
        <div>价格：${attrs[7]}</div>
      </div>`
  }
}, {
  xIdx: 11,
  yIdx: 12,
  symbolUrl: 'static/svg/Loading.svg',
  facilityLayer: null,
  detailPopup: (attrs) => {
    return `
      <div style="color: rgb(209, 209, 209); background-color: rgb(36, 36, 36)">
        <div>地址：${attrs[2]}</div>
        <div>性质：${attrs[3]}医院</div>
        <div>类型：${attrs[4]}</div>
        <div>等级：${attrs[5] ? attrs[5] + '医院' : '暂无信息'}</div>
        <div>重要科室：${attrs[6] ? attrs[6] : '暂无信息'}</div>
      </div>`
  }
}, {
  xIdx: 7,
  yIdx: 8,
  symbolUrl: 'static/svg/Star.svg',
  facilityLayer: null,
  detailPopup: (attrs) => {
    return `
      <div style="color: rgb(209, 209, 209); background-color: rgb(36, 36, 36)">
        <div>地址：${attrs[2]}</div>
        <div>据当前位置距离：${formatDistance(attrs[5])}</div>
      </div>`
  }
}, {
  xIdx: 6,
  yIdx: 7,
  symbolUrl: 'static/svg/PictureRounded.svg',
  facilityLayer: null,
  detailPopup: (attrs) => {
    return `
      <div style="color: rgb(209, 209, 209); background-color: rgb(36, 36, 36)">
      <div>据当前位置距离：${formatDistance(attrs[4])}</div>
      </div>`
  }
}, {
  xIdx: 8,
  yIdx: 9,
  symbolUrl: 'static/svg/Position.svg',
  facilityLayer: null,
  detailPopup: (attrs) => {
    return `
      <div style="color: rgb(209, 209, 209); background-color: rgb(36, 36, 36)">
      <div>类型：${attrs[4]}</div>
      <div>所在区：${attrs[5]}</div>
      </div>`
  }
}]

let districtMap = {}

// 当前展示的配置项
let currentConfig = null

watch(() => props.displayId, () => {
  clearFacilityLayer()
  clearSelectPoint()
})

watch(() => props.pois, () => {
  addPoints()
})

// 当地图模式变为 'normal' 时，清空选择点位标记
watch(() => props.mapMode, () => {
  if ('normal' === props.mapMode) {
    selectPointLayer.removeAll()
  }
})

const state = reactive({
  layers: {
    showMap: true,
    showHeatMap: false,
    showRatioMap: false
  },
  ratioMapLegend: []
})

const fetchDistrictMap = () => {
  fetch('json/shanghai.json').then(res => {
    res.json().then(data => {
      data.features.forEach(e => {
        districtMap[e.properties.name] = e.geometry.coordinates.flat()
      })
    })
  })
}

const addPoints = async () => {
  const [Map, MapView, SpatialReference, WebTileLayer, Point, Graphic, Extent] = await loadModules(["esri/Map", "esri/views/MapView",
    "esri/geometry/SpatialReference", "esri/layers/WebTileLayer", "esri/geometry/Point", "esri/Graphic", "esri/geometry/Extent"])

  currentConfig = configs[props.displayId]

  // 移除所有图层上的全部点位
  configs.forEach(c => c.facilityLayer.removeAll())

  // 移除当前展示点位


  let points = []
  props.pois.forEach(p => {
    const pointGraphic = new Graphic({
      geometry: {
        type: "point",
        // x: p[currentConfig.xIdx],
        // y: p[currentConfig.yIdx],
        longitude: p[currentConfig.xIdx],
        latitude: p[currentConfig.yIdx],
        spatialReference
      },
      symbol: {
        type: 'picture-marker',
        url: currentConfig.symbolUrl,
        width: 15,
        height: 15,
      },
      attributes: {
        ...p,
        type: 'facilityPoint'
      }
    })

    points.push(pointGraphic)
  })

  currentConfig.facilityLayer.addMany(points)
}

const clearFacilityLayer = () => {
  configs.forEach(c => {
    c.facilityLayer.removeAll()
  })
}

const clearSelectPoint = () => {
  if (selectPointLayer) selectPointLayer.removeAll()
}

const initMap = async () => {

  // 引入地图组件
  const [Map,
    MapView,
    SpatialReference,
    WebTileLayer,
    Point,
    Graphic,
    GraphicsLayer,
    Extent,
    FeatureLayer,
    HeatmapRenderer
  ] = await loadModules([
    "esri/Map",
    "esri/views/MapView",
    "esri/geometry/SpatialReference",
    "esri/layers/WebTileLayer",
    "esri/geometry/Point",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Extent",
    "esri/layers/FeatureLayer",
    "esri/renderers/HeatmapRenderer"])

  // 基础坐标系统
  spatialReference = new SpatialReference({
    wkid: 3857
    // wkid: 4326
  });

  // 创建地图
  map = new Map({
    // layers: [nursingLayer, hospitalLayer]
  });

  // apikey
  const apiKey = "8d915f545dada286c4465188fb4361710"
  // const apiKey = "7b13a4031f051b6317cdcca67ae391f1"
  // 天地图-矢量
  tiandituLayer = new WebTileLayer({
    urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=" + apiKey,
    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    minScale: 74000000,
    spatialReference
  })
  // 天地图-注记
  tiandituTextLayer = new WebTileLayer({
    urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=cva_w&x={col}&y={row}&l={level}&tk=" + apiKey,
    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    minScale: 74000000,
    spatialReference
  })
  map.addMany([tiandituLayer, tiandituTextLayer])

  // view
  mapView = new MapView({
    container: "facilityMapId",
    map: map,
    zoom: 10,
    // constraints: {
    //   minScale: 74000000,
    //   maxScale: 2000
    // }
  });
  mapView.center = new Point({
    longitude: 121.472644,
    latitude: 31.231706,
    // x: 13513700,
    // y: 3658510,
    spatialReference
  })
  // 去掉控件
  mapView.ui.components = [];
  // 去掉底部文字
  mapView.isAttributionTextVisible = false
  // 左键单击可以展示弹窗
  mapView.popup.autoOpenEnabled = false;
  mapView.when(() => {
    if (isDarkMode.value) {
      // 设置暗黑模式
      const mapViewCanvas = mapView.container.querySelector('canvas');
      if (mapViewCanvas) {
        mapViewCanvas.style.filter = 'grayscale(100%) invert(100%)';
        mapViewCanvas.style.opacity = 0.7;
      }
    }
  })

  // 点位图层
  configs.forEach(c => {
    c.facilityLayer = new GraphicsLayer()
    map.add(c.facilityLayer)
  })
  selectPointLayer = new GraphicsLayer()
  map.add(selectPointLayer)

  // 比例图图层
  ratioMapLayer = new GraphicsLayer()
  map.add(ratioMapLayer)

  // 获取点击位置元素
  mapView.on('click', (e) => {
    mapView.hitTest(e).then((e2) => {
      // 点击空白处
      if (e2.results.length === 0) {
        if (props.mapMode === 'selectPoint') {
          // 传递选中点位信息
          emits('passSelectedPoint', {
            x: e.mapPoint.x,
            y: e.mapPoint.y,
            longitude: e.mapPoint.longitude,
            latitude: e.mapPoint.latitude
          })
          // 添加选中点位展示
          selectPointLayer && selectPointLayer.removeAll()
          const pointGraphic = new Graphic({
            geometry: {
              type: "point",
              x: e.mapPoint.x,
              y: e.mapPoint.y,
              spatialReference
            },
            symbol: {
              type: 'picture-marker',
              url: 'static/svg/Point.svg',
              width: 15,
              height: 15,
            },
            attributes: {
              type: 'selectPoint'
            }
          })
          selectPointLayer && selectPointLayer.add(pointGraphic)
        }
      } else {
        e2.results.forEach(e3 => {
          let attrs = e3.graphic.attributes
          if (attrs && attrs.type === 'facilityPoint') { // 判断是否点击地图上展示的设施点位
            mapView.popup.open({
              title: attrs[1],
              content: currentConfig.detailPopup(attrs),
              location: new Point({
                // x: attrs[currentConfig.xIdx],
                // y: attrs[currentConfig.yIdx],
                longitude: attrs[currentConfig.xIdx],
                latitude: attrs[currentConfig.yIdx],
                spatialReference
              }),
              // featureMenuOpen: true
            })
          }
        })
      }
    })
  })
}

const handleShowMap = () => {
  if (state.layers.showMap) {
    if (tiandituLayer) map.add(tiandituLayer)
    if (tiandituTextLayer) map.add(tiandituTextLayer)
  } else {
    if (tiandituLayer) map.remove(tiandituLayer)
    if (tiandituTextLayer) map.remove(tiandituTextLayer)
  }
}

const handleShowHeatMap = async () => {
  // 展示热力图
  if (state.layers.showHeatMap) {
    // 引入地图组件
    let [Map,
      MapView,
      SpatialReference,
      WebTileLayer,
      Point,
      Graphic,
      GraphicsLayer,
      Extent,
      FeatureLayer,
      HeatmapRenderer
    ] = await loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/geometry/SpatialReference",
      "esri/layers/WebTileLayer",
      "esri/geometry/Point",
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
      "esri/geometry/Extent",
      "esri/layers/FeatureLayer",
      "esri/renderers/HeatmapRenderer"])

    // getSQLAPI('SELECT district, COUNT(*) as num FROM `nursinghome` GROUP BY district').then(res => {
    //   console.log(res)
    // })
    let [xMax, yMax, xMin, yMin] = (await getSQLAPI('SELECT max(x), max(y), min(x), min(y) FROM `nursing_homes`'))[0]
    let response = await getSQLAPI('SELECT * FROM `nursing_homes`')

    let xInterval = (xMax - xMin) / heatMapLevel.x
    let yInterval = (yMax - yMin) / heatMapLevel.y

    let data1 = []
    for (let i = 0; i < heatMapLevel.x; i++) {
      data1.push([])
      for (let j = 0; j < heatMapLevel.y; j++) {
        data1[i].push({
          // 方格中心点位坐标
          x: xMin + xInterval * i,
          y: yMin + yInterval * j,
          count: 0
        })
      }
    }

    response.forEach(e => {
      let xIdx = Math.floor((e[10] - xMin) / xInterval)
      let yIdx = Math.floor((e[11] - yMin) / yInterval)
      if (xIdx >= heatMapLevel.x) {
        xIdx = heatMapLevel.x - 1
      }
      if (yIdx >= heatMapLevel.y) {
        yIdx = heatMapLevel.y - 1
      }

      data1[xIdx][yIdx].count++
    })

    if (heatMapLayer) map.remove(heatMapLayer)

    let rendererT = {
      type: "heatmap",
      field: 'crime_count',
      colorStops: [
        {color: "rgba(63, 40, 102, 0)", ratio: 0},
        {color: "#00AFFF", ratio: 0.1},
        {color: "#14B441", ratio: 0.3},
        {color: "#FFFA00", ratio: 0.7},
        {color: "#FF4600", ratio: 1}
      ],
      maxPixelIntensity: 100,
      minPixelIntensity: 0
    };

    let features = [];
    let data = data1.flat()
    for (let i = 0; i < data.length; i++) {
      features.push({
        geometry: {
          type: "point",
          x: data[i].x,//经度
          y: data[i].y,//纬度
          spatialReference,//坐标系
        },
        attributes: {
          ObjectID: i,
          crime_count: data[i].count
        }
      })
    }

    heatMapLayer = new FeatureLayer({
      geometryType: "point",
      source: features,
      title: "热力图",
      fields: [{name: "ObjectID", alias: "ObjectID", type: "oid"}, {
        name: "crime_count",
        alias: "crime_count",
        type: "integer"
      }],
      objectIdField: "ObjectID",
      renderer: rendererT,
    });

    map.add(heatMapLayer)
  } else {
    if (heatMapLayer) map.remove(heatMapLayer)
  }
}

const handleShowRatioMap = async () => {
  if (state.layers.showRatioMap) {
    // 引入地图组件
    let [Map,
      MapView,
      SpatialReference,
      WebTileLayer,
      Point,
      Graphic,
      GraphicsLayer,
      Extent,
      FeatureLayer,
      HeatmapRenderer
    ] = await loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/geometry/SpatialReference",
      "esri/layers/WebTileLayer",
      "esri/geometry/Point",
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
      "esri/geometry/Extent",
      "esri/layers/FeatureLayer",
      "esri/renderers/HeatmapRenderer"])

    // 查询 各区常驻老年人口 / 各区养老院设施数量 比率
    let ratioMap = {}
    getSQLAPI("SELECT op.district, ((op.100in1million / 100) * op.pop_changzhu) / gnh.num as ratio FROM oldpop as op, (SELECT nh.district, COUNT(nh.id) as num FROM nursing_homes as nh GROUP BY nh.district)as gnh WHERE op.district = gnh.district").then(res => {
      if (ratioMapLayer) ratioMapLayer.removeAll()

      res.forEach(r => {
        ratioMap[r[0]] = Math.ceil(r[1])
      })

      let min = Math.min(...Object.values(ratioMap))
      let max = Math.max(...Object.values(ratioMap))
      for (let key in ratioMap) {
        const polygonGraphic = new Graphic({
          geometry: {
            type: "polygon",
            rings: districtMap[key]
          },
          symbol: {
            type: "simple-fill",
            color: mapRangeToColor(ratioMap[key], min, max, {
              r: 251,
              g: 210,
              b: 188
            },{
              r: 204,
              g: 80,
              b: 70
            }),
            outline: {
              color: [255, 255, 255],
              width: 1
            }
          }
        })

        ratioMapLayer.add(polygonGraphic)
      }

      // 写入图例数据
      let interval = (max - min) / 5
      for (let i = 0; i < 5; i++) {
        state.ratioMapLegend.push({
          color: mapRangeToColor(min + i * interval, min, max, {
            r: 251,
            g: 210,
            b: 188
          },{
            r: 204,
            g: 80,
            b: 70
          }),
          min: Math.round(min + i * interval),
          max: Math.round(min + (i + 1) * interval)
        })
      }
    })

  } else {
    // 移除比例图图层
    if (ratioMapLayer) ratioMapLayer.removeAll()
    // 清空图例数据
    state.ratioMapLegend = []
  }
}

onMounted(() => {
  initMap()
  fetchDistrictMap()
});

</script>

<style lang="less">
// 自定义arcgis弹窗样式
.esri-popup__inline-actions-container,
.esri-popup__button--dock {
  display: none;
}

.el-popper {
  z-index: 20000!important;
  font-size: 1.0vw;
}

.layers {
  .el-checkbox__label {
    font-size: 1.0vw;
  }
}

</style>

<style scoped lang="less">

.layers {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1vw;
  z-index: 20000;
  display: flex;
  flex-direction: column;
  background-color: rgba(150, 127, 127, 0.7);
  border-radius: 0.5vw;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0.5vh;
    text-align: center;
    font-size: 1.0vw;

    .icon-span {
      padding-top: 0.15vw;
      margin-right: 0.15vw;
    }
  }

  .item {
    padding: 0.5vh 0.7vw;
    cursor: pointer;
    border-top: 1px solid #eee;
  }
}

.legends {
  position: absolute;
  bottom: 1.5vh;
  left: 1vw;
  z-index: 20000;
  display: flex;

  .ratio-map-legend {
    background-color: rgba(150, 127, 127, 0.7);
    border-radius: 0.5vw;
    padding: 0.5vh 1.0vh;

    .title {
      font-size: 1.2vw;
      margin: 0;
      padding: 0.5vh 0;
      text-align: center;
    }

    .unit {
      font-size: 1.0vw;
      margin: 0;
      padding: 0.5vh 0;
      text-align: center;
    }

    .row {
      display: flex;
      align-items: center;
      padding: 0.25vh 0;

      .color {
        background-color: red;
        display: inline-block;
        width: 2.5vw;
        height: 2.0vh;
        border-radius: 0.2vw;
        margin-right: 0.4vw;
      }

      .value {
        font-size: 1.0vw;
      }
    }

  }
}

#facilityMapId {
  width: 100%;
  height: 86vh;
  position: relative;
  z-index: 99;
}
</style>