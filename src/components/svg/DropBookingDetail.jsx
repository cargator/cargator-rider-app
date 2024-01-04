import * as React from "react"
import Svg, { SvgProps, Circle, Path } from "react-native-svg"
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
      fillRule='evenodd'
      clipRule='evenodd'
      d='M20.05 19.05C21.3628 17.7372 23.1434 16.9996 25 16.9996C26.8566 16.9996 28.6372 17.7372 29.95 19.05C31.2628 20.3628 32.0004 22.1434 32.0004 24C32.0004 25.8566 31.2628 27.6372 29.95 28.95L25 33.9L20.05 28.95C19.3999 28.3 18.8843 27.5283 18.5324 26.6789C18.1806 25.8296 17.9995 24.9193 17.9995 24C17.9995 23.0807 18.1806 22.1704 18.5324 21.321C18.8843 20.4717 19.3999 19.7 20.05 19.05ZM25 26C25.5304 26 26.0392 25.7893 26.4142 25.4142C26.7893 25.0391 27 24.5304 27 24C27 23.4696 26.7893 22.9609 26.4142 22.5858C26.0392 22.2107 25.5304 22 25 22C24.4696 22 23.9609 22.2107 23.5858 22.5858C23.2107 22.9609 23 23.4696 23 24C23 24.5304 23.2107 25.0391 23.5858 25.4142C23.9609 25.7893 24.4696 26 25 26Z'
      fill='#2F80ED'
    />
  </Svg>
)
export default SVGComponent
