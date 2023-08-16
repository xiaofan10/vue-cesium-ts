import * as Cesium from 'cesium'

class RadarLineMaterialProperty {
  private _definitionChanged
  private _color: any
  private _speed: any
  type = 'RadarLineMaterialType'
  constructor(options) {
    this._definitionChanged = new Cesium.Event()
    this._color = undefined
    this._speed = undefined
    this.color = options.color
    this.speed = Cesium.defaultValue(options.speed, 10)
    this.init()
  }

  get color() {
    return this._color
  }

  set color(value) {
    const oldValue = this._color

    if (oldValue !== value) {
      this._color = new Cesium.ConstantProperty(value as any)
      this._definitionChanged.raiseEvent(this, 'color', value, oldValue)
    }
  }

  get speed() {
    return this._speed
  }

  set speed(value) {
    const oldValue = this._speed

    if (oldValue !== value) {
      this._speed = value
      this._definitionChanged.raiseEvent(this, 'speed', value, oldValue)
    }
  }

  get isConstant() {
    return false
  }

  get definitionChanged() {
    return this._definitionChanged
  }

  getType() {
    return this.type
  }

  getValue(time, result) {
    console.log(result, this._speed)
    if (!Cesium.defined(result)) {
      result = {}
    }
    result.color = Cesium.Property['getValueOrDefault'](this._color, time, result.color)
    result.speed = this._speed
    return result
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof RadarLineMaterialProperty &&
        Cesium.Property['equals'](this._color, other._color) &&
        Cesium.Property['equals'](this._speed, other._speed))
    )
  }
  init() {
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
    const { type } = this
    Cesium.Material['_materialCache'].addMaterial(type, {
      fabric: {
        type: type,
        uniforms: {
          color: Cesium.Color.RED,
          speed: 10
        },
        source: shader
      },
      translucent: function () {
        return true
      }
    })
  }
}

export { RadarLineMaterialProperty }
