import * as React from "react"
import { widthPercentageToDP as wp,heightPercentageToDP as hp } from "react-native-responsive-screen"
import Svg, { SvgProps, Path } from "react-native-svg"
const SVGComponent = (props) => (
  <Svg
    fill={props.color}
    height={hp(8)}
    width={wp(8)}
    id='Layer_1'
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    viewBox='0 0 512 512'
    enableBackground='new 0 0 512 512'
    xmlSpace='preserve'
    {...props}
  >
    <Path d='M256,0C149.3,0,64,85.3,64,192c0,36.9,11,65.4,30.1,94.3l141.7,215v0c4.3,6.5,11.7,10.7,20.2,10.7c8.5,0,16-4.3,20.2-10.7 l141.7-215C437,257.4,448,228.9,448,192C448,85.3,362.7,0,256,0z M256,298.6c-58.9,0-106.7-47.8-106.7-106.8 c0-59,47.8-106.8,106.7-106.8c58.9,0,106.7,47.8,106.7,106.8C362.7,250.8,314.9,298.6,256,298.6z' />
  </Svg>
)
export default SVGComponent
