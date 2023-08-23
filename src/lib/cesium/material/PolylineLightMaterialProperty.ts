// @ts-nocheck
import * as Cesium from 'cesium'

class PolylineLightMaterialProperty {
  private _definitionChanged: Cesium.Event = new Cesium.Event()
  private _color: Cesium.Color | undefined
  private _time: number | undefined
  private _image: string
  duration: number
  type = 'PolylineLightMaterialType'

  constructor(options: { color?; duration?: number; image?: string }) {
    this._color = undefined
    this._colorSubscription = undefined
    this._image = options.image || '/assets/images/texture/meteor_01.png'
    this._time = undefined

    this.color = options.color
    this.duration = options.duration || 1000
    this.init()
  }

  get isVariant(): boolean {
    return false
  }

  get definitionChanged(): Cesium.Event {
    return this._definitionChanged
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

  getType(): string {
    console.log(this.type)
    return this.type
  }

  getValue(time: Cesium.JulianDate, result) {
    if (!result) {
      result = {}
    }
    result.color = Cesium.Property['getValueOrDefault'](this._color, time, result.color)
    result.image = this._image
    if (this._time === undefined) {
      this._time = time.secondsOfDay
    }
    console.log(result.color)
    result.time = ((time.secondsOfDay - this._time) * 1000) / this.duration
    return result
  }

  equals(other: any): boolean {
    return (
      this === other ||
      (other instanceof PolylineLightMaterialProperty &&
        Cesium.Property['equals'](this._color, other._color))
    )
  }
  init() {
    const { type } = this
    const image = '/assets/images/texture/meteor_01.png'
    const shader = `
       uniform vec4 color;
       czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            vec2 st = materialInput.st;\n\
            \n\
            vec4 colorImage = texture(image, vec2(fract(1.0 *st.s - time), fract(st.t)));\n\
            \n\
            vec4 fragColor;\n\
            fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
            fragColor = czm_gammaCorrect(fragColor);\n\
            material.diffuse = colorImage.rgb;\n\
            material.alpha = colorImage.a;\n\
            material.emission = fragColor.rgb;\n\
            \n\
            return material;\n\
        }\n\
      `
    Cesium.Material['_materialCache'].addMaterial(type, {
      fabric: {
        type: type,
        uniforms: {
          color: Cesium.Color.BLACK,
          image: image,
          time: 1
        },
        source: shader
      },
      translucent: function () {
        return true
      }
    })
  }
}

export { PolylineLightMaterialProperty }
