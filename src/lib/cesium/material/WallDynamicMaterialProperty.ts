function installWallDynamicMaterialProperty(Cesium: any) {
  class WallDynamicMaterialProperty {
    private _definitionChanged
    private _color
    private _time: number
    public image: any
    public color
    public duration: number

    constructor(options: any = {}) {
      this._definitionChanged = new Cesium.Event()
      this._color = undefined
      this.color = options.color || Cesium.Color.BLUE
      this.duration = options.duration || 3000
      this.image = options.image || '/assets/images/texture/test1.png'
      this._time = new Date().getTime()
    }

    get isvarant(): boolean {
      return false
    }

    get definitionChanged() {
      return this._definitionChanged
    }

    getType(): string {
      return WallDynamicMaterialProperty.MaterialType
    }

    getValue(time, result: any): any {
      if (!Cesium.defined(result)) {
        result = {}
      }
      result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
      )
      result.image = this.image

      result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration
      return result
    }

    equals(other: any): boolean {
      return (
        this === other ||
        (other instanceof WallDynamicMaterialProperty &&
          Cesium.Property.equals(this._color, other._color))
      )
    }

    static MaterialType: string = 'wallType' + parseInt((Math.random() * 1000).toString())

    static install(Cesium: any): void {
      const Color = Cesium.Color
      const Material = Cesium.Material

      function _getDirectionWallShader(options: any): string {
        let materail = `czm_material czm_getMaterial(czm_materialInput materialInput)\n\
            {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            vec2 st = materialInput.st;\n\
            \n `
        if (options.freely == 'vertical') {
          //（由下到上）
          materail +=
            'vec4 colorImage = texture(image, vec2(fract(float(' +
            options.count +
            ')*st.t ' +
            options.direction +
            ' time), fract(st.s)));\n '
        } else {
          //（逆时针）
          materail +=
            'vec4 colorImage = texture(image, vec2(fract(float(' +
            options.count +
            ')*st.s ' +
            options.direction +
            ' time), fract(st.t)));\n '
        }
        //泛光
        materail +=
          'vec4 fragColor;\n\
            fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
            fragColor = czm_gammaCorrect(fragColor);\n '

        materail +=
          ' material.diffuse = colorImage.rgb;\n\
            material.alpha = colorImage.a;\n\
            material.emission = fragColor.rgb;\n\
            \n\
            return material;\n\
            }\n\
            '

        return materail
      }

      Material._materialCache.addMaterial(WallDynamicMaterialProperty.MaterialType, {
        fabric: {
          type: WallDynamicMaterialProperty.MaterialType,
          uniforms: {
            color: new Color(1.0, 0.0, 0.0, 1),
            image: '/assets/images/texture/test1.png',
            time: 0
          },
          source: _getDirectionWallShader({
            count: 0,
            freely: 'cross',
            direction: '+'
          })
        },
        translucent: function () {
          return true
        }
      })

      Cesium.Scene.WallDynamicMaterialProperty = WallDynamicMaterialProperty
    }
  }

  WallDynamicMaterialProperty.install(Cesium)
}

export { installWallDynamicMaterialProperty }
