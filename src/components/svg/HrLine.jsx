import * as React from "react"
import Svg, { SvgProps, Line } from "react-native-svg"
const SVGComponent = (props) => (
  <Svg
    width={237}
    height={5}
    viewBox='0 0 237 1'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <Line
      x1={0.5}
      y1={0.5}
      x2={236.5}
      y2={0.5}
      stroke='#E5E7EB'
      strokeLinecap='round'
    />
  </Svg>
)
export default SVGComponent
