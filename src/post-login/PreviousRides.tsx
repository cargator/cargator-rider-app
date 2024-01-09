import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import LoaderComponent from '../components/common/LoaderComponent';
import {useIsFocused} from '@react-navigation/native';
import SidebarIcon from '../components/svg/SidebarIcon';
import moment from 'moment';
import ArrowLeft from '../components/svg/ArrowLeft';
import SmallPickupIcon from '../components/svg/SmallPickupIcon';
import SmallDropIcon from '../components/svg/SmallDropIcon';
import { getAllRides } from '../services/rideservices';
import { isEmpty as _isEmpty } from 'lodash';

const PreviousRides = (props: any) => {
  const isFocused = useIsFocused();
  const userId = useSelector((store: any) => store.userData._id);
  const [loading, setLoading] = useState<boolean>(false);
  const [userRides, setUserRides] = useState<any>([]);

  const getUserRideDetails = async () => {
    try {
      setLoading(true);
      const resp = await getAllRides(userId)
      console.log("resp rides", resp)
      setUserRides(resp.data);
    } catch (error: any) {
      console.log('getUserRideDetails error :>> ', error);
      Toast.show({
        type: 'error',
        text1: error.response.data.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getUserRideDetails();
    } else {
      setUserRides([]);
    }
  }, [isFocused]);

  return (
    <>
     <TouchableOpacity
        style={styles.header}
        onPress={() => props.navigation.toggleDrawer()}>
        <SidebarIcon />
      </TouchableOpacity>
      {loading ? (
        <View style={styles.loading}>
          <LoaderComponent />
        </View>
      ) : (
        <SafeAreaView style={styles.safeAreaView}>
          <View style={{flexDirection: 'row',marginLeft:wp(5)}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <ArrowLeft />
            </TouchableOpacity>

            <Text
              style={{
                fontFamily:'Roboto Mono',
                fontSize: hp(2.5),
                color: '#000000',
                marginBottom: hp(1),
                marginLeft:wp(3),
                fontWeight:'600'
              }}>
              Rides
            </Text>
          </View>

          <View style={[styles.container, {backgroundColor: '#fff'}]}>
            {_isEmpty(userRides) ? (
              <View style={styles.noRidesContainer}>
                <Text style={styles.noRidesContainerText}>
                  No previous rides found !
                </Text>
              </View>
            ) : (
              <ScrollView
              style={{
                backgroundColor: '#F2F3F7',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
              }}>
              {userRides?.length > 0 &&
                userRides.map((rides: any, i: any) => {
                  return (
                    <View style={styles.rideView} key={i + 1}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: wp(3),
                        }}>
                        <View style={{width: wp(55)}}>
                          <View style={styles.spinnerMyAddressView}>
                            <SmallPickupIcon />
                            <Text style={styles.spinnerAddressText}>
                              {rides.pickUpAddress}
                            </Text>
                          </View>
  
                          <View style={styles.commonDiplayStyles}>
                            <View
                              style={[
                                styles.verticalLine,
                                {
                                  marginLeft: wp(3),
                                  borderColor: '#6B7280',
                                },
                              ]}
                            />
                          </View>
  
                          <View style={styles.spinnerDropIconView}>
                            <SmallDropIcon />
                            <Text style={styles.spinnerAddressText}>
                              {rides.dropAddress}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontFamily:'Roboto Mono',
                              color: '#000000',
                              marginBottom: hp(0.5),
                              fontWeight: '700',
                              fontSize: wp(3.3),
                            }}>
                            {moment(rides.createdAt).format('Do MMM YYYY')}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily:'Roboto Mono',
                            color: '#000000',
                            fontWeight: '500',
                            marginLeft: wp(2),
                          }}>
                          ₹ {rides.fare}
                        </Text>
                        <View
                          style={{
                            backgroundColor:
                              rides?.status == 'cancelled'
                                ? '#fad1d1'
                                : rides?.status == 'completed'
                                ? '#c6ebd3'
                                : '#d9d1fa',
                            // opacity: 0.4,
                            paddingBottom: wp(1.8),
                            paddingTop: wp(1.8),
                            paddingLeft: wp(4),
                            paddingRight: wp(4),
                            borderRadius: hp(1.8),
                            borderWidth: 2,
                            borderColor:
                              rides?.status == 'cancelled'
                                ? '#EB5757'
                                : rides?.status == 'completed'
                                ? '#57c67c'
                                : '#6847ed',
                          }}>
                          <Text
                            style={{
                              fontFamily:'Roboto Mono',
                              color:
                                rides?.status == 'cancelled'
                                  ? '#EB5757'
                                  : rides?.status == 'completed'
                                  ? '#57c67c'
                                  : '#6847ed',
                              fontWeight: '600',
                              fontSize: wp(3),
                            }}>
                            {rides.status == 'pending-accept' && rides.bookingTime ? 'Scheduled' : rides.status.charAt(0).toUpperCase() +
                              rides.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
              
            )}
          </View>

        
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: wp(2),
  },
  noRidesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(100),
    // flex: 1,
    // width: wp(100),
  },
  noRidesContainerText: {
    fontFamily:'Roboto Mono',
    fontWeight: '800',
    color: '#000',
    fontSize: hp(5),
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(2),
    width: wp(100),
  },
  loading: {
    height: hp(100),
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  text: {
    color: '#000000',
    fontWeight: '600',
    marginBottom: hp(0.5),
    marginTop: hp(0.5),
  },
  safeAreaView: {backgroundColor: '#f9f9f9', height: hp(100), width: wp(100)},
  rideView: {
    margin: hp(2),
    backgroundColor: '#ffffff',
    borderRadius: hp(2),
    padding: hp(1),
  },
  verticalLine: {
    height: hp(2.5),
    width: wp(0.5),
    alignSelf: 'flex-start',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
  },
  spinnerMyAddressView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingLeft: wp(3),
    // paddingRight: 8,
    // maxWidth: wp(70),
  },
  spinnerAddressText: {
    fontFamily:'Roboto Mono',
    color: '#000000',
    // marginLeft: wp(2),
    fontWeight: '500',
    fontSize: wp(3),
    marginLeft:wp(2)
  },
  spinnerDropIconView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: hp(1.5),
    // paddingLeft: 10,
    // paddingRight: wp(3),
    // maxWidth: wp(70),   510118vraq2a00
  },
  commonDiplayStyles: {display: 'flex', flexDirection: 'row'},
});
export default PreviousRides;
