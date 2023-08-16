import * as Cesium from 'cesium'
class RadarScanMaterialProperty {
  private _definitionChanged
  private _color: any
  private _speed: any
  type = 'RadarScanMaterialType'
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
    if (!Cesium.defined(result)) {
      result = {}
    }

    result.color = Cesium.Property['getValueOrDefault'](this._color, time, this.color)
    result.speed = this._speed
    return result
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof RadarScanMaterialProperty &&
        Cesium.Property['equals'](this._color, other._color) &&
        Cesium.Property['equals'](this._speed, other._speed))
    )
  }
  init() {
    const { type } = this
    const shader = `
        uniform vec4 color;
        uniform float speed;
    
        #define PI 3.14159265359
    
          czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            vec2 scrPt = st * 2.0 - 1.0;
            float time = czm_frameNumber * speed / 1000.0 ;
            vec3 col = vec3(0.0);
            mat2 rot;
            float theta = -time * 1.0 * PI - 2.2;
            float cosTheta, sinTheta;
            cosTheta = cos(theta);
            sinTheta = sin(theta);
            rot[0][0] = cosTheta;
            rot[0][1] = -sinTheta;
            rot[1][0] = sinTheta;
            rot[1][1] = cosTheta;
            vec2 scrPtRot = rot * scrPt;
            float angle = 1.0 - (atan(scrPtRot.y, scrPtRot.x) / 6.2831 + 0.5);
            float falloff = length(scrPtRot);
            material.alpha = pow(length(col + vec3(.5)),5.0);
            material.diffuse =  (0.5 +  pow(angle, 2.0) * falloff ) *   color.rgb    ;
            return material;
          }
         `

    Cesium.Material['_materialCache'].addMaterial(type, {
      fabric: {
        type,
        uniforms: {
          color: Cesium.Color.RED,
          speed: 10.0
        },
        source: shader
      },
      translucent: function () {
        return true
      }
    })
  }
}

export { RadarScanMaterialProperty }
