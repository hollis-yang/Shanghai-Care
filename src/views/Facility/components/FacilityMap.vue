<template>
  <div id="facilityMapId"></div>
</template>

<script setup>
import {loadModules} from "esri-loader"
import {onMounted, ref, watch} from "vue"
import {formatDistance} from "@/utils/distance"

const emits = defineEmits(['passSelectedPoint'])

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

// 展示信息配置项
const configs = [{
  xIdx: 10,
  yIdx: 11,
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
  xIdx: 7,
  yIdx: 8,
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
  xIdx: 3,
  yIdx: 4,
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
  xIdx: 2,
  yIdx: 3,
  symbolUrl: 'static/svg/PictureRounded.svg',
  facilityLayer: null,
  detailPopup: (attrs) => {
    return `
      <div style="color: rgb(209, 209, 209); background-color: rgb(36, 36, 36)">
      <div>据当前位置距离：${formatDistance(attrs[4])}</div>
      </div>`
  }
}, {
  xIdx: 2,
  yIdx: 3,
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

// 当前展示的配置项
let currentConfig = null

watch(() => props.pois, () => {
  addPoints()
})

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
        x: p[currentConfig.xIdx],
        y: p[currentConfig.yIdx],
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

const initMap = async () => {

  // 引入地图组件
  const [Map, MapView, SpatialReference, WebTileLayer, Point, Graphic, GraphicsLayer, Extent] = await loadModules(["esri/Map", "esri/views/MapView",
    "esri/geometry/SpatialReference", "esri/layers/WebTileLayer", "esri/geometry/Point", "esri/Graphic", "esri/layers/GraphicsLayer", "esri/geometry/Extent"])

  // 基础坐标系统
  spatialReference = new SpatialReference({
    // wkid: 3857
    wkid: 3857
  });

  // 创建地图
  map = new Map({
    // layers: [nursingLayer, hospitalLayer]
  });

  // apikey
  const apiKey = "4cbe0c2ea845e274ee8ba10d2785e590"
  // 天地图-矢量
  let tiandituLayer = new WebTileLayer({
    urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=" + apiKey,
    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    minScale: 74000000,
    spatialReference
  })
  // 天地图-注记
  let tiandituTextLayer = new WebTileLayer({
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
        mapViewCanvas.style.opacity = 0.8;
      }
    }
    mapView.on("mouse-wheel", function(event){
      //
      const baseScale = 10000;
      if(event.deltaY > 0 && mapView.scale > 100 * baseScale){
        event.stopPropagation()
        return false
      }
      if(event.deltaY < 0 && mapView.scale < 10 * baseScale){
        event.stopPropagation()
        return false
      }
    })
  })

  // 点位图层
  configs.forEach(c => {
    c.facilityLayer = new GraphicsLayer()
    map.add(c.facilityLayer)
  })
  selectPointLayer = new GraphicsLayer()
  map.add(selectPointLayer)

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
                x: attrs[currentConfig.xIdx],
                y: attrs[currentConfig.yIdx],
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

onMounted(() => {
  initMap()
});

</script>

<style lang="less">
// 自定义arcgis弹窗样式
.esri-popup__inline-actions-container,
.esri-popup__button--dock {
  display: none;
}


</style>

<style scoped lang="less">
#facilityMapId {
  width: 100%;
  height: 86vh;
  position: relative;
  z-index: 9999;
}
</style>