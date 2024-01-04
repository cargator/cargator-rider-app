import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ArrowLeft from '../components/svg/ArrowLeft';
import ArrowRight from '../components/svg/ArrowRight';
import PickBookingDetail from '../components/svg/PickBookingDetail';
import DropBookingDetail from '../components/svg/DropBookingDetail';
import EstimatedBookingDetail from '../components/svg/EstimatedBookingDetail';
import PreBookingIcon from '../components/svg/PreBooking.jsx';
import PaymentBookingDetail from '../components/svg/PaymentBookingDetail';
import DistanceIcon from '../components/svg/DistanceIcon';
import TimeIcon from '../components/svg/TimeIcon';
import VerticalLine from '../components/svg/VerticalLine';
import {themeColor} from '../styles/styles';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import customAxios from '../services/appservices';

const ScheduleRideScreen = (props: any) => {
  const [isDeletePressed, setIsDeletePressed] = useState<boolean>(false);

  const handleDeleteRide = async () => {
    try {
      setIsDeletePressed(true);
      const response: any = await customAxios.post('/cancel-scheduled-ride', {
        rideId: props.scheduledRideDetails._id,
      });
      // console.log('handleDeleteRide response :>> ', response);
      Toast.show({
        type: 'success',
        text1: response.message,
      });
      props.setIsScheduleRide(false);
    } catch (error: any) {
      console.log(`handleDeleteRide error :>> `, error);
      Toast.show({
        type: 'error',
        text1: error.response.data.message,
      });
    } finally {
      setIsDeletePressed(false);
    }
  };

  const backAction = () => {
    props.setIsScheduleRide(false);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainView}>
        <TouchableOpacity
          onPress={() => {
            props.setIsScheduleRide(false);
          }}>
          <ArrowLeft />
        </TouchableOpacity>

        <Text style={styles.headingText}>Booked Schedule</Text>
      </View>

      <View style={styles.parentView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.pickUpView}>
            <PickBookingDetail />
            <View>
              <Text style={styles.heading}>Pickup Location</Text>
              <Text style={styles.addressText}>
                {props.scheduledRideDetails.pickUpAddress}
              </Text>
            </View>
          </View>

          <View style={styles.pickUpView}>
            <DropBookingDetail />
            <View>
              <Text style={styles.heading}>Dropoff Location</Text>
              <Text style={styles.addressText}>
                {props.scheduledRideDetails.dropAddress}
              </Text>
            </View>
          </View>

          <View style={styles.pickUpView}>
            <PreBookingIcon />

            <View>
              <Text style={styles.dateTimeText}>Date & Time</Text>

              <Text style={styles.textScheduleRideDetail}>
                {new Date(props.scheduledRideDetails.bookingTime)
                  .toString()
                  .slice(0, 21)}
              </Text>
            </View>
          </View>

          <View style={styles.pickUpContainer}>
            <View style={styles.pickUpView}>
              <PaymentBookingDetail />
              <View>
                <Text style={styles.subHeading}>Payment Mode</Text>
                <Text style={styles.subHeadingData}>
                  {props.scheduledRideDetails.paymentMode}
                </Text>
              </View>
            </View>

            <View>
              <VerticalLine />
            </View>

            <View style={styles.pickUpView}>
              <TimeIcon />

              <View>
                <Text style={styles.subHeading}>Time</Text>
                <Text style={styles.subHeadingData}>
                  {props.scheduledRideDetails.duration}
                </Text>
              </View>
            </View>

            <View style={styles.pickUpView}>
              <DistanceIcon />

              <View>
                <Text style={styles.subHeading}>Distance</Text>
                <Text style={styles.subHeadingData}>
                  {props.scheduledRideDetails.distance}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.pickUpContainer}>
            <View style={styles.pickUpView}>
              <EstimatedBookingDetail />
              <View>
                <Text style={styles.subHeading}>Estimated Fare</Text>
                <Text style={styles.subHeadingData}>
                  ₹ {props.scheduledRideDetails.fare}
                </Text>
              </View>
            </View>

            <View>
              <VerticalLine />
            </View>

            <View style={styles.pickUpView}>
              <DistanceIcon />

              <View>
                <Text style={styles.subHeading}>Distance</Text>
                <Text style={styles.subHeadingData}>
                  {props.scheduledRideDetails.distance}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={handleDeleteRide}
          style={styles.deleteButton}
          disabled={isDeletePressed}>
          {isDeletePressed && (
            <ActivityIndicator size="small" color="#EB5757" />
          )}
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: wp(90),
    height: hp(8),
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    marginLeft: hp(1.5),
  },
  heading: {
    fontWeight: '800',
    color: '#000000',
    margin: wp(5),
    fontSize: hp(2),
  },
  text: {marginLeft: wp(5), color: '#000000', width: wp(90), fontSize: hp(1.9)},
  deleteButton: {
    padding: wp(3),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#EB5757',
    borderWidth: 1,
    borderRadius: wp(4),
    width: wp(90),
    flexDirection: 'row',
    gap: wp(2),
    // bottom: hp(3),
    // position: 'absolute',
  },
  safeArea: {
    backgroundColor: '#ffffff',
    height: hp(100),
    width: wp(100),
    zIndex: 111,
  },
  parentView: {
    height: Platform.OS == 'android' ? hp(92) : hp(78),
    backgroundColor: '#F2F3F7',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 30,
    paddingRight: 20,
    paddingLeft: 20,
    position: 'relative',
    paddingBottom: hp(16),
  },
  pickUpView: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: hp(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  textScheduleRideDetail: {
    fontWeight: '800',
    color: '#000000',
    fontSize: hp(2),
    marginTop: hp(-1),
    marginBottom: hp(2),
    paddingLeft: wp(3),
  },
  deleteText: {
    fontSize: wp(4.5),
    fontWeight: '800',
    color: '#EB5757',
  },
  headingText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: hp(3),
    marginLeft: hp(2),
  },
  addressText: {
    marginLeft: wp(5),
    color: '#000000',
    width: wp(90),
    fontSize: hp(1.9),
    marginTop: hp(-2),
    marginBottom: hp(2),
    maxWidth: wp(70),
  },
  dropText: {
    marginLeft: wp(5),
    color: '#000000',
    width: wp(90),
    fontSize: hp(1.9),
    marginTop: hp(-2),
    marginBottom: hp(2),
    maxWidth: wp(70),
  },
  dateTimeText: {
    fontWeight: '800',
    color: '#000000',
    fontSize: hp(2),
    padding: wp(3),
  },
  pickUpContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: hp(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'space-between',
  },
  subHeading: {
    fontWeight: '800',
    margin: wp(5),
    fontSize: hp(2),
    color: '#9CA3AF',
  },
  subHeadingData: {
    fontWeight: '800',
    color: '#000000',
    margin: wp(5),
    marginTop: hp(-2),
    marginBottom: hp(2),
    fontSize: wp(5),
  },
});
export default ScheduleRideScreen;
