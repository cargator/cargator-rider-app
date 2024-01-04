import * as React from "react"
import Svg, {
  SvgProps,
  Circle,
  G,
  Path,
  Defs,
  ClipPath,
  Rect,
} from "react-native-svg"
const SVGComponent = (props) => (
  <Svg
    width={50}
    height={50}
    viewBox='0 0 50 50'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <Circle cx={25} cy={25} r={24.5} fill='white' stroke='#EB5757' />
    <G clipPath='url(#clip0_318_10719)'>
      <Path
        d='M37 25.024C37 27.2 36.464 29.208 35.392 31.048C34.32 32.888 32.864 34.344 31.024 35.416C29.184 36.488 27.176 37.024 25 37.024C22.824 37.024 20.816 36.488 18.976 35.416C17.136 34.344 15.68 32.888 14.608 31.048C13.536 29.208 13 27.2 13 25.024C13 22.848 13.536 20.84 14.608 19C15.68 17.16 17.136 15.704 18.976 14.632C20.816 13.56 22.824 13.024 25 13.024C27.176 13.024 29.184 13.56 31.024 14.632C32.864 15.704 34.32 17.16 35.392 19C36.464 20.84 37 22.848 37 25.024ZM28.864 30.592L30.568 28.888L26.704 25.024L30.568 21.16L28.864 19.456L25 23.32L21.136 19.456L19.432 21.16L23.296 25.024L19.432 28.888L21.136 30.592L25 26.728L28.864 30.592Z'
        fill='#EB5757'
      />
    </G>
    <Defs>
      <ClipPath id='clip0_318_10719'>
        <Rect
          width={24}
          height={24}
          fill='white'
          transform='translate(13 13)'
        />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SVGComponent
