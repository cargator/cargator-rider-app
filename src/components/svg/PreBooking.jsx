import * as React from 'react';
import Svg, {Circle, G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={50}
      height={50}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle opacity={0.74} cx={25} cy={25} r={25} fill="#EFF2F5" />
      <G clipPath="url(#clip0_1441_610)">
        <Path
          d="M28.333 17.5c.46 0 .834.373.834.833v.834h1.666c.879 0 1.599.68 1.662 1.542l.005.124v10c0 .879-.68 1.599-1.542 1.662l-.125.005H19.167c-.879 0-1.599-.68-1.662-1.542l-.005-.125v-10c0-.878.68-1.598 1.542-1.662l.125-.004h1.666v-.834a.833.833 0 011.667 0v.834h5v-.834c0-.46.373-.833.833-.833zm-.98 5.316l-3.535 3.535-1.179-1.178a.833.833 0 10-1.178 1.178l1.762 1.762a.842.842 0 001.19 0l4.119-4.119a.833.833 0 10-1.179-1.178z"
          fill="#404080"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1441_610">
          <Path fill="#fff" transform="translate(15 15)" d="M0 0H20V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
