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
  private _color: Cesium.Color | undefined
  private _time: number | undefined
  private _image = MaterialLineImage[1]
  duration: number
  color: Cesium.Color | undefined
  type = 'PolylineDynamicMaterialType'

  constructor(options: { color?: Cesium.Color; duration?: number; image?: string }) {
    this._color = undefined
    this._image = options.image || this._image
    this._time = undefined

    this.color = options.color || Cesium.Color.BLUE
    this.duration = options.duration || 1000
    console.log(options)
  }

  get isVariant(): boolean {
    return false
  }

  get definitionChanged(): Cesium.Event {
    return this._definitionChanged
  }

  getType(): string {
    return this.type
  }

  getValue(time: Cesium.JulianDate, result: any): any {
    if (!result) {
      result = {}
    }

    result.color = this.color
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
