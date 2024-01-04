import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_591_2730)">
        <Path
          d="M20 10.02c0 1.813-.447 3.487-1.34 5.02a9.928 9.928 0 01-3.64 3.64c-1.533.893-3.207 1.34-5.02 1.34-1.813 0-3.487-.447-5.02-1.34a9.928 9.928 0 01-3.64-3.64C.447 13.507 0 11.833 0 10.02 0 8.207.447 6.533 1.34 5a9.929 9.929 0 013.64-3.64C6.513.467 8.187.02 10 .02c1.813 0 3.487.447 5.02 1.34A9.929 9.929 0 0118.66 5C19.553 6.533 20 8.207 20 10.02zm-6.78 4.64l1.42-1.42-3.22-3.22 3.22-3.22-1.42-1.42L10 8.6 6.78 5.38 5.36 6.8l3.22 3.22-3.22 3.22 1.42 1.42L10 11.44l3.22 3.22z"
          fill="#EB5757"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_591_2730">
          <Path fill="#fff" d="M0 0H20V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
