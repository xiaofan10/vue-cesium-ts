import * as Cesium from 'cesium'
function installPolylineDynamicMaterialProperty(Cesium: any) {
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
    private _colorSubscription: any
    private _color: Cesium.Color | undefined
    private _time: number | undefined
    private _image: string
    duration: number

    constructor(options: { color?: Cesium.Color; duration?: number; image?: string }) {
      this._color = undefined
      this._colorSubscription = undefined
      this._image = options.image || Cesium.Material.PolylineDynamicImage
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
      return Cesium.Material.PolylineDynamicMaterialType
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
        (other instanceof PolylineDynamicMaterialProperty &&
          Cesium.Property.equals(this._color, other._color))
      )
    }
  }

  function registerMaterialCache() {
    Cesium.Scene.PolylineDynamicMaterialProperty = PolylineDynamicMaterialProperty
    Cesium.Material.PolylineDynamicMaterialProperty = 'PolylineDynamicMaterialProperty'
    Cesium.Material.PolylineDynamicMaterialType = 'PolylineDynamicMaterialType'
    Cesium.Material.PolylineDynamicImage = MaterialLineImage[4]
    Cesium.Material.PolylineDynamicMaterialSource = `
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
    Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineDynamicMaterialType, {
      fabric: {
        type: Cesium.Material.PolylineDynamicMaterialType,
        uniforms: {
          color: new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 0.5),
          image: Cesium.Material.PolylineDynamicImage,
          time: 0
        },
        source: Cesium.Material.PolylineDynamicMaterialSource
      },
      translucent: function () {
        return true
      }
    })
  }
  registerMaterialCache()
}
export { installPolylineDynamicMaterialProperty }
