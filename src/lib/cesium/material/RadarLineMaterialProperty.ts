/*
 * @Description: 雷达线效果（参考开源代码）
 * @params options
 * color
 * speed
 */

function installRadarLineMaterialProperty(Cesium) {
  class RadarLineMaterialProperty {
    constructor(options) {
      this._definitionChanged = new Cesium.Event()
      this._color = undefined
      this._speed = undefined
      this.color = options.color
      this.speed = options.speed
      this.init()
    }
    init() {
      if (this.getType()) return
      Cesium.Material.RadarLineMaterialType = 'RadarLineMaterialType'
      Cesium.Material.RadarLineMaterialSource = this.getShader()
      Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarLineMaterialType, {
        fabric: {
          type: Cesium.Material.RadarLineMaterialType,
          uniforms: {
            color: this.color,
            speed: this.speed
          },
          source: Cesium.Material.RadarLineMaterialSource
        },
        translucent: function (material) {
          return true
        }
      })
    }
    getShader() {
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
      return shader
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
      result.color = Cesium.Property.getValueOrDefault(this._color, time, this.color, result.color)
      result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed)
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

  Cesium.Scene.RadarLineMaterialProperty = RadarLineMaterialProperty
}

export { installRadarLineMaterialProperty }
