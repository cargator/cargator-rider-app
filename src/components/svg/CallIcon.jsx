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
    <Circle cx={25} cy={25} r={24.5} fill='white' stroke={themeColor} />
    <Path
      d='M30.4922 27.9876C30.2966 27.8964 30.1029 27.8018 29.9112 27.7039C29.1206 27.3003 28.1249 27.5929 27.7576 28.401C27.252 29.5133 25.791 29.7783 24.927 28.9143L21.0736 25.0609C20.2096 24.1969 20.4746 22.7359 21.5869 22.2303C22.3528 21.8822 22.6226 20.9328 22.2226 20.1927C22.0537 19.88 21.8936 19.5617 21.7427 19.2381C21.4415 18.5923 21.1801 17.9321 20.9588 17.2612C20.5938 16.1551 19.338 15.5383 18.3002 16.0671L15.5651 17.4606C15.1149 17.69 14.8355 18.1613 14.8795 18.6647C15.2502 22.9013 17.1017 26.8718 20.1089 29.879C23.1161 32.8862 27.0866 34.7377 31.3232 35.1083C31.827 35.1524 32.2985 34.8728 32.5281 34.4223L33.9973 31.5388C34.5327 30.4879 33.8935 29.2172 32.7672 28.8671C31.9937 28.6266 31.2335 28.3333 30.4922 27.9876Z'
      fill={themeColor}
      stroke='white'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Svg>
)
export default SVGComponent
