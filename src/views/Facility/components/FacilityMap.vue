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
// 切换模式
let isDarkMode = ref(true)

watch(() => props.pois, (n, o) => {
  console.log(props.pois)
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
        longitude: parseFloat(p[10]),
        latitude: parseFloat(p[11]),
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
        ...p
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
  let spatialReference = new SpatialReference({
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
    spatialReference: spatialReference
  })
  // 天地图-注记
  let tiandituTextLayer = new WebTileLayer({
    urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=cva_w&x={col}&y={row}&l={level}&tk=" + apiKey,
    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    minScale: 74000000,
    spatialReference: spatialReference
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
    spatialReference: spatialReference
  })
  mapView.ui.components = []
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
        console.log(attrs)
        if(attrs.id === 'polygon_1') { // 判断是否点击了多边形图层
          mapView.popup.open({
            title: '标题',
            content: `<p>这是一段内容</p>`,
            location: e.mapPoint
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

<style scoped lang="less">
#facilityMapId {
  width: 100%;
  height: 86vh;
  position: relative;
  z-index: 9999;
}
</style>