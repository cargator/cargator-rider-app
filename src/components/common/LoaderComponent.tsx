import {ActivityIndicator, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const LoaderComponent = () => {
  return (
    <View
      style={{
        height: hp(10),
        width: wp(10),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        backgroundColor: 'transparent',
      }}>
      <ActivityIndicator size="large" color="#B146C2" />
    </View>
  );
};

export default LoaderComponent;
