import * as React from "react"
import Svg, { SvgProps, Circle } from "react-native-svg"
import { themeColor } from "../../styles/styles"
const SVGComponent = (props) => (
  <Svg
    width={32}
    height={32}
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <Circle opacity={0.2} cx={16} cy={16} r={16} fill={themeColor} />
    <Circle cx={16.5} cy={15.5} r={7.5} fill={themeColor} />
  </Svg>
)
export default SVGComponent
