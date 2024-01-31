import React, { useEffect, useMemo, useState } from 'react';
import {
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
import { socketInstance } from './MapScreen';
import ArrowLeft from '../components/svg/ArrowLeft';
import ArrowRight from '../components/svg/ArrowRight';
import PickBookingDetail from '../components/svg/PickBookingDetail';
import DropBookingDetail from '../components/svg/DropBookingDetail';
import EstimatedBookingDetail from '../components/svg/EstimatedBookingDetail';
import PreBookingIcon from '../components/svg/PreBooking.jsx';
import PaymentBookingDetail from '../components/svg/PaymentBookingDetail';
import RadioGroup from 'react-native-radio-buttons-group';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import DistanceIcon from '../components/svg/DistanceIcon';
import { themeColor } from '../styles/styles';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';

let date = new Date();
let time = new Date();

const BookingScreen = (props: any) => {
  const navigation = useNavigation();
  const [dateModal, setDateModal] = useState<boolean>(false);
  const [timeModal, setTimeModal] = useState<boolean>(false);
  const [isRideScheduled, setIsRideScheduled] = useState<boolean>(false);
  const [scheduleRideDate, setScheduleRideDate] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string>('1');
  const [selectedIdScheduleRide, setSelectedIdScheduleRide] =
    useState<string>('0');

  const radioButtons = useMemo<any>(
    () => [
      {
        id: '0', // acts as primary key, should be unique and non-empty string
        label: 'Cash',
        value: 'Cash',
        color: themeColor,
        labelStyle: {
          color: '#000000',
          fontWeight: '500',
        },
      },
      {
        id: '1',
        label: 'Online',
        value: 'Online',
        color: themeColor,
        labelStyle: {
          color: '#000000',
          fontWeight: '500',
        },
      },
    ],
    [],
  );

  const radioButtonsScheduleRide = useMemo<any>(
    () => [
      {
        id: '0', // acts as primary key, should be unique and non-empty string
        label: 'Now',
        value: 'Now',
        color: themeColor,
        labelStyle: {
          color: '#000000',
          fontWeight: '500',
        },
      },
      {
        id: '1',
        label: 'Schedule',
        value: 'Schedule',
        color: themeColor,
        labelStyle: {
          color: '#000000',
          fontWeight: '500',
        },
      },
    ],
    [],
  );

  const handleRideScheduled = () => {
    setIsRideScheduled(true);
    const scheduledDate = date.toISOString().split('T')[0];
    const scheduledTime = time.toISOString().split('T')[1];
    const completeDate = new Date(`${scheduledDate}T${scheduledTime}`);
    let minimumTime = new Date();
    minimumTime.setTime(minimumTime.getTime() + 1000 * 60 * 60);
    if (completeDate < minimumTime) {
      Toast.show({
        type: 'error',
        text1: 'You cannot schedule ride within 1 hour',
      });
      setSelectedIdScheduleRide('0');
      return;
    }
    setScheduleRideDate(completeDate);
  };

  const BookRide = async () => {
    try {
      if (selectedId == undefined) {
        Toast.show({
          type: 'error',
          text1: 'Please select mode of payment !',
        });
        return;
      }

      let scheduleData: any = {
        pickUpLocation: [props.mylocation.latitude, props.mylocation.longitude],
        dropLocation: [
          props.destLocation.latitude,
          props.destLocation.longitude,
        ],
        pickUpAddress: props.myAddress,
        dropAddress: props.destAddress,
        distance: props.distance.text,
        duration: props.duration.text,
        platform: props.platform,
        pickupToDropPath: props.path,
        fare: props.fare,
        paymentMode: radioButtons[selectedId]['value'],
      };

      if (isRideScheduled) {
        scheduleData.bookingTime = scheduleRideDate;
      }

      socketInstance.emit('request-ride', scheduleData);

      if (isRideScheduled) {
        props.setNavigationStep(0);
        props.setLoading(true);
      } else {
        props.setCustomSpinner(true);
        props.setNavigationStep(2);
      }
    } catch (error) {
      console.log(`BookRide error :>> `, error);
    } finally {
      setIsRideScheduled(false);
      setScheduleRideDate(null);
    }
  };

  const backAction = () => {
    props.setNavigationStep(0);
    return true;
  };

  useEffect(() => {
    if (selectedIdScheduleRide === '0') {
      setScheduleRideDate(null);
      setIsRideScheduled(false);
      date = new Date();
      time = new Date();
    } else {
      setDateModal(true);
    }
  }, [selectedIdScheduleRide]);

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
    <View style={[styles.safeArea]}>
      {/* <View style={styles.mainView}>
          <TouchableOpacity
            onPress={() => {
              props.setNavigationStep(0);
            }}>
            <ArrowLeft />
          </TouchableOpacity>
        </View> */}

      <View style={[styles.parentView, {marginTop: hp(1)}]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: hp(18),
          }}>
          <View style={styles.pickUpView}>
            <View>
              <PickBookingDetail />
            </View>
            <View>
              <Text style={styles.heading}>Pickup Location</Text>
              <Text
                style={[
                  styles.text,
                  {
                    marginTop: hp(-2),
                    marginBottom: hp(2),
                    maxWidth: wp(70),
                  },
                ]}>
                {props.myAddress}
              </Text>
            </View>
          </View>

          <View style={styles.pickUpView}>
            <View>
              <DropBookingDetail />
            </View>
            <View>
              <Text style={styles.heading}>Dropoff Location</Text>
              <Text
                style={[
                  styles.text,
                  {
                    marginTop: hp(-2),
                    marginBottom: hp(2),
                    maxWidth: wp(70),
                  },
                ]}>
                {props.destAddress}
              </Text>
            </View>
          </View>

          <View style={styles.pickUpView}>
            <View>
              <EstimatedBookingDetail />
            </View>

            <View>
              <Text style={[styles.heading]}>Estimated Fare</Text>
              <Text
                style={[
                  styles.heading,
                  {marginTop: hp(-2), marginBottom: hp(2)},
                ]}>
                {props.fare}
              </Text>
            </View>
          </View>

          <View style={styles.pickUpView}>
            <PreBookingIcon />

            <View>
              <Text
                style={{
                  fontWeight: '800',
                  color: '#000000',
                  fontSize: hp(2),
                  padding: wp(3),
                }}>
                Pre-Booking
              </Text>

              <RadioGroup
                radioButtons={radioButtonsScheduleRide}
                onPress={setSelectedIdScheduleRide}
                selectedId={selectedIdScheduleRide}
                layout="row"
                containerStyle={{marginTop: hp(-1), marginBottom: hp(2)}}
              />

              {scheduleRideDate && (
                <TouchableOpacity onPress={() => setDateModal(true)}>
                  <Text style={styles.textScheduleRideDetail}>
                    {scheduleRideDate.toString().slice(0, 21)}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.pickUpView}>
            <View>
              <PaymentBookingDetail />
            </View>
            <View style={{backgroundColor: '#ffffff', borderRadius: 12}}>
              <Text
                style={{
                  fontWeight: '800',
                  color: '#000000',
                  // margin: wp(5),
                  fontSize: hp(2),
                  padding: wp(3),
                }}>
                Payment Mode
              </Text>
              <RadioGroup
                radioButtons={radioButtons}
                onPress={setSelectedId}
                selectedId={selectedId}
                layout="row"
                containerStyle={{marginTop: hp(-1), marginBottom: hp(2)}}
              />
            </View>
          </View>

          <View style={styles.pickUpView}>
            <View>
              <DistanceIcon />
            </View>
            <View>
              <Text
                style={[
                  styles.heading,
                  // {marginTop: Platform.OS == 'android' ? hp(-2) : hp(0)},
                ]}>
                Distance & Time
              </Text>
              <Text
                style={[
                  styles.heading,
                  {
                    marginTop: hp(-2),
                    marginBottom: hp(2),
                    fontSize: hp(1.7),
                  },
                ]}>
                {props.distanceText} &{props.durationText}
              </Text>
            </View>
          </View>
        </ScrollView>

        {dateModal && (
          <RNDateTimePicker
            mode="date"
            value={date}
            minimumDate={new Date()}
            onChange={(event, value: any) => {
              if (event.type == 'dismissed') {
                setDateModal(false);
                if (!isRideScheduled) {
                  setSelectedIdScheduleRide('0');
                }
              } else if (event.type == 'set') {
                setDateModal(false);
                // setDate(value);
                date = value;
                if (date.toDateString() === time.toDateString()) {
                  time.setTime(time.getTime() + 1000 * 60 * 60);
                }
                setTimeModal(true);
              }
            }}
          />
        )}

        {timeModal && (
          <RNDateTimePicker
            mode="time"
            value={time}
            minimumDate={new Date()}
            onChange={(event, value: any) => {
              if (event.type == 'dismissed') {
                setTimeModal(false);
                setSelectedIdScheduleRide('0');
              } else if (event.type == 'set') {
                setTimeModal(false);
                // setTime(value);
                time = value;
                // confirmScheduleRide();
                handleRideScheduled();
              }
            }}
          />
        )}
      </View>

      <View style={[styles.button_container, {gap: wp(10)}]}>
        <TouchableOpacity
          onPress={BookRide}
          style={[
            styles.button,
            {
              backgroundColor: themeColor,
              display: 'flex',
              flexDirection: 'row',
              bottom: Platform.OS == 'ios' ? 0 : hp(3),
              width: wp(50),
            },
          ]}>
          <Text
            style={{
              flex: 1,
              fontWeight: '800',
              color: '#ffffff',
              textAlign: 'center',
            }}>
            Confirm Booking
          </Text>
          <View>
            <ArrowRight />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.setNavigationStep(0)}
          style={[
            styles.button,
            {
              backgroundColor: 'red',
              // display: 'flex',
              flexDirection: 'row',
              bottom: Platform.OS == 'ios' ? 0 : hp(3),
              width: wp(30),
            },
          ]}>
          <Text
            style={{
              flex: 1,
              fontWeight: '800',
              color: '#ffffff',
              textAlign: 'center',
            }}>
            Cancel
          </Text>
          <View>{/* <ArrowRight /> */}</View>
        </TouchableOpacity>
      </View>
    </View>
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
  input: {color: '#000000', margin: wp(5)},
  secondaryHeader: {
    fontWeight: '800',
    color: '#000000',
    margin: wp(5),
    fontSize: hp(1.8),
  },
  button: {
    width: wp(90),
    padding: wp(4),
    alignSelf: 'center',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp(5),
    borderRadius: 10,
  },
  button_container: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    zIndex: 110,
    position: 'absolute',
    height: hp(17),
    bottom: Platform.OS == 'android' ? 0 : hp(15),
    alignSelf: 'center',
    backgroundColor: '#F2F3F7',
  },
  safeArea: {backgroundColor: '#ffffff', flex: 1, minHeight: hp(100)},
  parentView: {
    // height: Platform.OS == 'android' ? hp(92) : hp(100),
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
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textScheduleRideDate: {
    fontWeight: '800',
    color: '#000000',
    fontSize: hp(2),
    marginTop: hp(-1),
    marginBottom: hp(2),
    paddingLeft: wp(3),
  },
  textScheduleRideDetail: {
    fontWeight: '800',
    color: '#000000',
    fontSize: hp(2),
    marginTop: hp(-1),
    marginBottom: hp(2),
    paddingLeft: wp(3),
  },
});
export default BookingScreen;

// 64ba6b7fcae0353435bc3dcd

/* Terms and Conditions

{/* 
  <Text style={styles.heading}>Promo Code</Text>
  <TextInput
    placeholder="Have a promocode ?"
    placeholderTextColor={'#000000'}
    style={[styles.input, {marginTop: hp(-2)}]}></TextInput> 

    {/* <Text style={styles.text}>
    Please Note: This is only an Estimated fare, the Final Fare may go up
    or down depending on Traffic Conditions. The Final Fare will show only
    when the Ride has ended{' '}
  </Text> 
    {/* <Text
    style={[
      styles.text,
      {color: 'red', fontWeight: '700', marginTop: hp(1)},
    ]}>
    Toll charges are not included in the Estd. Fare. The Cab Manager will
    enter the Toll Charges only when a Toll comes in your route
  </Text> 
    {/* <Text style={[styles.text, {color: '#000000', fontWeight: '700'}]}>
    Enjoy{' '}
  </Text>
  <Text style={[styles.text, styles.secondaryHeader]}>
    Zero Surge | Zero Technology Usage Cost |{' '}
  </Text>
  <Text
    style={[styles.text, styles.secondaryHeader, {marginTop: hp(-2)}]}>
    Zero Cancellations{' '}
  </Text>
  <Text
    style={[styles.text, styles.secondaryHeader, {marginTop: hp(-1)}]}>
    Night time charges will be at 1.5X
  </Text> 
*/
