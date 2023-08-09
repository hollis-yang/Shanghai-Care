<template>
  <div id="facilityMapId"></div>
</template>

<script setup>
import {loadModules} from "esri-loader"
import {onMounted, ref, watch} from "vue"
import {getSQLAPI} from "@/apis/mysql"

const props = defineProps({
  pois: Array
});

let nursingLayer = null
let hospitalLayer = null

let map = null
let mapView = null
// 坐标系
let spatialReference = null
// 切换模式
let isDarkMode = ref(true)

watch(() => props.pois, (n, o) => {
  addPoints()
})

const addPoints = async () => {
  const [Map, MapView, SpatialReference, WebTileLayer, Point, Graphic, Extent] = await loadModules(["esri/Map", "esri/views/MapView",
    "esri/geometry/SpatialReference", "esri/layers/WebTileLayer", "esri/geometry/Point", "esri/Graphic", "esri/geometry/Extent"])

  nursingLayer.removeAll()
  let points = []
  props.pois.forEach(p => {
    const pointGraphic = new Graphic({
      geometry: {
        type: "point",
        x: p[10],
        y: p[11],
        spatialReference
      },
      symbol: {
        type: "simple-marker",
        style: "square",
        color: "blue",
        size: "18px",
        outline: {
          color: [ 255, 255, 0 ],
          width: 3
        }
      },
      attributes: {
        ...p,
        type: 'facilityPoint'
      }
    })

    points.push(pointGraphic)
  })

  nursingLayer.addMany(points)
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
  const apiKey = "8d915f545dada286c4465188fb436171"
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
  mapView.ui.components = []
  // 去掉底部文字
  mapView.isAttributionTextVisible = false
  // 左键单击可以展示弹窗
  mapView.popup.autoOpenEnabled = false
  mapView.when(() => {
    if (isDarkMode.value) {
      // 设置暗黑模式
      const mapViewCanvas = mapView.container.querySelector('canvas')
      if (mapViewCanvas) {
        mapViewCanvas.style.filter = 'grayscale(100%) invert(100%)'
        mapViewCanvas.style.opacity = 0.7
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
  nursingLayer = new GraphicsLayer()
  hospitalLayer = new GraphicsLayer()

  map.add(nursingLayer)
  map.add(hospitalLayer)

  // 获取点击位置元素
  mapView.on('click', (e) => {

    mapView.hitTest(e).then((e2) => {
      e2.results.forEach(e3 => {
        let attrs = e3.graphic.attributes
        if(attrs && attrs.type === 'facilityPoint') { // 判断是否点击地图上展示的设施点位
          mapView.popup.open({
            title: attrs[1],
            content: `<div style="color: rgb(209, 209, 209); background-color: rgb(36, 36, 36)">123</div>`,
            location: new Point({
              x: attrs[10],
              y: attrs[11],
              spatialReference
            }),
            // featureMenuOpen: true
          })
        }
      })
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