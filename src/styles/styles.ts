import {Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const themeColor = '#118F5E';

export const styles = StyleSheet.create({
  parentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preLoginCard: {
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderTopStartRadius: wp(10),
    borderTopEndRadius: wp(10),
    width: wp(100),
    height: hp(35),
    bottom: Platform.OS == 'android' ? hp(-2) : 0,
    position: 'absolute',
  },
  buttonText: {
    fontFamily:'Roboto Mono',
    color: '#ffffff',
    fontSize: wp(4.5),
    fontWeight: '600',
  },
});
