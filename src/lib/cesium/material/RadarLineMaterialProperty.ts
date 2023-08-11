/*
 * @Description: 雷达线效果（参考开源代码）
 * @params options
 * color
 * speed
 */

function installRadarLineMaterialProperty(Cesium) {
  class RadarLineMaterialProperty {
    private _definitionChanged
    private _color: any
    private _speed: any
    color
    speed
    constructor(options) {
      this._definitionChanged = new Cesium.Event()
      this._color = undefined
      this._speed = undefined
      this.color = options.color
      this.speed = options.speed
    }

    get isConstant() {
      return false
    }

    get definitionChanged() {
      return this._definitionChanged
    }

    getType() {
      return Cesium.Material?.RadarLineMaterialType
    }

    getValue(time, result) {
      if (!Cesium.defined(result)) {
        result = {}
      }
      result.color = Cesium.Property.getValueOrDefault(this._color, time, this.color)
      result.speed = Cesium.Property.getValueOrDefault(this._speed, time, this.speed)
      return result
    }

    equals(other) {
      return (
        this === other ||
        (other instanceof RadarLineMaterialProperty &&
          Cesium.Property.equals(this._color, other._color) &&
          Cesium.Property.equals(this._speed, other._speed))
      )
    }
  }

  function registerMaterialCache() {
    const shader = `
       uniform vec4 color;
       uniform float speed;

        czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st * 2.0 - 1.0;
          float t = czm_frameNumber * speed / 1000.0 ;
          vec3 col = vec3(0.0);
          vec2 p = vec2(sin(t), cos(t));
          float d = length(st - dot(p, st) * p);
          if (dot(st, p) < 0.) {
              d = length(st);
          }

          col = .006 / d * color.rgb;

          if(distance(st,vec2(0)) >  0.99 ){
              col =color.rgb;
          }

          material.alpha  = pow(length(col),2.0);
          material.diffuse = col * 3.0 ;
          return material;
        }
      `
    Cesium.Scene.RadarLineMaterialProperty = RadarLineMaterialProperty
    Cesium.Material.RadarLineMaterialProperty = 'RadarLineMaterialProperty'
    Cesium.Material.RadarLineMaterialType = 'RadarLineMaterialType'
    Cesium.Material.RadarLineMaterialSource = shader
    Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarLineMaterialType, {
      fabric: {
        type: Cesium.Material.RadarLineMaterialType,
        uniforms: {
          color: Cesium.Color.RED,
          speed: 10
        },
        source: Cesium.Material.RadarLineMaterialSource
      },
      translucent: function (material) {
        return true
      }
    })
  }

  registerMaterialCache()
}

export { installRadarLineMaterialProperty }
