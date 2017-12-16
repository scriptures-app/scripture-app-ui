interface IShadowScrollbarProps {
  style: any,
  autoHide?: boolean
}

interface IShadowScrollbarState {
  shadowTopOpacity: number,
  shadowBottomOpacity: number
}

interface IScrollbarValues {
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
}