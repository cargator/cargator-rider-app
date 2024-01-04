import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { themeColor } from "../../styles/styles"
const SVGComponent = (props) => (
  <Svg
    width={12}
    height={15}
    viewBox='0 0 9 8'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <Path
      d='M4.1854 6.69976L6.21526 7.92746C6.58699 8.15245 7.04188 7.81985 6.94405 7.3992L6.40602 5.09054L8.2011 3.53513C8.52881 3.25144 8.35273 2.71341 7.9223 2.67917L5.55984 2.47863L4.6354 0.297142C4.46909 -0.0990473 3.90171 -0.0990473 3.73541 0.297142L2.81097 2.47374L0.448505 2.67428C0.0180768 2.70852 -0.158007 3.24655 0.169705 3.53024L1.96478 5.08565L1.42675 7.39431C1.32893 7.81496 1.78381 8.14756 2.15554 7.92257L4.1854 6.69976Z'
      fill={themeColor}
    />
  </Svg>
)
export default SVGComponent
