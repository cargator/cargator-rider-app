import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import GPSPermission from '../components/svg/GPSPermission';
import {requestGpsPermission} from '../components/common/functions';

const GPSPermissionScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  // const locationPermission = useSelector((store: any) => store.locationPermission,);

  useEffect(() => {
    requestGpsPermission(dispatch);
  }, []);

  return (
    <View style={styles.container}>
      <View></View>

      <View style={styles.imageContainer}>
        <GPSPermission />

        <Text style={styles.headingText}>GPS Turned Off</Text>

        <Text style={styles.subHeadingText}>
          Allow CarGator to turn on your phone GPS for accurate pickup
        </Text>
      </View>

      <TouchableOpacity
        // activeOpacity={0.9}
        onPress={() => {
          // requestLocationPermission(dispatch);
          // navigation.navigate('SplashScreen');
          // dispatch(setGpsPermission(true));
          requestGpsPermission(dispatch);
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Turn On GPS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(85),
  },
  headingText: {
    fontWeight: '600',
    fontSize: wp(5),
    color: '#000',
    textAlign: 'center',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  subHeadingText: {
    fontSize: wp(4.8),
    color: '#464E5F',
    textAlign: 'center',
  },
  button: {
    width: wp(90),
    height: hp(7),
    backgroundColor: '#2BB180',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3.5),
  },
  buttonText: {
    fontSize: wp(5.5),
    fontWeight: '600',
    color: '#fff',
  },
});

export default GPSPermissionScreen;
