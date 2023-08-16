import * as Cesium from 'cesium'

const MaterialLineImage = [
  '/assets/images/texture/ArrowOpacity.png',
  '/assets/images/texture/ArrowTransparent.png',
  '/assets/images/texture/DataTransLine.png',
  '/assets/images/texture/DotTransparent.png',
  '/assets/images/texture/LinkPulse.png',
  '/assets/images/texture/meteor_01.png',
  '/assets/images/texture/Trail.png',
  '/assets/images/texture/Trail1.png'
]
class PolylineDynamicMaterialProperty {
  private _definitionChanged: Cesium.Event = new Cesium.Event()
  private _color: Cesium.ConstantProperty | undefined
  private _time: number | undefined
  private _image = MaterialLineImage[1]
  duration: number
  type = 'PolylineDynamicMaterialType'

  constructor(options) {
    this._color = undefined
    this._time = undefined
    this._image = options.image || this._image
    this.color = options.color || Cesium.Color.BLUE
    this.duration = options.duration || 1000
    this.init()
  }

  get color() {
    return this._color
  }

  set color(value) {
    const oldValue = this._color

    if (oldValue !== value) {
      this._color = new Cesium.ConstantProperty(value as any)
      // this._definitionChanged.raiseEvent(this, 'color', value, oldValue)
    }
  }

  get isVariant(): boolean {
    return false
  }

  get definitionChanged(): Cesium.Event {
    return this._definitionChanged
  }

  getType() {
    console.log(this.type,234)
    return this.type
  }

  getValue(time: Cesium.JulianDate, result) {
    console.log(123)
    if (!result) {
      result = {}
    }

    result.color = Cesium.Property['getValueOrDefault'](this._color, time, result.color)
    result.image = this._image
    console.log(result)
    if (this._time === undefined) {
      this._time = time.secondsOfDay
    }
    result.time = ((time.secondsOfDay - this._time) * 1000) / this.duration
    return result
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof PolylineDynamicMaterialProperty &&
        Cesium.Property['equals'](this._color, other._color))
    )
  }
  init() {
    const { type } = this
    const shader = `
      uniform vec4 color;
      czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            vec2 st = materialInput.st;\n\
            \n\
            if(texture(image, vec2(0.0, 0.0)).a == 1.0){\n\
                discard;\n\
            }else{\n\
                material.alpha = texture(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
            }\n\
            \n\
            material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
            \n\
            return material;\n\
        }\n\
      `
    Cesium.Material['_materialCache'].addMaterial(type, {
      fabric: {
        type: type,
        uniforms: {
          color: new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 0.5),
          image: MaterialLineImage[4],
          time: 0
        },
        source: shader
      },
      translucent: function () {
        return true
      }
    })
  }
}

export { PolylineDynamicMaterialProperty }
