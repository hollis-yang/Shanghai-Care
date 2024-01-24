(function () {
  var r = new RegExp("(^|(.*?\\/))(include-leaflet\.js)(\\?|$)"),
      s = document.getElementsByTagName('script'), targetScript;
  for (var i = 0; i < s.length; i++) {
    var src = s[i].getAttribute('src');
    if (src) {
      var m = src.match(r);
      if (m) {
        targetScript = s[i];
        break;
      }
    }
  }

  function inputScript(url) {
    var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
    document.writeln(script);
  }

  function inputCSS(url) {
    var css = '<link rel="stylesheet" href="' + url + '">';
    document.writeln(css);
  }

  function inArray(arr, item) {
    for (i in arr) {
      if (String(arr[i]).trim() == item) {
        return true;
      }
    }
    return false;
  }

  function supportES6() {
    var code = "'use strict'; class Foo {}; class Bar extends Foo {};";
    try {
      (new Function(code))();
    } catch (err) {
      return false;
    }
    if (!Array.from) {
      return false;
    }
    return true;
  }

  //加载类库资源文件
  function load() {
    var includes = (targetScript.getAttribute('include') || "").split(",");
    var excludes = (targetScript.getAttribute('exclude') || "").split(",");

    // for import shape
    // document.writeln('<button id="kqImportShapeUploadBtn" type="button"></button>');

    if (!inArray(excludes, 'jquery')) {
      inputScript(window.lib_path + "/jquery/jquery.min.js");
    }

    if (!inArray(excludes, 'leaflet')) {
      inputCSS(window.lib_path + "/leaflet/leaflet.css");
      inputScript(window.lib_path + "/leaflet/leaflet.js");
    }
    if (!inArray(excludes, 'proj4js')) {
      inputScript(window.lib_path + "/proj4js/proj4.js");
    }
    if (!inArray(excludes, 'iconfont')) {
      inputCSS(window.lib_path + "/iconfont/iconfont.css");
      inputScript(window.lib_path + "/iconfont/iconfont.js");
    }
    if (inArray(includes, 'mapv')) {
      inputScript(window.lib_path + "/mapv/mapv.min.js");
    }
    if (inArray(includes, 'turf')) {
      inputScript(window.lib_path + "/Turf/turf.min.js");
    }
    if (inArray(includes, 'echarts')) {
      inputScript(window.lib_path + "/echarts/echarts.min.js");
    }
    if (inArray(includes, 'leaflet.heatmap')) {
      inputScript(window.lib_path + "/leaflet-heat/leaflet-heat.js");
    }
    if (inArray(includes, 'leaflet.osmbuildings')) {
      inputScript(window.lib_path + "/leaflet.osmbuildings/OSMBuildings-Leaflet.debug.js");
    }
    if (inArray(includes, 'leaflet.markercluster')) {
      inputCSS(window.lib_path + "/leaflet.markercluster/MarkerCluster.Default.css");
      inputCSS(window.lib_path + "/leaflet.markercluster/MarkerCluster.css");
      inputScript(window.lib_path + "/leaflet.markercluster/leaflet.markercluster.js");
    }
    if (inArray(includes, 'leaflet.icon.pulse')) {
      inputCSS(window.lib_path + "/leaflet-icon-pulse/L.Icon.Pulse.css");
      inputScript(window.lib_path + "/leaflet-icon-pulse/L.Icon.Pulse.js");
    }
    if (inArray(includes, 'leaflet.draw')) {
      inputCSS(window.lib_path + "/leaflet.draw/leaflet.draw.css");
      inputScript(window.lib_path + "/leaflet.draw/leaflet.draw.js");
    }
    if (inArray(includes, 'leaflet.pm')) {
      inputCSS(window.lib_path + "/leaflet.pm/leaflet.pm.css");
      inputScript(window.lib_path + "/leaflet.pm/leaflet.pm.min.js");
    }
    if (inArray(includes, 'leaflet.minimap')) {
      inputCSS(window.lib_path + "/leaflet.minimap/Control.MiniMap.min.css");
      inputScript(window.lib_path + "/leaflet.minimap/Control.MiniMap.min.js");
    }
    if (inArray(includes, 'leaflet.sidebyside')) {
      inputScript(window.lib_path + "/leaflet-side-by-side/leaflet-side-by-side.min.js");
    }
    if (inArray(includes, 'leaflet.easybutton')) {
      inputCSS(window.lib_path + "/leaflet.easybutton/easy-button.css");
      inputScript(window.lib_path + "/leaflet.easybutton/easy-button.js");
    }
    if (inArray(includes, 'fontawesome')) {
      inputCSS(window.lib_path + "/font-awesome/css/font-awesome.css");
    }

    if (inArray(includes, 'papaparse')) {
      inputScript(window.lib_path + "/papaparse/papaparse.min.js");
    }

    if (inArray(includes, 'colorfilter')) {
      inputScript(window.lib_path + "/leaflet-tilelayer-colorfilter/leaflet-tilelayer-colorfilter.min.js");
    }

    if (inArray(includes, 'extramarkers')) {
      inputCSS(window.lib_path + "/Leaflet.ExtraMarkers/css/leaflet.extra-markers.min.css");
      inputScript(window.lib_path + "/Leaflet.ExtraMarkers/js/leaflet.extra-markers.min.js");
    }

    if (inArray(includes, 'snakeanim')) {
      inputScript(window.lib_path + "/snakeanim/L.Polyline.SnakeAnim.js");
    }

    if (inArray(includes, 'antpath')) {
      inputScript(window.lib_path + "/leaflet-ant-path/leaflet-ant-path.js");
    }

    if (inArray(includes, 'mapbox-gl')) {
      inputCSS(window.lib_path + "/mapbox-gl/mapbox-gl.css");
      inputScript(window.lib_path + "/mapbox-gl/mapbox-gl.js");
    }

    if (inArray(includes, 'imagetransform')) {
      inputScript(window.lib_path + "/Leaflet.imageTransform/L.ImageTransform.js");
    }

    if (inArray(includes, "TileLayer.Grayscale")) {
      inputScript(window.lib_path + "/TileLayer.Grayscale/TileLayer.Grayscale.js")
    }

    if (inArray(includes, 'marker-highight')) {
      inputCSS(window.lib_path + "/leaflet.marker.highlight/leaflet.marker.highlight.css");
      inputScript(window.lib_path + "/leaflet.marker.highlight/leaflet.marker.highlight.js");
    }

    if (inArray(includes, 'custom-layer')) {
      inputScript(window.lib_path + "/Leaflet.CustomLayer/Leaflet.CustomLayer.js");
    }

    if (inArray(includes, "canvas-markers")) {
      inputScript(window.lib_path + "/Leaflet.Canvas-Markers/leaflet.canvas-markers.js")
    }

    if (inArray(includes, "magic-marker")) {
      inputCSS(window.lib_path + "/leaflet.magicMarker/magic.min.css");
      inputCSS(window.lib_path + "/leaflet.magicMarker/leaflet.magicMarker.css");
      inputScript(window.lib_path + "/leaflet.magicMarker/leaflet.magicMarker.js");
    }

    if (inArray(includes, "label-text-collision")) {
      inputScript(window.lib_path + "/Leaflet.LabelTextCollision/L.LabelTextCollision.js");
    }

    if (inArray(includes, "smooth-marker-bouncing")) {
      inputScript(window.lib_path + "/Leaflet.SmoothMarkerBouncing/leaflet.smoothmarkerbouncing.js");
    }

    if (inArray(includes, "ant-path")) {
      inputScript(window.lib_path + "/Leaflet.AntPath/leaflet-ant-path.js");
    }

    if (inArray(includes, "marker-slide")) {
      inputScript(window.lib_path + "/Leaflet.Marker.SlideTo/Leaflet.Marker.SlideTo.js");
    }

    if (inArray(includes, "motion")) {
      inputScript(window.lib_path + "/leaflet.motion/leaflet.motion.js");
    }

    if (inArray(includes, "curve")) {
      inputScript(window.lib_path + "/Leaflet.curve/leaflet.curve.js");
    }

    if (inArray(includes, "hotline")) {
      inputScript(window.lib_path + "/Leaflet.hotline/leaflet.hotline.js")
    }

    if (inArray(includes, "arrow-heads")) {
      inputScript(window.lib_path + "/Leaflet-arrowheads/leaflet-geometryutil.js");
      inputScript(window.lib_path + "/Leaflet-arrowheads/leaflet-arrowheads.js");
    }

    if (inArray(includes, "fillPattern")) {
      inputScript(window.lib_path + "/leaflet-polygon.fillPattern/leaflet-polygon.fillPattern.js");
    }

    if (inArray(includes, "semicircle")) {
      inputScript(window.lib_path + "/Leaflet-semicircle/Semicircle.js");
    }

    if (inArray(includes, "ellipse")) {
      inputScript(window.lib_path + "/Leaflet.ellipse/l.ellipse.js");
    }

    if (inArray(includes, "mask-canvas")) {
      inputScript(window.lib_path + "/Leaflet.MaskCanvas/QuadTree.js");
      inputScript(window.lib_path + "/Leaflet.MaskCanvas/L.GridLayer.MaskCanvas.js");
    }

    if (inArray(includes, "boundary-canvas")) {
      inputScript(window.lib_path + "/TileLayer.BoundaryCanvas/BoundaryCanvas.js");
    }

    if (inArray(includes, "canvas-flow-map")) {
      inputScript(window.lib_path + "/Leaflet.Canvas-Flowmap-Layer/CanvasFlowmapLayer.js");
    }

    if (inArray(includes, "river")) {
      inputScript(window.lib_path + "/Leaflet.River/Leaflet.river.js");
    }

    if (inArray(includes, "polyline-offset")) {
      inputScript(window.lib_path + "/Leaflet.PolylineOffset/leaflet.polylineoffset.js")
    }

    if (inArray(includes, "radar")) {
      inputCSS(window.lib_path + "/leaflet-radar/leaflet-radar.css");
      inputScript(window.lib_path + "/leaflet-radar/leaflet-radar.js");
    }
  }

  load();
})();
