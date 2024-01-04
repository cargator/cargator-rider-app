import {useRef, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import data from './data';
import {SafeAreaView} from 'react-native-safe-area-context';
export const CarouselCard = () => {
  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);

  const renderItem = ({item, index}: any) => {
    return (
      <View style={styles.container} key={index}>
        <Image source={item.imgUrl} style={styles.image} />
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View style={{alignSelf: 'center', marginTop: hp(40)}}>
        <Carousel
          ref={isCarousel}
          data={data}
          renderItem={renderItem}
          sliderWidth={wp(50)}
          itemWidth={wp(50)}
          onSnapToItem={index => setIndex(index)}
          autoplayInterval={3000}
          autoplay={true}
        />
        <View style={{marginBottom: hp(30)}}>
          <Pagination
            dotsLength={data.length}
            activeDotIndex={index}
            carouselRef={isCarousel}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
// export default CarouselCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: wp(50),
  },
  image: {
    width: wp(50),
    height: hp(40),
  },
});
