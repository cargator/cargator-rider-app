import * as React from "react"
import Svg, { SvgProps, Circle } from "react-native-svg"
const SVGComponent = (props) => (
  <Svg
    width={32}
    height={32}
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <Circle opacity={0.74} cx={16} cy={16} r={16} fill='#EFF2F5' />
    <Circle cx={16.0001} cy={16.0001} r={6.4} fill='white' />
    <Circle cx={15.9999} cy={16} r={3.65714} fill='#404080' />
  </Svg>
)
export default SVGComponent
