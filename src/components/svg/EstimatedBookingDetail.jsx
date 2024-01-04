import * as React from "react"
import Svg, { SvgProps, Circle, Path } from "react-native-svg"
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
    <Path
      d='M23 20H20.75L22 18.5H23.5L23 20Z'
      fill='black'
      fillOpacity={0.203922}
    />
    <Path
      d='M20.5 22.5L22 21H24.579C24.1305 20.397 23.3668 20 22.5 20H20.5L22 18.5H30L28.5 20H26.3726C26.5833 20.302 26.7475 20.6388 26.8551 21H30L28.5 22.5H26.9646C26.7219 24.1961 25.2632 25.5 23.5 25.5L23.2056 25.4878L27.5 31.5H25.5L21 25.2V24.5H21.5H22.5C23.7868 24.5 24.8466 23.625 24.9847 22.5H20.5Z'
      fill={themeColor}
    />
  </Svg>
)
export default SVGComponent
