import * as React from "react"
import Svg, { SvgProps, Circle } from "react-native-svg"
import { themeColor } from "../../styles/styles"
const SVGComponent = (props) => (
  <Svg
    width={50}
    height={50}
    viewBox='0 0 50 50'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <Circle opacity={0.74} cx={25} cy={25} r={25} fill='#EFF2F5' />
    <Circle cx={25} cy={25} r={10} fill='white' />
    <Circle cx={24.9999} cy={25} r={5.71429} fill={themeColor} />
  </Svg>
)
export default SVGComponent
