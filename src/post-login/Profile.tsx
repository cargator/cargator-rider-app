import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import SidebarIcon from '../components/svg/SidebarIcon';
import LoaderComponent from '../components/common/LoaderComponent';
import { getUserInfo } from '../services/userservices';
import { useIsFocused } from '@react-navigation/native';
import LogOutIcon from '../components/svg/LogOutIcon';
import { socketDisconnect } from '../utils/socket';
import { removeUserData } from '../redux/redux';
import moment from 'moment';

const Profile = (props: any) => {
  const user = useSelector((store: any) => store.userData);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>({});
  const isFocused = useIsFocused();
  const formattedDate = moment(user.createdAt).format('D MMMM, YYYY');
  const dispatch = useDispatch();
  const getRiderDetail = async () => {
    try {
      setLoading(true);
      const response = await getUserInfo(user._id);
      setUserData(response.data);
    } catch (error) {
      console.log('Driver Detail error :>> ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    socketDisconnect();
    dispatch(removeUserData());
  };
  useEffect(() => {
    if (isFocused) {
      getRiderDetail();
    } else {
      setUserData([]);
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
        <View style={styles.loaderStyles}>
          <LoaderComponent />
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <View style={{alignItems: 'center'}}>
              <View style={styles.profileView}>
                <Text style={styles.profileText}>
                  {userData.name ? userData.name[0].toUpperCase() : 'R'}
                </Text>
              </View>

              <View style={styles.profileDataContainer}>
                <View style={styles.contentView}>
                  <Text style={styles.contentViewHeading}>Name</Text>
                  <Text style={styles.contentViewText}>{userData.name}</Text>
                </View>

                <View style={styles.contentView}>
                  <Text style={styles.contentViewHeading}>Mobile number</Text>
                  <Text style={styles.contentViewText}>
                    {userData.mobileNumber}
                  </Text>
                </View>

                <View style={styles.contentView}>
                  <Text style={styles.contentViewHeading}>Number of rides completed</Text>
                  <Text style={styles.contentViewText}>
                    {userData.totalRidesCompleted}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={styles.bottomView}>
            <TouchableOpacity onPress={handleLogout}>
              <LogOutIcon />
            </TouchableOpacity>
            <Text style={styles.date}>
              Member Since {formattedDate}
            </Text>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  profileDataContainer: {
    alignSelf: 'center',
    gap: wp(2),
    marginTop: hp(5),
    // width: wp(70),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(2),
    width: wp(100),
  },
  profileView: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(50),
    backgroundColor: '#2BB180',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(10),
  },
  profileText: {fontFamily:'Roboto Mono',color: '#ffffff', fontSize: wp(10)},
  horixontalLine: {
    backgroundColor: '#E5E7EB',
    height: 1,
    width: wp(60),
    marginTop: hp(8),
    alignSelf: 'center',
  },
  contentView: {
    borderRadius: wp(3),
    shadowColor: '#171717',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 25,
    width: wp(90),
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  contentViewHeading: {
    fontFamily:'Roboto Mono',
    color: '#9CA3AF',
    fontSize: hp(1.8),
    fontWeight: '500',
  },
  contentViewText: {
    fontFamily:'Roboto Mono',
    color: '#212121',
    fontSize: hp(2.2),
    fontWeight: '500',
  },
  text: {fontSize: wp(5), color: '#000000'},
  loaderStyles: {marginTop: hp(40), alignSelf: 'center'},
  bottomView:{
    top: hp(35),
    alignSelf: 'center',
    alignItems: 'center',
  },
  date:{fontFamily:'Roboto Mono',marginTop: hp(5), color: '#BAB6B6'}
});

export default Profile;
