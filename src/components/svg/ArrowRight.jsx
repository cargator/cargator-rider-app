import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SVGComponent = (props) => (
  <Svg
    width={20}
    height={10}
    viewBox='0 0 20 10'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <Path
      d='M19 5H1M15 1L19 5L15 1ZM19 5L15 9L19 5Z'
      stroke='white'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Svg>
)
export default SVGComponent
