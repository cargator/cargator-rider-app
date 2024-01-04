import * as React from "react"
import Svg, { SvgProps, G, Path, Defs } from "react-native-svg"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { themeColor } from "../../styles/styles"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props) => (
  <Svg
    width={wp(20)}
    height={hp(10)}
    viewBox='0 0 90 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <G filter='url(#filter0_d_117_1158)'>
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M45.1582 55.5629C55.9626 53.2664 62.8595 42.646 60.5629 31.8417C58.2664 21.0374 47.6461 14.1405 36.8418 16.437C26.0374 18.7335 19.1405 29.3538 21.437 40.1582C23.7336 50.9625 34.3539 57.8594 45.1582 55.5629Z'
        fill={themeColor}
      />
    </G>
    <Path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M35.0654 36.9384L45.6213 28.8835L42.5563 41.8031L40.2702 37.1235L35.0654 36.9384V36.9384Z'
      stroke='white'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <Defs></Defs>
  </Svg>
)
export default SVGComponent
