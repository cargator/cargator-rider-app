/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  Appearance,
  PermissionsAndroid,
  Platform,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import store, {persistor, setRiderLocation} from './src/redux/redux';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MapScreen from './src/post-login/MapScreen';
import BookingScreen from './src/post-login/BookingScreen';
import LoginScreen from './src/pre-login/LoginScreen';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import LoginOtpScreen from './src/pre-login/LoginOtpScreen';
import Geolocation from 'react-native-geolocation-service';
import SplashScreen from 'react-native-splash-screen';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  checkLocationPermission,
  requestLocationPermission,
} from './src/components/common/functions';
import LocationPermissionScreen from './src/pre-login/LocationPermissionScreen';
import GPSPermissionScreen from './src/pre-login/GPSPermissionScreen';
import {DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer';
import Profile from './src/post-login/Profile';
import PreviousRides from './src/post-login/PreviousRides';
import toastConfig from './src/components/common/toastConfig';
import ScheduleRideScreen from './src/post-login/ScheduleRideScreen';
import AllScheduledRidesScreen from './src/post-login/AllScheduledRidesScreen';
import AddProfilDetails from './src/post-login/AddProfileDetails';
import {Text} from 'react-native';
import DeviceInfo from 'react-native-device-info';
// import {enableLatestRenderer} from 'react-native-maps';

// enableLatestRenderer();

const Appdrawercontent = (props: any) => {
  const [versionNumber, setVersionNumber] = useState('');

  useEffect(() => {
    const getVersion = async () => {
      const version = DeviceInfo.getVersion();
      setVersionNumber(version);
    };

    getVersion();
  }, []);
  return (
    <View style={{flex: 1, height: '100%'}}>
        <DrawerContentScrollView
        {...props}
        contentcontainerstyle={{flex: 1, position: 'relative'}}>
        <DrawerItemList {...props} style={{borderwidth: 1}} />
      </DrawerContentScrollView>
      <View style={{alignSelf: 'center', marginBottom: hp(1)}}>
        <Text style={{fontWeight: '600'}}>{`Version ${versionNumber}`}</Text>
      </View>
    </View>
  );
};

Appearance.setColorScheme('light');
const Drawer = createDrawerNavigator();

const MapScreenDrawer = () => {
  const [versionNumber, setVersionNumber] = useState('');

  useEffect(() => {
    const getVersion = async () => {
      const version = DeviceInfo.getVersion();
      setVersionNumber(version);
    };

    getVersion();
  }, []);
  return (
      <Drawer.Navigator screenOptions={{headerShown: false}}
        drawerContent={props => <Appdrawercontent {...props} />}>
        <Drawer.Screen
          name="Home"
          component={MapScreen}
          // options={{
          //   drawerItemStyle: {display: 'none'},
          // }}
        />
        <Drawer.Screen
          name="BookingScreen"
          component={BookingScreen}
          options={{
            drawerItemStyle: {display: 'none'},
          }}
        />
        {/* <Drawer.Screen
        name="ScheduleRideScreen"
        component={ScheduleRideScreen}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      /> */}
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Previous Rides" component={PreviousRides} />
        <Drawer.Screen
          name="Scheduled Rides"
          component={AllScheduledRidesScreen}
        />
      </Drawer.Navigator>
  );
};

export const Routing = () => {
  // const infoVisible = useSelector((store: any) => store.infoVisible);
  const Stack = createNativeStackNavigator();
  const loginToken = useSelector((store: any) => store.loginToken);
  const name = useSelector((store: any) => store.userData.name);
  const dispatch = useDispatch();
  const gpsPermission = useSelector((store: any) => store.gpsPermission);
  const locationPermission = useSelector(
    (store: any) => store.locationPermission,
  );

  useEffect(() => {
    (async () => {
      SplashScreen.hide();
      await checkLocationPermission(dispatch);
      await requestLocationPermission(dispatch, false); // "false" given as second-argument so that only some-part (i.e. "IF" part) of "requestLocationPermission" is executed.
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
          orientation: 'portrait',
        }}>
        {!loginToken ? (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="LoginOtpScreen" component={LoginOtpScreen} />
          </>
        ) : (
          <>
            {!name && (
              <Stack.Screen
                name="AddProfilDetails"
                component={AddProfilDetails}
              />
            )}

            {!locationPermission ? (
              <Stack.Screen
                name="LocationPermissionScreen"
                component={LocationPermissionScreen}
              />
            ) : !gpsPermission && Platform.OS == 'android' ? (
              <Stack.Screen
                name="GPSPermissionScreen"
                component={GPSPermissionScreen}
              />
            ) : (
              <Stack.Screen
                name="MapScreenDrawer"
                component={MapScreenDrawer}
              />
            )}
          </>
        )}
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );

  // ! OLD-CODE
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator
  //       initialRouteName="LoginScreen"
  //       screenOptions={{
  //         headerShown: false,
  //       }}>
  //       {!locationPermission ? (
  //         <Stack.Screen
  //           name="LocationPermissionScreen"
  //           component={LocationPermissionScreen}
  //         />
  //       ) : !gpsPermission ? (
  //         <Stack.Screen
  //           name="GPSPermissionScreen"
  //           component={GPSPermissionScreen}
  //         />
  //       ) : !loginToken ? (
  //         <>
  //           <Stack.Screen name="LoginScreen" component={LoginScreen} />
  //           <Stack.Screen name="LoginOtpScreen" component={LoginOtpScreen} />
  //         </>
  //       ) : (
  //         <>
  //           {/* <Stack.Screen name="MapScreen" component={MapScreen} />
  //           <Stack.Screen name="BookingScreen" component={BookingScreen} /> */}
  //           <Stack.Screen name="MapScreenDrawer" component={MapScreenDrawer} />
  //         </>
  //       )}
  //     </Stack.Navigator>
  //     <Toast />
  //   </NavigationContainer>
  // );

  // ! OLD-CODE
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator
  //       screenOptions={{
  //         headerShown: false,
  //       }}>
  //       {/* {infoVisible ? ( */}
  //       <>
  //         {/* {!userId ? ( */}
  //         {!loginToken ? (
  //           <>
  //             <Stack.Screen name="LoginScreen" component={LoginScreen} />
  //             <Stack.Screen name="LoginOtpScreen" component={LoginOtpScreen} />
  //           </>
  //         ) : (
  //           <>
  //             <Stack.Screen name="MapScreen" component={MapScreen} />
  //             <Stack.Screen name="BookingScreen" component={BookingScreen} />
  //           </>
  //         )}
  //       </>
  //       {/* ) : (
  //         <>
  //           <Stack.Screen name="InfoScreen" component={InfoScreen} />
  //           <Stack.Screen name="MainInfoScreen" component={MainInfoScreen} />
  //         </>
  //       )} */}
  //     </Stack.Navigator>
  //     <Toast />
  //   </NavigationContainer>
  // );
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaView style={{flex: 1, height: hp(100), width: wp(100)}}>
          <Routing />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
