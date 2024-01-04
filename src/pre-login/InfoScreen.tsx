import React from 'react';
import {
  View,
  SafeAreaView,
  Button,
  ImageBackground,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const InfoScreen = (props: any) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        style={{
          position: 'absolute',
          height: hp(100),
          width: wp(100),
          zIndex: 0,
        }}
        source={require('../components/common/Next.jpg')}>
        <View
          style={{
            marginTop: Platform.OS == 'android' ? hp(80) : hp(78),
            width: wp(20),
            alignSelf: 'center',
            position: 'relative',
            zIndex: 9,
            // backgroundColor:'#3E3E71',
          }}>
          <Button
            title="Next"
            // color={'#ffffff'}
            onPress={() => {
              props.navigation.navigate('MainInfoScreen');
            }}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default InfoScreen;
