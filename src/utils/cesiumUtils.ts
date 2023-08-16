import { Viewer } from 'cesium'

export const getDefaultConfig = (
  config: Viewer.ConstructorOptions = {}
): Viewer.ConstructorOptions => {
  return {
    baseLayerPicker: false, // 地图类型选择器
    fullscreenButton: false, // 全屏功能
    infoBox: false, // 右上角信息框
    timeline: false, // 时间轴
    navigationHelpButton: false, // 帮助按钮
    geocoder: false, // 地图搜索编码器
    homeButton: false, // home
    sceneModePicker: false, // 2D模式/2.5D模式/3D模式
    selectionIndicator: false, // 选中辅助工具
    navigationInstructionsInitiallyVisible: false,
    // clockViewModel: false,
    skyBox: false, // 天空盒子，月亮  太阳
    animation: false,
    // // vrButton: false,
    creditContainer: document.createElement('div'), // 隐藏logo
    ...config
  }
}
