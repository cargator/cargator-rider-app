import React from 'react';
import {View, SafeAreaView, Button} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {CarouselCard} from '../components/common/Carousel';
import {ImageBackground} from 'react-native';
import {useDispatch} from 'react-redux';
import {setInfoVisible} from '../redux/redux';

const MainInfoScreen = (props: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../components/common/BackgroundImage.jpg')}>
        <View style={{width: wp(20), alignSelf: 'flex-end', margin: wp(5)}}>
          <Button
            title="Skip"
            // color={'#ffffff'}
            onPress={() => {
              dispatch(setInfoVisible(true));
              // props.navigation.navigate('MapScreen')
            }}
          />
        </View>
        <CarouselCard />
      </ImageBackground>
    </SafeAreaView>
  );
};
export default MainInfoScreen;
