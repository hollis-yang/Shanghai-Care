<template>
    <div id="facilityMapId"></div>
  </template>
  
  <script setup>
  import { loadModules } from "esri-loader";
  import { onMounted, ref } from "vue";
  
  let map = null
  let mapView = null
  // 切换模式
  let isDarkMode = ref(true)
  
  const initMap = async ()=>{
    // 引入地图组件
    const [Map, MapView, SpatialReference, WebTileLayer, Point, Extent] = await loadModules(["esri/Map", "esri/views/MapView",
      "esri/geometry/SpatialReference", "esri/layers/WebTileLayer", "esri/geometry/Point", "esri/geometry/Extent"])
  
    // 基础坐标系统
    let spatialReference = new SpatialReference({
      wkid: 3857
    });
  
    // 创建地图
    map = new Map({});
  
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
    mapView.ui.components = [];
    mapView.when(() => {
      if(isDarkMode.value){
        // 设置暗黑模式
        const mapViewCanvas = mapView.container.querySelector('canvas');
        if (mapViewCanvas) {
          mapViewCanvas.style.filter = 'grayscale(100%) invert(100%)';
          mapViewCanvas.style.opacity = 0.7;
        }
      }
    })
  }
  
  onMounted(()=>{
    initMap()
  });
  
  </script>
  
  <style scoped lang="less">
  #facilityMapId{
    width: 100%;
    height: 90vh;
    position:relative;
    z-index: 9999;
  }
  </style>
  