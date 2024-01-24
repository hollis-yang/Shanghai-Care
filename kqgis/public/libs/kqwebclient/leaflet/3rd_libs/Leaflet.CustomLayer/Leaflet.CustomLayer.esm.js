/*!
 * Leaflet.CustomLayer.js v2.1.0
 * 
 * Copyright (c) 2019-present Derek Li
 * Released under the MIT License - https://choosealicense.com/licenses/mit/
 * 
 * https://github.com/iDerekLi/Leaflet.CustomLayer
 */
import t from "leaflet";

/**
 * @class CustomLayer
 * @inherits Layer
 *
 * Leaflet overlay plugin: L.CustomLayer - fully custom Layer.
 */ var i = t.Layer.extend({
    // CustomLayer options
    options: {
        // How much to extend the clip area around the map view (relative to its size)
        // e.g. 0.1 would be 10% of map view in each direction
        padding: 0,
        // How much to extend click tolerance round a path/object on the map
        tolerance: 0,
        // The DomElement object to display
        container: null,
        // The opacity of the layer, [0,1]
        opacity: 1,
        // Is the layer visible
        visible: !0,
        // The zIndex of the layer
        zIndex: undefined,
        // Set the visibility min zoom level
        minZoom: 0,
        // Set the visibility max zoom level
        maxZoom: 18
    },
    initialize: function initialize(i) {
        t.setOptions(this, i), 
        /* Built-in Date */
        t.stamp(this), this._map = undefined, this._container = undefined, this._bounds = undefined, 
        this._center = undefined, this._zoom = undefined, this._padding = undefined;
    },
    /* Built-in Lifecycle */
    beforeAdd: function beforeAdd() {
        this._zoomVisible = !0;
    },
    getEvents: function getEvents() {
        // Layer trigger priority
        // move: movestart -> move -> moveend
        // zoom: zoomstart -> movestart -> zoomanim -> zoom -> move -> zoomend -> moveend
        // resize: move -> resize -> moveend
        var t = {
            viewreset: this._onLayerViewReset,
            zoom: this._onLayerZoom,
            moveend: this._onLayerMoveEnd,
            zoomend: this._onLayerZoomEnd
        };
        return this._zoomAnimated && (t.zoomanim = this._onLayerAnimZoom), t;
    },
    onAdd: function onAdd() {
        if (this.fire("layer-beforemount"), // Lifecycle beforeMount
        this._container || this._initContainer(), this.setOpacity(this.options.opacity), 
        window.isNaN(this.options.zIndex)) switch (this._container.tagName) {
          // http://www.w3.org/1999/xhtml
            case "CANVAS":
            this.setZIndex(100);
            break;

 // http://www.w3.org/2000/svg
                      case "svg":
            this.setZIndex(200);
            break;

          default:
            this.setZIndex(100);
        } else this.setZIndex(this.options.zIndex);
        this.getPane().appendChild(this._container), this._onZoomVisible(), this.fire("layer-mounted"), 
        // Lifecycle mounted
        this._update();
    },
    onRemove: function onRemove() {
        this.fire("layer-beforedestroy"), // Lifecycle beforeDestroy
        this._destroyContainer(), this.fire("layer-destroyed");
    },
    /* Built-in Events */
    _onLayerViewReset: function _onLayerViewReset() {
        this._reset();
    },
    _onLayerAnimZoom: function _onLayerAnimZoom(t) {
        this._updateTransform(t.center, t.zoom);
    },
    _onLayerZoom: function _onLayerZoom() {
        this._updateTransform(this._map.getCenter(), this._map.getZoom());
    },
    _onLayerZoomEnd: function _onLayerZoomEnd() {},
    _onLayerMoveEnd: function _onLayerMoveEnd() {
        this._isZoomVisible() ? this._update() : this._zoomHide();
    },
    _onZoomVisible: function _onZoomVisible() {
        this._isZoomVisible() ? this._zoomShow() : this._zoomHide();
    },
    /* Built-in Methods */
    _initContainer: function _initContainer() {
        var i = this._container = this.options.container;
        t.DomUtil.addClass(i, "leaflet-layer"), this._zoomAnimated && t.DomUtil.addClass(this._container, "leaflet-zoom-animated");
    },
    _destroyContainer: function _destroyContainer() {
        t.DomUtil.remove(this._container), delete this._container;
    },
    _isZoomVisible: function _isZoomVisible() {
        var t = this.options.minZoom, i = this.options.maxZoom, e = this._map.getZoom();
        return e >= t && e <= i;
    },
    _zoomShow: function _zoomShow() {
        this._zoomVisible || (this._zoomVisible = !0, this._map.off({
            zoomend: this._onZoomVisible
        }, this), this.options.visible && (this._map.on(this.getEvents(), this), this.getContainer().style.display = ""));
    },
    _zoomHide: function _zoomHide() {
        this._zoomVisible && (this._zoomVisible = !1, this._map.off(this.getEvents(), this), 
        this._map.on({
            zoomend: this._onZoomVisible
        }, this), this.getContainer().style.display = "none");
    },
    _updateTransform: function _updateTransform(i, e) {
        var o = this._map.getZoomScale(e, this._zoom), n = t.DomUtil.getPosition(this._container), s = this._map.getSize().multiplyBy(.5 + this.options.padding), a = this._map.project(this._center, e), r = this._map.project(i, e).subtract(a), h = s.multiplyBy(-o).add(n).add(s).subtract(r);
        t.Browser.any3d ? t.DomUtil.setTransform(this._container, h, o) : t.DomUtil.setPosition(this._container, h);
    },
    _update: function _update() {
        if (!this._map._animatingZoom || !this._bounds) {
            this.__update();
            var i = this._bounds, e = this._container;
            t.DomUtil.setPosition(e, i.min), this.fire("layer-render");
        }
    },
    __update: function __update() {
        // Update pixel bounds of renderer container (for positioning/sizing/clipping later)
        // Subclasses are responsible of firing the 'update' event.
        var i = this.options.padding, e = this._map.getSize(), o = this._map.containerPointToLayerPoint(e.multiplyBy(-i));
        this._padding = e.multiplyBy(i), // this._bounds = new L.Bounds(
        //   min.round(),
        //   min.add(size.multiplyBy(1 + p * 2)).round()
        // );
        this._bounds = new t.Bounds(o, o.add(e.multiplyBy(1 + 2 * i))), this._center = this._map.getCenter(), 
        this._zoom = this._map.getZoom();
    },
    _reset: function _reset() {
        this._update(), this._updateTransform(this._center, this._zoom);
    },
    /**
   * API
   */
    /* Methods */
    getContainer: function getContainer() {
        return this._container;
    },
    setContainer: function setContainer(t) {
        var i = this.getContainer(), e = i.parentNode;
        if (delete this._container, this.options.container = t, this._container || this._initContainer(), 
        this.setOpacity(this.options.opacity), window.isNaN(this.options.zIndex)) switch (this._container.tagName) {
          case "CANVAS":
            this.setZIndex(100);
            break;

          case "svg":
            this.setZIndex(200);
            break;

          default:
            this.setZIndex(100);
        } else this.setZIndex(this.options.zIndex);
        return e ? e.replaceChild(t, i) : this.getPane().appendChild(t), this._update(), 
        this;
    },
    getOpacity: function getOpacity() {
        return this.options.opacity;
    },
    setOpacity: function setOpacity(t) {
        return this.getContainer().style.opacity = this.options.opacity = 1 * t, this;
    },
    getZIndex: function getZIndex() {
        return this.options.zIndex;
    },
    setZIndex: function setZIndex(t) {
        return this.getContainer().style.zIndex = this.options.zIndex = 1 * t, this;
    },
    show: function show() {
        if (!this.options.visible) {
            if (this.options.visible = !0, this._isZoomVisible()) return this._map.on(this.getEvents(), this), 
            this.getContainer().style.display = "", this._update(), this;
            this._zoomHide();
        }
    },
    hide: function hide() {
        if (this.options.visible) return this.options.visible = !1, this._zoomHide(), this._map.off(this.getEvents(), this), 
        this.getContainer().style.display = "none", this;
    },
    setFullLayerBounds: function setFullLayerBounds() {
        var i = this.getContainer(), e = this._bounds.getSize(), o = this._padding;
        switch (i.tagName) {
          case "CANVAS":
            var n = t.Browser.retina ? 2 : 1;
            i.width = n * e.x, i.height = n * e.y, i.style.width = e.x + "px", i.style.height = e.y + "px";
            var s = i.getContext("2d");
            return t.Browser.retina && s.scale(n, n), s.translate(o.x, o.y), {
                container: i,
                ctx: s,
                dpr: n
            };

          case "svg":
            return i.setAttribute("width", e.x), i.setAttribute("height", e.y), i.style.width = e.x + "px", 
            i.style.height = e.y + "px", i.setAttribute("viewBox", "".concat(-o.x, " ").concat(-o.y, " ").concat(e.x, " ").concat(e.y)), 
            {
                container: i
            };

          case "DIV":
            return i.style.boxSizing = "content-box", i.style.width = e.x - o.x + "px", i.style.height = e.y - o.y + "px", 
            i.style.padding = "".concat(o.y, "px ").concat(o.x, "px"), {
                container: i
            };

          default:
            return i.setAttribute("width", e.x), i.setAttribute("height", e.y), i.style.width = e.x + "px", 
            i.style.height = e.y + "px", {
                container: i
            };
        }
    }
    /* Events */
    // on("layer-beforemount", fn);
    // on("layer-mounted", fn);
    // on("layer-render", fn);
    // on("layer-beforedestroy", fn);
    // on("layer-destroyed", fn);
});

 // @factory L.customLayer(options?: Renderer options)
// Creates a CustomLayer renderer with the given options.
function customLayer(e) {
    return t.customLayer ? new i(e) : null;
}

/**
 * Plugin Props
 */ t.CustomLayer = i, t.customLayer = customLayer;

export default customLayer;

export { i as CustomLayer, customLayer };
//# sourceMappingURL=Leaflet.CustomLayer.esm.js.map
