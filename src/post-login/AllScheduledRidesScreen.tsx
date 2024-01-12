import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LoaderComponent from '../components/common/LoaderComponent';
import { useIsFocused } from '@react-navigation/native';
import SidebarIcon from '../components/svg/SidebarIcon';
import Calender from '../components/svg/Calender';
import Vehicle from '../components/svg/Vehicle';
import Rupee from '../components/svg/Rupee';
import Path from '../components/svg/Path';
import { isEmpty as _isEmpty } from 'lodash';
import moment from 'moment';
import SmallPickupIcon from '../components/svg/SmallPickupIcon';
import SmallDropIcon from '../components/svg/SmallDropIcon';
import { cancelRide, getScheduledRides } from '../services/rideservices';
const AllScheduledRidesScreen = (props: any) => {
  const isFocused = useIsFocused();
  const userId = useSelector((store: any) => store.userData._id);
  const [loading, setLoading] = useState<boolean>(false);
  const [scheduledRides, setScheduledRides] = useState<any>([]);
  const [isDeletePressed, setIsDeletePressed] = useState<boolean>(false);
  // const  formattedDateTime= moment.utc(userRides?.bookingTime).local().format('Do MMM, h:mm A');

  const handleDeleteRide = async (ride: any) => {
    try {
      setLoading(true);
      setIsDeletePressed(true);

      const rideId = {rideId: ride._id}
      const response: any = await cancelRide(rideId)
      Toast.show({
        type: 'success',
        text1: response.message,
      });
      // setScheduledRides(allRides =>
      //   allRides.filter((prevRide: any) => prevRide._id != ride._id),
      // );
      setScheduledRides([]);
      props.navigation.navigate('Home');
    } catch (error: any) {
      console.log(`handleDeleteRide error :>> `, error);
      Toast.show({
        type: 'error',
        text1: error.response.data.message,
      });
    } finally {
      setIsDeletePressed(false);
      setLoading(false);
    }
  };

  const fetchScheduledRides = async () => {
    try {
      setLoading(true);
      if (!_isEmpty(scheduledRides)) {
        console.log('returning from herer', _isEmpty(scheduledRides));
        return;
      }
      const response:any = await getScheduledRides(userId)
      setScheduledRides(response.data);
    } catch (error: any) {
      console.log('fetchScheduledRides error :>> ', error);
      Toast.show({
        type: 'error',
        // text1: error.message,
        text1: error.response.data.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchScheduledRides();
    } else {
      setScheduledRides([]);
    }
  }, [isFocused]);

  return (
    <>
      <TouchableOpacity
        style={styles.header}
        onPress={() => props.navigation.toggleDrawer()}>
        <SidebarIcon />
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            flex: 1,
            marginLeft: wp(2),
            marginTop: hp(0.4),
          }}>
          <Text style={{fontSize: hp(3), fontFamily: 'RobotoMono-Regular'}}>
            Schedule Rides
          </Text>
        </View>
      </TouchableOpacity>
      {loading ? (
        <View style={styles.loader}>
          <LoaderComponent />
        </View>
      ) : (
        <>
          <View style={[styles.container, {backgroundColor: '#fff'}]}>
            {_isEmpty(scheduledRides) ? (
              <View style={styles.noRidesContainer}>
                <Text style={styles.noRidesContainerText}>
                  No scheduled rides found !
                </Text>
              </View>
            ) : (
              <ScrollView>
                {scheduledRides?.length > 0 &&
                  scheduledRides.map((rides: any, i: any) => {
                    return (
                      <View style={styles.pickUpView} key={i + 1}>
                        <View style={styles.parentView}>
                          <View style={styles.pickUpIconView}>
                            <SmallPickupIcon />
                          </View>
                          <View style={styles.subView}>
                            <View style={{flexDirection: 'column'}}>
                              <Text style={styles.heading}>Pickup</Text>
                              <Text style={styles.addressText}>
                                {rides.pickUpAddress}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.verticalLine} />

                          <View style={styles.dropView}>
                            <View style={styles.dropIconView}>
                              <SmallDropIcon />
                            </View>
                            <View
                              style={{
                                flexDirection: 'column',
                                marginLeft: wp(1),
                              }}>
                              <Text style={styles.heading}>Destination</Text>
                              <Text style={styles.addressText}>
                                {rides.dropAddress}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.horizontal} />
                          <View style={styles.extraDetailView}>
                            <Calender />
                            <View style={{marginLeft: wp(3)}}>
                              <Text style={styles.text}>Date & Time</Text>
                              <Text style={styles.subText}>
                                {moment
                                  .utc(rides?.bookingTime)
                                  .local()
                                  .format('Do MMM, h:mm A')}
                              </Text>
                            </View>
                            <View
                              style={{
                                marginLeft:
                                  Platform.OS == 'ios' ? wp(4) : wp(10),
                                flexDirection: 'row',
                              }}>
                              <Vehicle />
                              <View
                                style={{
                                  flexDirection: 'column',
                                  marginLeft: wp(3),
                                }}>
                                <Text style={styles.text}>Vehicle</Text>
                                <Text style={styles.subText}>Mini Car</Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.horizontal} />
                          <View style={styles.extraDetailView}>
                            <Rupee />
                            <View style={{marginLeft: wp(3)}}>
                              <Text style={styles.text}>Estimated Fare</Text>
                              <Text style={styles.subText}>{rides.fare}</Text>
                            </View>
                            <View
                              style={{
                                marginLeft:
                                  Platform.OS == 'ios' ? wp(17) : wp(19),
                                flexDirection: 'row',
                              }}>
                              <Path />
                              <View
                                style={{
                                  flexDirection: 'column',
                                  marginLeft: wp(3),
                                }}>
                                <Text style={styles.text}>Distance</Text>
                                <Text style={styles.subText}>
                                  {rides.distance}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDeleteRide(rides)}
                          style={styles.deleteButton}
                          disabled={isDeletePressed}>
                          {isDeletePressed && (
                            <ActivityIndicator size="small" color="#EB5757" />
                          )}
                          <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
              </ScrollView>
            )}
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(2),
  },
  dropIconView: {marginRight: wp(2)},
  pickUpIconView: {
    marginTop: hp(3),
    marginLeft: wp(5),
  },
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
    fontSize: hp(2),
  },
  parentView: {
    backgroundColor: '#ffffff',
    width: wp(90),
    alignSelf: 'center',
    marginTop: hp(3),
    borderRadius: wp(2),
    elevation: 2,
    // flex: 1,
    // height: hp(10),
    // maxHeight: hp(45),
  },
  pickUpView: {
    backgroundColor: '#F2F3F7',
    borderRadius: wp(8),
    // marginBottom: hp(2),
    display: 'flex',
    padding: wp(1),
    // height: hp(100),
    // paddingLeft: 5,
    // paddingRight: 5,
    marginTop: hp(3),
  },
  textScheduleRideDetail: {
    fontWeight: '800',
    color: '#000000',
    fontSize: hp(2),
    marginTop: hp(-1),
    marginBottom: hp(2),
    paddingLeft: wp(3),
  },
  noRidesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(100),
    // flex: 1,
    // width: wp(100),
  },
  noRidesContainerText: {
    fontWeight: '800',
    color: '#000',
    fontSize: hp(5),
  },
  deleteButton: {
    padding: wp(3),
    marginBottom: wp(2),
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#EB5757',
    borderWidth: 1,
    borderRadius: wp(4),
    width: wp(80),
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(3),
    // bottom: hp(3),
    // position: 'absolute',
  },
  deleteText: {
    fontSize: wp(4.5),
    fontWeight: '800',
    color: '#EB5757',
  },
  loader: {
    height: hp(100),
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  addressText: {
    color: '#000000',
    fontSize: hp(1.6),
    maxWidth: wp(68),
    marginTop: hp(0.5),
  },
  dateTimeText: {
    fontWeight: '800',
    color: '#000000',
    fontSize: hp(2),
    padding: wp(3),
  },
  subHeadingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: hp(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(1),
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(2),
    width: wp(100),
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
  horizontal: {
    backgroundColor: '#F2F3F7',
    height: 1,
    width: wp(80),
    marginLeft: wp(6),
    alignSelf: 'center',
    marginTop: hp(2),
  },
  text: {color: '#9CA3AF', fontWeight: '700'},
  subText: {fontWeight: '800', color: '#000000', fontSize: hp(1.8)},
  verticalLine: {
    width: wp(0.5),
    alignSelf: 'flex-start',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    marginLeft: wp(8.5),
    height: hp(5),
    maxHeight: hp(7),
    flex: 2,
    position: 'absolute',
    marginTop: hp(7.5),
  },
  subView: {
    // backgroundColor: '#ffffff',
    width: wp(73),
    flexDirection: 'row',
    // alignSelf: 'center',
    marginLeft: wp(15),
    marginTop: hp(-3.5),
    alignSelf: 'flex-start',
    left: wp(2),
    position: 'relative',
  },
  dropView: {
    width: wp(80),
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp(2),
  },
  extraDetailView: {flexDirection: 'row', margin: wp(4)},
});

export default AllScheduledRidesScreen;
