import * as React from "react"
import Svg, { SvgProps, Circle, Path } from "react-native-svg"
const SVGComponent = (props) => (
  <Svg
    width={32}
    height={32}
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <Circle opacity={0.74} cx={16} cy={16.0001} r={16} fill='#EFF2F5' />
    <Path
      d='M14.3333 11.8334H12.4583L13.4999 10.5834H14.7499L14.3333 11.8334Z'
      fill='black'
      fillOpacity={0.203922}
    />
    <Path
      d='M12.25 13.9167L13.5 12.6667H15.6492C15.2754 12.1642 14.639 11.8334 13.9167 11.8334H12.25L13.5 10.5834H20.1667L18.9167 11.8334H17.1439C17.3194 12.085 17.4563 12.3657 17.5459 12.6667H20.1667L18.9167 13.9167H17.6371C17.4349 15.3302 16.2194 16.4167 14.75 16.4167L14.5046 16.4065L18.0833 21.4167H16.4167L12.6667 16.1667V15.5834H13.0833H13.9167C14.989 15.5834 15.8721 14.8542 15.9873 13.9167H12.25Z'
      fill='#404080'
    />
  </Svg>
)
export default SVGComponent
