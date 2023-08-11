import * as Cesium from 'cesium'
function installPolylineLightMaterialProperty(Cesium: any) {
  class PolylineLightMaterialProperty {
    private _definitionChanged: Cesium.Event = new Cesium.Event()
    private _colorSubscription: any
    private _color: Cesium.Color | undefined
    private _time: number | undefined
    private _image: string
    duration: number

    constructor(options: { color?: Cesium.Color; duration?: number; image?: string }) {
      this._color = undefined
      this._colorSubscription = undefined
      this._image = options.image || Cesium.Material.PolylineLightImage
      this._time = undefined

      this.color = options.color || Cesium.Color.BLUE
      this.duration = options.duration || 1000
    }

    get isVariant(): boolean {
      return false
    }

    get definitionChanged(): Cesium.Event {
      return this._definitionChanged
    }

    color(): Cesium.Color {
      return this._color || Cesium.Color.WHITE
    }

    getType(): string {
      return Cesium.Material.PolylineLightMaterialType
    }

    getValue(time: Cesium.JulianDate, result: any): any {
      if (!result) {
        result = {}
      }

      result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE)
      result.image = this._image

      if (this._time === undefined) {
        this._time = time.secondsOfDay
      }
      result.time = ((time.secondsOfDay - this._time) * 1000) / this.duration
      return result
    }

    equals(other: any): boolean {
      return (
        this === other ||
        (other instanceof PolylineLightMaterialProperty &&
          Cesium.Property.equals(this._color, other._color))
      )
    }
  }

  function registerMaterialCache() {
    Cesium.Scene.PolylineLightMaterialProperty = PolylineLightMaterialProperty
    Cesium.Material.PolylineLightMaterialProperty = 'PolylineLightMaterialProperty'
    Cesium.Material.PolylineLightMaterialType = 'PolylineLightMaterialType'
    Cesium.Material.PolylineLightImage = '/assets/images/texture/meteor_01.png'
    Cesium.Material.PolylineLightMaterialSource = `
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
    Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineLightMaterialType, {
      fabric: {
        type: Cesium.Material.PolylineLightMaterialType,
        uniforms: {
          color: new Cesium.Color(1, 0, 0, 1.0),
          image: Cesium.Material.PolylineLightImage,
          time: 0
        },
        source: Cesium.Material.PolylineLightMaterialSource
      },
      translucent: function () {
        return true
      }
    })
  }
  registerMaterialCache()
}
export { installPolylineLightMaterialProperty }
