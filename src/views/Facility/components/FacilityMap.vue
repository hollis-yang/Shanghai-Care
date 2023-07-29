<template>
    <div 
    id="facility-map">
    </div>
</template>
<script>
export default {
  mounted() {
    // 在组件加载后初始化地图
    this.initMap();
  },
  methods: {
    initMap() {
      // 加载ArcGIS API for JavaScript
      let options = {
        css: true,
        dojoConfig: {
          has: {
            "esri-featurelayer-webgl": 1 // 开启WebGL加速
          }
        }
      };
      const cssUrl = "https://js.arcgis.com/4.19/esri/themes/light/main.css";
      const jsUrl = "https://js.arcgis.com/4.19/";

      // 动态加载API模块
      const loadScript = (url) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.async = true;
          script.src = url;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      loadScript(cssUrl)
        .then(() => loadScript(jsUrl))
        .then(() => {
          // 初始化地图视图
          const mapView = new window.esri.views.MapView({
            container: "mapView",
            map: {
              basemap: "tdt-vector" // 设置底图为天地图矢量底图
            },
            center: [0, 0], // 设置地图中心点坐标
            zoom: 3 // 设置初始缩放级别
          });
        })
        .catch((error) => {
          console.error("无法加载ArcGIS API for JavaScript: ", error);
        });
    }
  }
};
</script>
