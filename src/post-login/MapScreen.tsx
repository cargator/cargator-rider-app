import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Linking,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Geolocation from 'react-native-geolocation-service';
import AutocompleteInput from 'react-native-autocomplete-input';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {getSocketInstance, socketDisconnect} from '../utils/socket';
import {useDispatch, useSelector} from 'react-redux';
import {
  removeRideDetails,
  setGpsPermission,
  setLocationPermission,
  setRideDetails,
} from '../redux/redux';
import BookingScreen from './BookingScreen';
import Spinner from 'react-native-spinkit';
import CallIcon from '../components/svg/CallIcon';
import CancelIcon from '../components/svg/CancelIcon';
import ChatIcon from '../components/svg/ChatIcon';
import DefaultProfile from '../components/svg/DefaultProfile';
import LoaderComponent from '../components/common/LoaderComponent';
import Car from '../components/svg/Car';
import Toast from 'react-native-toast-message';
import PickupIcon from '../components/svg/PickupIcon';
import DropIcon from '../components/svg/DropIcon';
// import HrLine from '../components/svg/hrLine';
import ArrowRight from '../components/svg/ArrowRight';
import SmallCarIcon from '../components/svg/SmallCarIcon';
import RatingStarIcon from '../components/svg/RatingStarIcon';
import LocationNotFound from '../components/svg/LocationNotFound';
import Internet from '../components/svg/Internet';
import RazorpayCheckout from 'react-native-razorpay';
import {
  removeOrderId,
  removeUserData,
  setUtils,
  setOrderId,
} from '../redux/redux';
import {GiftedChat} from 'react-native-gifted-chat';
import {Badge, Button} from 'react-native-elements';
import ChatComponent from './ChatComponent';
import DropMarker from '../components/svg/DropMarker';
import PickupMarker from '../components/svg/PickupMarker';
import * as geolib from 'geolib';
import {
  isEmpty as _isEmpty,
  debounce as _debounce,
  isNumber as _isNumber,
  isNull as _isNull,
} from 'lodash';
import {styles as ExternalStyles, themeColor} from '../styles/styles';
import SidebarIcon from '../components/svg/SidebarIcon';
import moment from 'moment';
import {
  cancelPaymentOrder,
  createPaymentOrder,
} from '../services/paymentservices';
import {DriverInfo, getRideFare} from '../services/rideservices';
import {
  DirectionsApi,
  suggestedPlaces,
  getAddressFromCoords,
  getCoordsFromAddress,
} from '../services/mapservices';
import {getUtils} from '../services/userservices';
import customAxios from '../services/appservices';
// import * as _ from 'lodash';
// import { dummy_Path, dummy_distance, dummy_duration, dummy_nearbyDrivers } from './dummyData';

export let socketInstance: any;
let previousNearbyDrivers: any = [];
let myCurrentLocation: any = {};
let distanceMoreThan80Meters: boolean = false;

const MapScreen = (props: any) => {
  const loginToken = useSelector((store: any) => store.loginToken);
  const riderLocation = useSelector((store: any) => store.liveLocation);
  const userData = useSelector((store: any) => store.userData);
  const debounceTime = useSelector((store: any) => store.utils?.debounceTime);
  const preBookRideTime = useSelector(
    (store: any) => store.utils.preBookRideTime,
  );
  const mapRef = useRef<any>(null);
  const mapRef1 = useRef<any>(null);
  const [destAddress, setDestAddress] = useState('');
  const [done, setDone] = useState(false);
  const [driverLocation, setDriverLocation] = useState({
    latitude: 19.164991755720866,
    longitude: 72.96562536656589,
  });
  const [mylocation, setMyLocation] = useState<any>({
    latitude: 0,
    longitude: 0,
  });
  const [destLocation, setDestLocation] = useState<any>({
    latitude: '',
    longitude: '',
  });
  const [path, setPath] = useState<any>([]);
  const [myAddress, setMyAddress] = useState('');
  const [duration, setDuration] = useState({
    text: '',
    value: '',
  });
  const [distance, setDistance] = useState({
    text: '',
    value: '',
  });
  const [destSearchResults, setDestSearchResults] = useState([]);
  const [pickUpSearchResults, setpickUpSearchResults] = useState([]);
  const [navigationStep, setNavigationStep] = useState(0);
  const [isRideStarted, setIsRideStarted] = useState(false);
  const rideDetails = useSelector((store: any) => store.rideDetails);
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState(0);
  const [customSpinner, setCustomSpinner] = useState(false);
  const [popup, setPopup] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<any>([]);
  const timeoutRef = useRef<any>();
  const dispatch = useDispatch();
  const [paymentError, setPaymentError] = useState({});
  const [id, setId] = useState('');
  const [isChatComponent, setIsChatComponent] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState<number>(0);
  const [driverDetails, setDriverDetails] = useState<any>({});
  const [isProfileModal, setIsProfileModal] = useState<boolean>(false);
  const [selection_1, setSelection_1] = useState<any>({start: 0});
  const [selection_2, setSelection_2] = useState<any>({start: 0});
  const [driverArrivalTime, setDriverArrivalTime] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState(false);
  // const [isScheduleRide, setIsScheduleRide] = useState<boolean>(false);
  // const [scheduledRideDetails, setScheduledRideDetails] = useState<any>([]);
  // const paymentCompleted = useSelector((store: any) => store.paymentCompleted);
  // const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [intervalState, setIntervalState] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  const distanceMoreThan80MetersFromNearbyDrivers = (newNearbyDrivers: any) => {
    // console.log(`distanceMoreThan80MetersFromNearbyDrivers called !`);
    // console.log('myCurrentLocation :>> ', myCurrentLocation);

    for (let i = 0; i < newNearbyDrivers.length; i++) {
      const distanceFromDriver = geolib.getDistance(
        myCurrentLocation,
        newNearbyDrivers[i],
      );
      // console.log(`distanceFromDriver :>> `, distanceFromDriver);
      if (distanceFromDriver >= 80) {
        return true;
      }
    }

    return false;
  };

  const compareNearbyDrivers = (newNearbyDrivers: any) => {
    if (previousNearbyDrivers.length != newNearbyDrivers.length) {
      // console.log(`compareNearbyDrivers returning FALSE !`);
      return false;
    }

    previousNearbyDrivers.sort((a: any, b: any) => a.latitude < b.latitude);
    newNearbyDrivers.sort((a: any, b: any) => a.latitude < b.latitude);

    for (let i = 0; i < previousNearbyDrivers.length; i++) {
      if (
        previousNearbyDrivers[i].latitude != newNearbyDrivers[i].latitude ||
        previousNearbyDrivers[i].longitude != newNearbyDrivers[i].longitude
      ) {
        // console.log(`compareNearbyDrivers returning FALSE !`);
        return false;
      }
    }

    // console.log(`compareNearbyDrivers returning TRUE !`);
    return true;
  };

  const handleArrivalTime = (distanceBetweenRiderAndDriver: any) => {
    // console.log({distanceBetweenRiderAndDriver});

    if (distanceBetweenRiderAndDriver < 400) {
      setDriverArrivalTime('1 minute.');
    } else if (distanceBetweenRiderAndDriver < 800) {
      setDriverArrivalTime('2 minutes.');
    } else if (distanceBetweenRiderAndDriver < 1200) {
      setDriverArrivalTime('3 minutes.');
    } else if (distanceBetweenRiderAndDriver < 1600) {
      setDriverArrivalTime('4 minutes.');
    } else if (distanceBetweenRiderAndDriver < 2000) {
      setDriverArrivalTime('5 minutes.');
    } else {
      setDriverArrivalTime(''); // ELSE Reset/Empty the Arrival-Time.
    }
  };

  const handleSeenAllMessges = () => {
    socketInstance.emit('all-chat-messages-seen', {
      message: 'Rider has seen all messages',
      rideId: rideDetails._id,
    });
  };

  const handleFocus_1 = () => {
    setIsProfileModal(false);
    setSelection_1(null);
  };
  const handleBlur_1 = () => {
    setSelection_1({start: 0});
  };

  const handleFocus_2 = () => {
    setIsProfileModal(false);
    setSelection_2(null);
  };
  const handleBlur_2 = () => {
    setSelection_2({start: 0});
  };

  const getNearbyDrivers = () => {
    let intervalId: any;
    if (intervalState) {
      clearInterval(intervalState);
    }

    if (_isEmpty(rideDetails) && !_isEmpty(mylocation)) {
      intervalId = setInterval(async () => {
        socketInstance?.emit('nearby-drivers', {
          location: {
            latitude: mylocation.latitude,
            longitude: mylocation.longitude,
          },
        });
      }, 5000);
      setIntervalState(intervalId);
    }
  };

  const handleLogout = () => {
    socketDisconnect();
    dispatch(removeUserData());
  };

  const handleSendMessage = useCallback(
    (newMessage: any = []) => {
      setMessages((previousMessages: any) =>
        GiftedChat.append(previousMessages, newMessage),
      );
      socketInstance.emit('chat-message', {
        message: 'New message from rider',
        rideId: rideDetails._id,
        chatMessage: newMessage[0],
      });
    },
    [rideDetails],
  );

  const CancelOrder = async () => {
    try {
      const data = {
        ...paymentError,
        id,
      };
      const response = await cancelPaymentOrder(data);
      setPaymentError({});
      dispatch(removeOrderId());
    } catch (error: any) {
      console.log('error while cancelling order', error);
    }
  };

  const emptyStates = () => {
    FetchUserLocation();
    setNavigationStep(0);
    setDestLocation({
      latitude: '',
      longitude: '',
    });
    setDestAddress('');
    setPath([]);
    setDuration({
      text: '',
      value: '',
    });
    setDistance({
      text: '',
      value: '',
    });
    // setRideDetails({});
    dispatch(removeRideDetails());
    setDone(false);
    // dispatch(setPaymentCompleted(false));
    setLoading(false);
    setIsRideStarted(false);
    setDriverDetails({});
    setUnseenMessagesCount(0);
    setIsProfileModal(false);
    getAddress(mylocation);
  };

  const handleChangePaymentMode = async () => {
    console.log(`handleChangePaymentMode called !`);
    socketInstance?.emit('change-payment-mode', {
      rideId: rideDetails._id,
      paymentMode: rideDetails.paymentMode,
    });
    setLoading(true);
  };

  const handlePayCash = async () => {
    console.log(`handlePayCash called !`);

    // if (!paymentCompleted) {
    Toast.show({
      type: 'error',
      text1: 'Please wait for the driver to confirm the payment !',
    });
    return;
    // }
  };

  const handlePayOnline = async () => {
    try {
      setLoading(true);
      const amount = Math.ceil(rideDetails.fare * 100);
      const paymentData = {
        amount,
        mobileNumber: userData.mobileNumber,
        user_id: rideDetails.riderId,
        rideId: rideDetails._id,
      };
      const resp: any = await createPaymentOrder(paymentData);
      setId(resp.data._id);
      let orderData = {
        id: resp.data._id,
        description: 'Payment processing cancelled by user',
      };
      dispatch(setOrderId(orderData));

      var options: any = {
        description: 'Making Payment to Cab Driver',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_o0EnldFsbvc2ST', // Your api key
        order_id: resp?.data?.order_id,
        amount: resp?.data?.amount,
        name: 'Rider Name',
        prefill: {
          email: 'rider@rider.com',
          contact: userData.mobileNumber,
          name: 'Razorpay Software',
        },
        theme: {color: themeColor},
      };

      const openRazorPay = await RazorpayCheckout.open(options);
      // dispatch(setPaymentCompleted(true));
      // Toast.show({
      //   type: 'success',
      //   text1: 'Payment Successfull and ride completed !',
      // });
    } catch (error: any) {
      setLoading(false);
      /*
        If user comes back from razorpay screen on payment failure, then we are not storing payment error instead we are receiving it through callback
        Else user intenetionally comes back , order is already created we have to make it cancelled 
      */
      console.log('error in handlePayOnline', error);
      if (
        error?.error?.code == 'BAD_REQUEST_ERROR' &&
        _isEmpty(error.error.metadata)
      ) {
        setPaymentError(error?.error);
      }
    }
  };

  const handleCancelRide = () => {
    socketInstance.emit('cancel-ride', {
      message: 'cancel-ride',
      rideId: rideDetails._id,
    });
    setCustomSpinner(false);
    setIsProfileModal(false);
    setPopup(false);
    setUnseenMessagesCount(0);
    setNavigationStep(0);
    setDestLocation({
      latitude: '',
      longitude: '',
    });
    setDestAddress('');
    setPath([]);
    setDuration({
      text: '',
      value: '',
    });
    setDistance({
      text: '',
      value: '',
    });
    // setRideDetails({});
    setIsRideStarted(false);
    dispatch(removeRideDetails());
    setDone(false);
    setMyAddress('');
    setNearbyDrivers([]);
    FetchUserLocation();
  };

  const handleFare = async () => {
    try {
      const data = {distance: distance.value};
      const resp = await getRideFare(data);
      setFare(resp.data.estimatedFare);
      isInputFieldFilled();
    } catch (error: any) {
      console.log('error while fetching fare', error);
    }
  };

  const getAddressFromAutoComplete = async (text: string) => {
    try {
      if (text?.length >= 4) {
        const response: any = await suggestedPlaces(text);
        return response?.data?.predictions || [];
        // return dummy_destAutoComplete;
      }
      return [];
    } catch (error: any) {
      console.log('error in getAddressFromAutoComplete', error);
    }
  };

  const pickupTextDebouncer = useCallback(
    _debounce(pickupChangeTextDebounced, debounceTime || 0),
    [],
  );

  async function pickupChangeTextDebounced(text: string) {
    const results: any = await getAddressFromAutoComplete(text);
    setpickUpSearchResults(results);
  }

  const destTextDebouncer = useCallback(
    _debounce(destChangeTextDebounced, debounceTime || 0),
    [],
  );

  async function destChangeTextDebounced(text: string) {
    const results: any = await getAddressFromAutoComplete(text);
    setDestSearchResults(results);
  }

  const getAddress = async (location: {latitude: any; longitude: any}) => {
    try {
      if (
        !_isNumber(location.latitude) ||
        location.latitude === 0 ||
        location.longitude === 0 ||
        !_isNumber(location.longitude) ||
        myAddress
      ) {
        return;
      }
      const response: any = await getAddressFromCoords(location);
      setMyAddress(response?.data?.address);
    } catch (error: any) {
      console.log('error in getAddress', error);
    }
  };

  const FetchUserLocation = async () => {
    try {
      // Sometimes getCurrentPosition from App.tsx requires time....meanwhile user logs in and we dont get location
      // Also watchPosition sometimes fails to retrieve location ...So added getCurrentPosition again below
      Geolocation.getCurrentPosition(
        position => {
          const {coords} = position;
          const message = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          console.log('Got current location');
          setMyLocation(message);
        },
        error => {
          console.log('error in getCurrentPosition', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
      Geolocation.watchPosition(
        position => {
          const {coords} = position;
          const message = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          setMyLocation(message);
          myCurrentLocation = message;
        },
        error => {
          console.log(`FetchUserLocation error :>> `, error);
          if (error.message == 'Location permission not granted.') {
            Toast.show({
              type: 'error',
              text1: 'Please allow location permission.',
            });
            // setTimeout(() => {
            //   requestLocationPermission();
            // }, 2000);
            dispatch(setLocationPermission(false));
          }
          if (error.code == 2) {
            dispatch(setGpsPermission(false));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 1000,
          distanceFilter: 10,
        },
      );
    } catch (error) {
      console.log(`FetchUserLocation error :>> `, error);
    }
  };

  const handleSearch = async (address: string | undefined, current: any) => {
    try {
      if (_isEmpty(address)) {
        console.log(`handleSearch :>> address is empty !`);
        return;
      }

      const response: any = await getCoordsFromAddress(address);
      const coords = {
        latitude: response?.data?.latlong?.[1],
        longitude: response?.data?.latlong?.[0],
      };
      if (current) {
        setMyLocation(coords);
        if (_isNumber(destLocation.latitude)) {
          getDirections(coords, destLocation); //Calling directions api when we have both coords...
        }
      } else {
        setDestLocation(coords);
        if (_isNumber(mylocation.latitude)) {
          getDirections(mylocation, coords); //Calling directions api when we have both coords
        }
      }
    } catch (error: any) {
      console.log(`handleSearch error :>> `, error);
    }
  };

  const getDriverDetails = async () => {
    try {
      const response = await DriverInfo(rideDetails.driverId);
      setDriverDetails(response.data);
    } catch (error) {
      console.log(`getDriverDetails error :>> `, error);
    }
  };

  const getDirections = async (location1: any, location2: any) => {
    try {
      if (!_isNumber(location1.latitude) || !_isNumber(location2.latitude)) {
        return;
      }

      const response: any = await DirectionsApi(location1, location2);
      setDistance({
        text: response?.data?.distance?.text,
        value: response?.data?.distance?.value,
      });
      setDuration({
        text: response?.data?.duration.text,
        value: response?.data?.duration.value,
      });
      const coords = response?.data?.coords;

      setPath(coords);
      if (coords?.length > 2) {
        setDone(true);
      }
      const markerIDs = ['pickup', 'destination'];
      fitToSuppliedMarkers(markerIDs);
    } catch (error: any) {
      console.log(`getDirections error :>> `, error);
    }
  };

  const isInputFieldFilled = () => {
    if (!_isEmpty(myAddress) && !_isEmpty(destAddress)) {
      setNavigationStep(1);
    }
  };

  // Return "true" if the ride is scheduled for later (more than 15-minutes from current-time).
  const checkScheduledRide = (rideDetails: any) => {
    let currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + preBookRideTime);
    if (moment(rideDetails.bookingTime).isAfter(moment(currentDate))) {
      Toast.show({
        type: 'success',
        text1: 'Ride scheduled successsfully!',
      });
      // console.log('bookingTime :>> ', new Date(rideDetails.bookingTime).toString());
      emptyStates();
      return true;
    }
    return false;
  };

  const handleRideStatus = () => {
    try {
      if (_isEmpty(rideDetails)) {
        // console.log('Fetching nearby Driver');
        getNearbyDrivers();
        return;
      }

      switch (rideDetails?.status) {
        case 'pending-accept':
          console.log('case : pending-accept');
          if (rideDetails.bookingTime && checkScheduledRide(rideDetails)) {
            console.log('Returning from pending-accept as ride is scheduled.');
            // setScheduledRideDetails(rideDetails);
            // setIsScheduleRide(true);
            setLoading(false);
            props.navigation.navigate('Scheduled Rides');
            return;
          }
          setNavigationStep(2);
          setCustomSpinner(true);
          timeoutRef.current = setTimeout(() => {
            if (rideDetails?.status === 'pending-accept') {
              setPopup(true);
              // Toast.show({
              //   type: 'error',
              //   text1: 'Driver not found , Please try again',
              // });
              // handleCancelRide();
            }
          }, 20000);
          break;

        case 'pending-arrival':
          setPath(rideDetails?.driverPathToPickUp);
          setCustomSpinner(false);
          setNavigationStep(2);
          setFare(rideDetails.fare);
          setNearbyDrivers([]);
          break;

        case 'pending-otp':
          console.log('case : pending-otp');
          setCustomSpinner(false);
          setNavigationStep(2);
          setFare(rideDetails.fare);
          setNearbyDrivers([]);
          break;

        case 'ride-started':
          setPath(rideDetails?.pickupToDropPath);
          setIsRideStarted(true);
          setNearbyDrivers([]);
          setCustomSpinner(false);
          setNavigationStep(2);
          setFare(rideDetails.fare);
          break;

        case 'pending-payment':
        case 'payment-failed':
          console.log('case : ride-started || pending-paymen');
          setIsRideStarted(true);
          setNearbyDrivers([]);
          setCustomSpinner(false);
          setNavigationStep(2);
          setFare(rideDetails.fare);
          break;

        case 'completed':
          console.log('case : payment-completed || completed');
          emptyStates();
          setLoading(false);
          break;

        case 'cancelled':
          console.log('case : cancelled');
          handleCancelRide();
          break;

        default:
          console.log('case : default');
          break;
      }
    } catch (error) {
      console.log('error in handlestaus', error);
    }
  };

  // const startChatListener = () => {
  //   console.log("chatttttt");
  //   socketInstance.on('chat-message', (body: any) => {
  //     console.log("messages driver ---->",body);
  //     body = JSON.parse(body);
  //     if (body.message == 'New message from driver') {                 //203 : random status
  //       setMessages((previousMessages: any) =>
  //         GiftedChat.append(previousMessages, body.newChatMessage),
  //       );
  //       setUnseenMessagesCount(prevCount => prevCount + 1);
  //       if (isChatComponent) {
  //         handleSeenAllMessges();
  //       }
  //     }
  // });
  // };

  const socketEvents = () => {
    try {
      socketInstance?.on('ride-status', (body: any) => {
        // console.log('ride-status event :>> ', body);
        body = JSON.parse(body);
        console.log('body?.data?.status got event', body);

        if (body?.status == 404) {
          if (!_isEmpty(rideDetails)) {
            emptyStates();
          }
        } else if (
          body?.data?.status == 'pending-accept' &&
          body?.message == 'Please complete existing ride' &&
          body?.data?.status != 'completed'
        ) {
          if (
            _isEmpty(rideDetails) ||
            rideDetails?.status != body.data.status
          ) {
            dispatch(setRideDetails(body.data));
          }
          Toast.show({
            type: 'error',
            text1: 'Your previous request is pending',
          });

          const reversedMessagess = [...body.data.chatMessages].reverse();
          setMessages(reversedMessagess);
          setUnseenMessagesCount(body.data.riderUnreadMessagesCount);
        } else if (body?.data && body.data?.status != 'completed') {
          dispatch(setRideDetails(body.data));
          const reversedMessagess = [...body.data.chatMessages].reverse();
          setMessages(reversedMessagess);
          setUnseenMessagesCount(body.data.riderUnreadMessagesCount);
        } else if (body?.data?.status == 'completed') {
          emptyStates();
          setLoading(false);
        }
        if (body?.status === 200) {
          console.log('body?.message', body?.message);
          Toast.show({
            type: 'success',
            text1: 'Payment Successfull and ride completed !',
          });
          emptyStates();
          setLoading(false);
        }
      });

      socketInstance?.on('live-location', (body: any) => {
        body = JSON.parse(body);
        const driverCoords = {
          latitude: body.coordinates[1],
          longitude: body.coordinates[0],
        };
        setDriverLocation(driverCoords);

        if (body?.data?.driverPathToPickUp) {
          let currentPath = [];
          if (
            body.data.status == 'pending-arrival' ||
            body.data.status == 'pending-otp'
          ) {
            currentPath = body.data.driverPathToPickUp;
          } else {
            currentPath = body.data.pickupToDropPath;
          }

          if (currentPath?.length) {
            const nearestCoord: any = geolib.findNearest(
              driverCoords,
              currentPath,
            );
            let foundNearestCoordFlag = false;
            let newPath = [];

            for (let i = 0; i < currentPath.length; i++) {
              if (
                currentPath[i].latitude == nearestCoord.latitude &&
                currentPath[i].longitude == nearestCoord.longitude
              ) {
                foundNearestCoordFlag = true;
                newPath.push(currentPath[i]);
              } else {
                if (foundNearestCoordFlag) {
                  newPath.push(currentPath[i]);
                } else {
                  continue;
                }
              }
            }
            setPath(newPath);
          }
        }

        const distanceBetweenRiderAndDriver = geolib.getDistance(
          mylocation,
          driverCoords,
        ); // In "meters"
        handleArrivalTime(distanceBetweenRiderAndDriver);
      });

      socketInstance?.on('ride-request-response', (body: any) => {
        // console.log('ride-request-response event :>> ', body);
        body = JSON.parse(body);

        if (body.status == 409) {
          console.log('body.message', body.message);
          emptyStates();
          setCustomSpinner(false);
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: body.message,
          });
          return;
        } else if (rideDetails.status != body?.data?.status) {
          dispatch(setRideDetails(body.data));
        }
      });

      socketInstance?.on('nearby-drivers', (body: any) => {
        body = JSON.parse(body);

        distanceMoreThan80Meters = distanceMoreThan80MetersFromNearbyDrivers(
          body?.data.nearbyDrivers,
        );

        if (
          body?.data?.nearbyDrivers &&
          !compareNearbyDrivers(body?.data.nearbyDrivers)
        ) {
          setNearbyDrivers(body?.data.nearbyDrivers);
          previousNearbyDrivers = body?.data.nearbyDrivers;
        }
      });

      socketInstance?.on('cancel-ride', async (body: any) => {
        body = JSON.parse(body);
        // if (rideDetails.status != body.data.status) {
        dispatch(setRideDetails(body.data));
        // }
      });

      socketInstance.on('chat-message', (body: any) => {
        console.log('messages driver ---->', body);
        body = JSON.parse(body);
        if (body.message == 'New message from driver') {
          //203 : random status
          setMessages((previousMessages: any) =>
            GiftedChat.append(previousMessages, body.newChatMessage),
          );
          setUnseenMessagesCount(prevCount => prevCount + 1);
          if (isChatComponent) {
            handleSeenAllMessges();
          }
        }
      });

      socketInstance.on('change-payment-mode', (body: any) => {
        console.log(`change-payment-mode event :>> `, body?.message);
        body = JSON.parse(body);
        dispatch(setRideDetails(body.data));
        setLoading(false);
      });

      socketInstance.on('error', (body: any) => {
        console.log(`ERROR EVENT :>> `, body);
        body = JSON.parse(body);
        // dispatch(setPaymentCompleted(false));
      });
    } catch (error) {
      console.log(`socket-events catch-error :>> `, error);
    }
  };

  const debounceApi = async () => {
    try {
      const response: any = await getUtils();
      dispatch(setUtils(response?.data));
    } catch (error) {
      console.log('debounce time erorr', error);
    }
  };

  const fitToSuppliedMarkers = (markerIDs: any) => {
    try {
      setTimeout(() => {
        mapRef.current?.fitToSuppliedMarkers(markerIDs, {
          edgePadding: {
            top: hp(20),
            right: hp(20),
            bottom: hp(20),
            left: hp(20),
          },
          animated: true,
        });
      }, 10);
    } catch (error) {
      console.log('fitToSuppliedMarkers error :>> ', error);
    }
  };

  const backAction = () => {
    let flag = false;
    if (isProfileModal) {
      setIsProfileModal(false);
      flag = true;
    }
    return flag;
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await customAxios.delete(`/deleteRider/${userData._id}`);
      if (res) {
        Toast.show({
          type: 'success',
          text1: 'Account Deleted successfully !!',
        });
        handleLogout();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRideStatus();
    if (
      !_isEmpty(rideDetails) &&
      _isEmpty(driverDetails) &&
      rideDetails?.status !== 'pending-accept'
    ) {
      console.log('Driver details are empty');
      getDriverDetails();
    }
    // Cleanup the timeout on component unmount
    return () => {
      clearTimeout(timeoutRef?.current);
    };
  }, [rideDetails]);

  useEffect(() => {
    if (!_isNumber(mylocation.latitude)) {
      setLoading(true);
    } else {
      setLoading(false);
      getAddress(mylocation);
    }

    if (mapRef.current) {
      if (nearbyDrivers.length && !_isNumber(destLocation.latitude)) {
        const markerIDs = nearbyDrivers.map(
          (element: any, idx: any) => `driver_${idx + 1}`,
        );
        markerIDs.push('pickup');
        if (distanceMoreThan80Meters) {
          fitToSuppliedMarkers(markerIDs);
        }
      } else {
        if (mylocation.latitude && destLocation.latitude) {
          const markerIDs = ['pickup', 'destination'];
          fitToSuppliedMarkers(markerIDs);
        }
      }
    }

    if (mapRef1.current) {
      const markerIDs = ['pickupMarker', 'dropMarker', 'driverMarker'];
      setTimeout(() => {
        mapRef1.current?.fitToSuppliedMarkers(markerIDs, {
          edgePadding: {
            top: hp(20),
            right: hp(20),
            bottom: hp(20),
            left: hp(20),
          },
          animated: true,
        });
      }, 10);
    }
  }, [mylocation, destLocation, nearbyDrivers, driverLocation]);

  const fitRideMapToMarkers = useCallback(() => {
    if (mapRef1.current) {
      const markerIDs = ['pickupMarker', 'dropMarker', 'driverMarker'];

      setTimeout(() => {
        mapRef1.current?.fitToSuppliedMarkers(markerIDs, {
          edgePadding: {
            top: hp(20),
            right: hp(20),
            bottom: hp(20),
            left: hp(20),
          },
          animated: true,
        });
      }, 10);
    }
  }, [rideDetails, isRideStarted]);

  useEffect(() => {
    if (!_isEmpty(paymentError)) {
      CancelOrder();
    }
  }, [paymentError]);

  useEffect(() => {
    return () => {
      if (intervalState) {
        clearInterval(intervalState);
      }
    };
  }, [intervalState]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, [isProfileModal]);

  useEffect(() => {
    (async () => {
      try {
        // const res: any = await requestLocationPermission();
        // if (res == 'granted') {

        socketInstance = await getSocketInstance(loginToken);
        FetchUserLocation();
        socketEvents();
        getNearbyDrivers();

        // } else {
        //   Toast.show({
        //     type: 'error',
        //     text1: 'Please allow location permission.',
        //   });
        //   Linking.openSettings();
        // }
        debounceApi();
      } catch (err) {
        console.log('getSocketInstance error :>> ', err);
      }
    })();
    console.log({userData});
  }, []);

  useEffect(() => {
    console.log('myLocation', mylocation);
  }, [mylocation]);

  return (
    <View
      onStartShouldSetResponder={() => {
        //? to hide logout button
        if (isProfileModal) {
          setIsProfileModal(false);
        }
        return false;
      }}
      style={{flex: 1}}>
      <View style={[ExternalStyles.parentView, {justifyContent: 'center'}]}>
        {loading &&
          rideDetails?.status != 'pending-payment' &&
          rideDetails?.status != 'payment-failed' && (
            <View style={styles.loader}>
              <LoaderComponent />
            </View>
          )}
        <View
          style={[
            loading &&
            rideDetails?.status != 'pending-payment' &&
            rideDetails?.status != 'payment-failed'
              ? styles.loadingOpacity
              : styles.loadingOpacityPendingPayment,
            {position: 'relative', flex: 1},
          ]}>
          {isChatComponent && (
            <View style={{alignItems: 'center'}}>
              <ChatComponent
                setIsChatComponent={setIsChatComponent}
                messages={messages}
                handleSendMessage={handleSendMessage}
                setUnseenMessagesCount={setUnseenMessagesCount}
                handleSeenAllMessges={handleSeenAllMessges}
                driverDetails={driverDetails}
              />
            </View>
          )}

          {/* {isProfileModal && (
            <>
              <TouchableOpacity
                style={styles.profileModalView}
                onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileModalView}
                onPress={handleLogout}>
                <Text style={styles.logoutText}>Delete</Text>
              </TouchableOpacity>
            </>
          )} */}

          {isProfileModal && (
            <View style={styles.profileModalView}>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDeleteModal(true);
                  setIsProfileModal(false);
                }}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          {deleteModal && (
            <View style={styles.deleteContainer}>
              <View style={styles.modalContainer}>
                {deleteModal && (
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText1}>
                      Are you sure you want to delete?
                    </Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}>
                        <Text style={styles.buttonText}>Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setDeleteModal(false)}>
                        <Text style={styles.buttonText}>No</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {!customSpinner && (
            <View style={styles.header}>
              <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <SidebarIcon />
                  {navigationStep == 1 && (
                    <Text
                      style={{
                        fontSize: hp(3),
                        fontFamily: 'RobotoMono-Regular',
                        color: 'black',
                        marginLeft: wp(1),
                      }}>
                      Booking Details
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              {/* //? to show logut button */}
              <View style={styles.profileView}>
                <TouchableOpacity
                  hitSlop={{left: wp(5), right: wp(5), top: hp(1)}}
                  onPress={() => setIsProfileModal(!isProfileModal)}>
                  <Text style={styles.profileText}>
                    {userData.name ? userData.name[0].toUpperCase() : 'R'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* {isScheduleRide && (
            <ScheduleRideScreen
              // rideDetails={rideDetails}
              scheduledRideDetails={scheduledRideDetails}
              setIsScheduleRide={setIsScheduleRide}
            />
          )} */}

          {navigationStep == 0 && !deleteModal && (
            <>
              <View style={styles.autoCompleteView1}>
                <View
                  style={[
                    styles.inputView,
                    {
                      backgroundColor: 'transparent',
                      width: wp(80),
                    },
                  ]}>
                  <View style={styles.myAddressInput}>
                    <View style={[styles.iconsView, {left: wp(0.2)}]}>
                      <PickupIcon />
                    </View>

                    <AutocompleteInput
                      key={'AutocompleteInput_1'}
                      onBlur={handleBlur_1}
                      onFocus={handleFocus_1}
                      selection={selection_1}
                      inputContainerStyle={styles.inputContainerStyle}
                      placeholder="Pickup Location"
                      style={styles.autoCompleteStyles}
                      data={pickUpSearchResults ? pickUpSearchResults : []}
                      value={myAddress}
                      onChangeText={text => {
                        setIsProfileModal(false);
                        setMyAddress(text);
                        pickupTextDebouncer(text);
                      }}
                      onSubmitEditing={() => {}}
                      flatListProps={{
                        keyExtractor: (_: any, idx: any) => idx,
                        style: [
                          styles.autoCompleteListStyles,
                          {
                            marginTop: hp(11),
                            display: myAddress ? 'flex' : 'none',
                          },
                        ],
                        renderItem: ({item}: any) => (
                          <Text
                            onPress={() => {
                              setIsProfileModal(false);
                              setMyAddress(
                                item?.description || item?.placeAddress,
                              );
                              handleSearch(
                                item?.description || item?.placeAddress,
                                true,
                              );
                              setpickUpSearchResults([]);
                              Keyboard.dismiss();
                            }}
                            style={styles.autoCompleteText}>
                            {item?.description || item?.placeAddress}
                          </Text>
                        ),
                        keyboardShouldPersistTaps: 'always',
                      }}
                      // listContainerStyle={{zIndex: 1, position: 'absolute'}}
                    />

                    <View style={styles.clearTextView}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsProfileModal(false);
                          setMyAddress('');
                          setPath([]);
                          setDistance({text: '', value: ''});
                          setDuration({text: '', value: ''});
                          setpickUpSearchResults([]);
                        }}>
                        <Text style={styles.clearText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.horixontalLine} />
                <View
                  style={[
                    styles.verticalLine,
                    {
                      zIndex: 13,
                      position: 'absolute',
                      marginLeft: wp(7),
                      marginTop: hp(6.5),
                      borderColor: '#6B7280',
                    },
                  ]}
                />
                {!myAddress && (
                  <View
                    style={{
                      backgroundColor: 'white',
                      width: wp(100),
                      height: hp(40),
                      position: 'absolute',
                      marginTop: hp(60),
                      borderRadius: 20,
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <LocationNotFound width={80} height={100} />
                    <View
                      style={{
                        width: wp(80),
                        marginBottom: hp(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Roboto Mono',
                          fontWeight: '500',
                          fontSize: wp(3.6),
                        }}>
                        Currently unavailable in your area. Stay tuned for
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          fontSize: wp(3.6),
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Roboto Mono',
                            fontWeight: '500',
                          }}>
                          updates on our expansion!
                        </Text>
                        <Internet width={20} height={20} />
                      </View>
                    </View>
                  </View>
                )}

                <View
                  style={[
                    styles.inputView1,
                    styles.destinationAddrView,
                    {backgroundColor: 'transparent'},
                  ]}>
                  <View style={styles.destAddrInput}>
                    <View style={[styles.iconsView, {left: wp(4)}]}>
                      <DropIcon />
                    </View>

                    <AutocompleteInput
                      key={'AutocompleteInput_2'}
                      onBlur={handleBlur_2}
                      onFocus={handleFocus_2}
                      selection={selection_2}
                      inputContainerStyle={styles.inputContainerStyle}
                      placeholder="Enter your destination"
                      style={[
                        styles.autoCompleteStyles,
                        {
                          marginLeft: wp(4),
                        },
                      ]}
                      data={destSearchResults ? destSearchResults : []}
                      value={destAddress}
                      onChangeText={text => {
                        setIsProfileModal(false);
                        setDestAddress(text);
                        destTextDebouncer(text);
                      }}
                      onSubmitEditing={() => {}}
                      flatListProps={{
                        keyExtractor: (_, idx: any) => idx,
                        style: [
                          styles.autoCompleteListStyles,
                          {
                            marginTop: hp(3),
                            display: destAddress ? 'flex' : 'none',
                          },
                        ],
                        renderItem: ({item}: any) => (
                          <Text
                            onPress={() => {
                              setIsProfileModal(false);
                              setDestAddress(
                                item.description || item?.placeAddress,
                              );
                              handleSearch(
                                item.description || item?.placeAddress,
                                false,
                              );
                              setDestSearchResults([]);
                              Keyboard.dismiss();
                            }}
                            style={styles.autoCompleteText}>
                            {item?.description || item?.placeAddress}
                          </Text>
                        ),
                        keyboardShouldPersistTaps: 'always',
                      }}
                    />

                    <View style={[styles.clearTextView, {right: wp(4)}]}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsProfileModal(false);
                          setDestAddress('');
                          setPath([]);
                          setDistance({text: '', value: ''});
                          setDuration({text: '', value: ''});
                          setDestSearchResults([]);
                          setDestLocation({latitude: '', longitude: ''});
                        }}>
                        <Text style={styles.clearText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {_isNumber(mylocation.latitude) && (
                <View style={styles.parentMapViewStyles}>
                  <MapView
                    ref={mapRef}
                    // loadingEnabled={true}
                    showsUserLocation={loading ? false : true}
                    onMapReady={() => {
                      Keyboard.dismiss();
                    }}
                    style={styles.mapStyles}
                    region={{
                      latitude: mylocation.latitude,
                      longitude: mylocation.longitude,
                      latitudeDelta: 0.0122,
                      longitudeDelta: 0.0121,
                    }}
                    //   onRegionChange={(region) => {
                    //     // No need to update mylocation here, just update the marker's coordinate
                    //     setMyLocation(region);
                    // }}
                    onRegionChangeComplete={region => {
                      // Update marker coordinates based on the center of the map region
                      setMyLocation({
                        latitude: region.latitude,
                        longitude: region.longitude,
                      });
                    }}
                    initialRegion={{
                      latitude: mylocation.latitude,
                      longitude: mylocation.longitude,
                      latitudeDelta: 0.0122,
                      longitudeDelta: 0.0121,
                    }}
                  >
                    <Marker
                      identifier="pickup"
                      draggable={true}
                      // pinColor="blue"
                      coordinate={{
                        // latitude: mylocation.latitude,
                          // longitude: mylocation.longitude,
                          // latitudeDelta: 0.0622,
                          // longitudeDelta: 0.0121,

                          latitude: path[0]?.latitude
                            ? path[0]?.latitude
                            : mylocation.latitude,
                          longitude: path[0]?.longitude
                            ? path[0].longitude
                            : mylocation.longitude,
                      }}
                      onDragEnd={e => {
                        console.log('first', e.nativeEvent);
                        setMyLocation(e.nativeEvent.coordinate);
                        // setMarkerDragging(false);
                      }}
                      image={require('../components/common/location.png')}
                      >
                      {path.length > 0 && <PickupMarker />}
                    </Marker>

                    {_isNumber(destLocation.latitude) && destAddress && (
                      <>
                        <Marker
                          identifier="destination"
                          coordinate={{
                            // latitude: destLocation.latitude,
                            // longitude: destLocation.longitude,
                            latitude: path[-1]?.latitude
                              ? path[-1]?.latitude
                              : destLocation.latitude,
                            longitude: path[-1]?.latitude
                              ? path[-1]?.latitude
                              : destLocation.longitude,
                            latitudeDelta: 0.0622,
                            longitudeDelta: 0.0121,
                          }}
                          // pinColor="black"
                        >
                          <DropMarker />
                        </Marker>

                        {path.length > 0 && (
                          <Polyline
                            coordinates={path}
                            strokeColor={themeColor}
                            strokeWidth={4}
                          />
                        )}
                      </>
                    )}

                    {nearbyDrivers.length > 0 &&
                      nearbyDrivers.map((driver: any, idx: any) => {
                        return (
                          <Marker
                            key={`driver_${idx + 1}`}
                            identifier={`driver_${idx + 1}`}
                            // identifier='driver'
                            coordinate={driver}
                            pinColor="yellow">
                            <Car />
                          </Marker>
                        );
                      })}
                  </MapView>
                </View>
              )}

              {done && myAddress && destAddress && path.length > 0 && (
                <View style={styles.doneCardView}>
                  <Text style={styles.rideInfoText}>
                    Distance: {distance.text} and approx. duration:{' '}
                    {duration.text}{' '}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      handleFare();
                    }}
                    style={[styles.bookButtonView]}>
                    <Text
                      style={[styles.buttonText, {fontWeight: '800', flex: 1}]}>
                      Book Now
                    </Text>
                    <View style={{alignSelf: 'center'}}>
                      <ArrowRight />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {navigationStep == 1 && (
            <BookingScreen
              myAddress={myAddress}
              platform={Platform.OS}
              destAddress={destAddress}
              distance={distance}
              duration={duration}
              mylocation={mylocation}
              destLocation={destLocation}
              setNavigationStep={setNavigationStep}
              path={path}
              fare={fare}
              durationText={duration.text}
              distanceText={distance.text}
              setCustomSpinner={setCustomSpinner}
              setLoading={setLoading}
              // emptyStates={emptyStates}
              // setNearbyDrivers={setNearbyDrivers}
            />
          )}

          {navigationStep == 2 && (
            <>
              {customSpinner ? (
                <>
                  <View style={styles.spinnerMainView}>
                    <View style={styles.spinnerMyAddressView}>
                      <PickupIcon />

                      <Text style={styles.spinnerAddressText}>
                        {rideDetails?.pickUpAddress
                          ? rideDetails?.pickUpAddress
                          : myAddress}
                      </Text>
                    </View>

                    <View style={styles.commonDiplayStyles}>
                      <View
                        style={[
                          styles.verticalLine,
                          {
                            marginLeft: wp(6),
                            borderColor: '#6B7280',
                          },
                        ]}
                      />

                      <View style={styles.horizontal} />
                    </View>

                    <View style={styles.spinnerDropIconView}>
                      <DropIcon />
                      <Text style={styles.spinnerAddressText}>
                        {rideDetails?.dropAddress
                          ? rideDetails?.dropAddress
                          : destAddress}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.boldText}>
                    We're finding a driver for You
                  </Text>
                  <Text style={styles.holdOntext}>
                    Kindly hold on for a second
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleCancelRide();
                    }}
                    style={styles.cancelButton}>
                    <Text
                      style={{
                        fontFamily: 'Roboto Mono',
                        fontWeight: '800',
                        color: '#EB5757',
                      }}>
                      Cancel ride
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      marginTop: hp(10),
                    }}>
                    {popup ? (
                      <View>
                        <View
                          style={{
                            padding: 20,
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            elevation: 2, // for Android shadow
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Roboto Mono',
                              marginBottom: 20,
                              fontSize: 16,
                              textAlign: 'center',
                            }}>
                            Driver not found. Please try again.
                          </Text>
                          <Button title="OK" onPress={handleCancelRide} />
                        </View>
                      </View>
                    ) : (
                      <>
                        <Spinner
                          isVisible={true}
                          type="Pulse"
                          color="#9999cc"
                          style={styles.ParentSpinner}
                          // size={wp(80)}
                          size={wp(40)}
                        />
                        <Spinner
                          isVisible={true}
                          type="Pulse"
                          color={themeColor}
                          // size={wp(60)}
                          size={wp(20)}
                          style={styles.ChildSpinner}
                        />
                      </>
                    )}
                  </View>
                </>
              ) : (
                <>
                  {!_isEmpty(rideDetails) && !isChatComponent && (
                    <>
                      <View
                        style={[
                          styles.autoCompleteView1,
                          {
                            height: hp(13),
                            borderRadius: wp(5),
                            top: hp(7.5),
                          },
                        ]}>
                        <View
                          style={[
                            styles.inputView,
                            {
                              marginTop: hp(1),
                              backgroundColor: 'transparent',
                              width: wp(80),
                            },
                          ]}>
                          <View
                            style={[
                              styles.dropIconView,
                              {
                                backgroundColor: 'transparent',
                                alignItems: 'center',
                              },
                            ]}>
                            <PickupIcon />

                            <ScrollView horizontal={true}>
                              <TextInput
                                multiline={false}
                                editable={false}
                                scrollEnabled={true}
                                style={{
                                  fontFamily: 'Roboto Mono',
                                  color: '#000000',
                                }}>
                                {rideDetails?.pickUpAddress}
                              </TextInput>
                            </ScrollView>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.inputView1,
                            {backgroundColor: 'transparent', width: wp(80)},
                          ]}>
                          <View
                            style={[
                              styles.dropIconView,
                              {
                                marginTop: hp(-5),
                              },
                            ]}>
                            <DropIcon />

                            <ScrollView horizontal={true}>
                              <TextInput
                                multiline={false}
                                editable={false}
                                scrollEnabled={true}
                                style={{
                                  fontFamily: 'Roboto Mono',
                                  color: '#000000',
                                }}>
                                {rideDetails?.dropAddress}
                              </TextInput>
                            </ScrollView>
                          </View>
                        </View>
                      </View>

                      <View style={styles.parentMapViewStyles}>
                        <MapView
                          ref={mapRef1}
                          // loadingEnabled={true}
                          showsUserLocation={loading ? false : true}
                          onMapReady={() => fitRideMapToMarkers()}
                          style={styles.mapStyles}
                          initialRegion={{
                            latitude: rideDetails.pickUpLocation[0],
                            longitude: rideDetails.pickUpLocation[1],
                            latitudeDelta: 0.0122,
                            longitudeDelta: 0.0121,
                          }}>
                          {_isNumber(rideDetails.pickUpLocation[0]) &&
                            !isRideStarted && (
                              <Marker
                                // pinColor="red"
                                identifier="pickupMarker"
                                coordinate={{
                                  latitude: rideDetails.pickUpLocation[0],
                                  longitude: rideDetails.pickUpLocation[1],
                                  // latitudeDelta: 0.0622,
                                  // longitudeDelta: 0.0121,
                                }}
                              />
                            )}

                          {_isNumber(rideDetails.dropLocation[0]) &&
                            isRideStarted && (
                              <>
                                <Marker
                                  // pinColor="blue"
                                  identifier="dropMarker"
                                  coordinate={{
                                    latitude: rideDetails.dropLocation[0],
                                    longitude: rideDetails.dropLocation[1],
                                    // latitudeDelta: 0.01,
                                    // longitudeDelta: 0.01,
                                  }}>
                                  <DropMarker />
                                </Marker>
                              </>
                            )}

                          {!_isNull(driverLocation?.latitude) && (
                            <Marker
                              // pinColor="green"
                              identifier="driverMarker"
                              coordinate={{
                                latitude: driverLocation.latitude,
                                longitude: driverLocation.longitude,
                                // latitudeDelta: 0.0622,
                                // longitudeDelta: 0.0121,
                              }}>
                              <Car />
                            </Marker>
                          )}

                          {path.length > 0 && (
                            <Polyline
                              coordinates={path}
                              strokeColor={'#000'}
                              strokeWidth={4}
                            />
                          )}
                        </MapView>
                      </View>

                      {(rideDetails?.status == 'pending-payment' ||
                        rideDetails?.status == 'payment-failed') && (
                        <View style={styles.paymentCard}>
                          <Text
                            style={[
                              styles.paymentText,
                              {
                                fontSize: wp(6),
                              },
                            ]}>
                            {rideDetails.paymentMode}
                          </Text>

                          <Text style={styles.subPaymentText}>
                            Please make your payment
                          </Text>

                          <View style={styles.amountView}>
                            <Text style={styles.ruppeeSymbol}>
                              {/* {'\u20B9'} */}₹
                            </Text>
                            <Text style={styles.amountText}>{fare}</Text>
                          </View>

                          <TouchableOpacity
                            disabled={loading}
                            onPress={() =>
                              rideDetails.paymentMode == 'Online'
                                ? handlePayOnline()
                                : handlePayCash()
                            }
                            style={styles.paymentButton}>
                            {loading && (
                              <ActivityIndicator size="small" color="#fff" />
                            )}
                            <Text style={styles.buttonText}>
                              {rideDetails.paymentMode == 'Online'
                                ? 'Pay Now'
                                : 'Done'}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={handleChangePaymentMode}
                            style={styles.commonDiplayStyles}>
                            <Text style={styles.changePayText}>
                              Change payment mode to{' '}
                              <Text
                                style={{
                                  color: themeColor,
                                  fontWeight: '600',
                                }}>
                                {rideDetails.paymentMode == 'Cash'
                                  ? 'Online'
                                  : 'Cash'}
                              </Text>
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* {paymentCompleted && (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#ffffff',
                            height: hp(8),
                            width: wp(80),
                            top: hp(35),
                            position: 'absolute',
                            borderRadius: wp(3),
                          }}>
                          <Text style={{color: '#000000'}}>
                            Please wait while we confirm your payment....
                          </Text>
                        </View>
                      )} */}

                      {rideDetails?.status == 'pending-arrival' &&
                        driverArrivalTime && (
                          <View style={styles.infoCard1}>
                            <Text style={styles.arriveTimeText}>
                              Driver is arriving in {driverArrivalTime}
                            </Text>
                          </View>
                        )}

                      {rideDetails?.status == 'pending-otp' && (
                        <View style={styles.infoCard1}>
                          <Text style={styles.arriveTimeText}>
                            Driver arrived. Please share your OTP.
                          </Text>
                        </View>
                      )}

                      {/* {nearbyDrivers.length == 0 && (
                          <View
                            style={[
                              styles.infoCard1,
                              {gap: wp(2), justifyContent: 'center'},
                            ]}>
                            <ActivityIndicator size="small" color="white" />
                            <Text
                              style={{
                                color: '#ffffff',
                                fontWeight: '700',
                                textAlign: 'center',
                              }}>
                              Searching nearby drivers
                            </Text>
                          </View>
                        )} */}

                      {!isChatComponent && (
                        <View
                          style={[
                            styles.infoCard,
                            {
                              borderTopLeftRadius: 50,
                              borderTopRightRadius: 50,
                              backgroundColor: '#F2F3F7',
                            },
                          ]}>
                          <View style={styles.infoCardHeader}>
                            <View style={styles.commonDiplayStyles}>
                              <View>
                                <DefaultProfile />
                              </View>
                              <View style={{marginLeft: wp(2)}}>
                                {/* <Text style={styles.heading}>
                                    OTP: {rideDetails.otp}
                                  </Text> */}
                                <Text style={styles.heading}>
                                  {driverDetails.firstName}{' '}
                                  {driverDetails.lastName}
                                </Text>
                                <View style={styles.carDetailView}>
                                  <View style={{marginRight: hp(1)}}>
                                    <SmallCarIcon />
                                  </View>
                                  <Text
                                    style={[
                                      styles.text,
                                      {fontSize: hp(1.8), width: wp(40)},
                                    ]}>
                                    {' '}
                                    Car : {driverDetails.vehicleName}
                                  </Text>
                                </View>
                                <View style={styles.ratingsView}>
                                  <View style={{marginRight: hp(1)}}>
                                    <RatingStarIcon />
                                  </View>
                                  <Text
                                    style={[styles.text, {fontSize: hp(1.8)}]}>
                                    4.9 ( 490 reviews)
                                  </Text>
                                </View>
                              </View>
                            </View>

                            <View style={styles.infoCardOtpView}>
                              <Text style={styles.rideOtpText}>
                                {/* Estimated Fare: Rs {fare} */}
                                Ride OTP
                              </Text>
                              <Text
                                style={[
                                  styles.customText,
                                  {
                                    fontSize: hp(2.2),
                                  },
                                ]}>
                                {rideDetails.otp}
                              </Text>
                              {/* <CallIcon /> */}
                            </View>
                          </View>

                          <View
                            style={[
                              styles.infoCardHeader,
                              {
                                alignItems: 'center',
                                marginTop: hp(2),
                              },
                            ]}>
                            <View>
                              <Text style={{fontSize: hp(2), color: '#000000'}}>
                                Amount
                              </Text>
                              <Text
                                style={[
                                  styles.customText,
                                  {
                                    fontSize: hp(2),
                                  },
                                ]}>
                                ₹ {fare}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.paymentText,
                                {
                                  fontSize: hp(2),
                                },
                              ]}>
                              {driverDetails.vehicleNumber}
                            </Text>
                          </View>

                          <View style={styles.infoCardBottom}>
                            {((rideDetails?.status &&
                              rideDetails?.status == 'pending-arrival') ||
                              rideDetails?.status == 'pending-accept' ||
                              rideDetails?.status == 'pending-otp') && (
                              // ! hide after ride started or after pickup
                              <TouchableOpacity
                                onPress={() => {
                                  handleCancelRide();
                                }}>
                                <CancelIcon />
                                {/* <Text style={styles.textButton}>Cancel</Text> */}
                              </TouchableOpacity>
                            )}

                            <TouchableOpacity
                              onPress={() => {
                                setIsProfileModal(false);
                                handleSeenAllMessges();
                                setUnseenMessagesCount(0);
                                setIsChatComponent(true);
                              }}>
                              {unseenMessagesCount > 0 && (
                                <Badge
                                  status="error"
                                  // status="success"
                                  value={`${unseenMessagesCount}`}
                                  containerStyle={{
                                    position: 'absolute',
                                    right: wp(0),
                                    zIndex: 11,
                                  }}
                                />
                              )}
                              <ChatIcon />
                              {/* <Text style={styles.textButton}>Chat</Text> */}
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                Linking.openURL(
                                  `tel:${driverDetails?.mobileNumber}`,
                                )
                              }>
                              <CallIcon />
                              {/* <Text style={styles.textButton}>Call</Text> */}
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  deleteButton: {
    backgroundColor: '#FF5050',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },

  deleteText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: 'red',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },

  buttonText: {
    fontFamily: 'RobotoMono-Regular',
    color: '#fff',
    fontSize: 16,
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },

  modalText1: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteContainer: {
    display: 'flex',
    width: wp(100),
    height: hp(100),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  deleteModal: {
    backgroundColor: 'white',
    width: wp(60),
    height: hp(20),
    zIndex: 10,
    top: hp(0),
    left: wp(0),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ParentSpinner: {
    alignSelf: 'center',
    position: 'relative',
  },
  ChildSpinner: {
    alignSelf: 'center',
    position: 'absolute',
    marginTop: hp(5),
  },
  textButton: {
    color: '#000000',
    fontWeight: '900',
  },
  cancelButtonDelete: {
    fontFamily: 'Roboto Mono',
    padding: wp(3),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp(3),
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderColor: '#EB5757',
    borderWidth: 1,
    borderRadius: wp(4),
    width: wp(90),
  },
  buttonTextDelete: {
    fontFamily: 'Roboto Mono',
    color: '#ffffff',
    textAlign: 'center',
  },
  bookButtonView: {
    padding: wp(3),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp(3),
    position: 'absolute',
    width: wp(80),
    borderRadius: wp(2),
    backgroundColor: themeColor,
    display: 'flex',
    flexDirection: 'row',
  },
  inputView: {
    width: wp(80),
    alignSelf: 'center',
    height: hp(7),
    marginTop: hp(2),
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  inputView1: {
    alignSelf: 'center',
    height: hp(7),
    marginTop: hp(12),
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  inputView1ToRemove: {
    width: wp(80),
    alignSelf: 'center',
    height: hp(7),
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  infoCard: {
    width: wp(100),
    // height: hp(23),
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    margin: wp(5),
    display: 'flex',
    flexDirection: 'column',
    padding: wp(5),
    borderRadius: wp(2),
    position: 'absolute',
    bottom: hp(-3),
  },
  infoCard1: {
    width: wp(80),
    // height: hp(23),
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    // margin: wp(5),
    display: 'flex',
    flexDirection: 'row',
    padding: wp(3),
    borderRadius: wp(20),
    position: 'absolute',
    bottom: hp(28),
    justifyContent: 'center',
  },
  text: {fontFamily: 'Roboto Mono', color: 'grey', fontSize: hp(2)},
  heading: {
    fontFamily: 'Roboto Mono',
    fontWeight: '800',
    color: '#000000',
    fontSize: hp(2.5),
  },
  profileModalView: {
    backgroundColor: 'white',
    borderRadius: wp(2),
    padding: wp(2),
    shadowColor: '#000000',
    shadowOffset: {
      width: wp(0),
      height: hp(2),
    },
    shadowOpacity: wp(0.25),
    shadowRadius: wp(4),
    elevation: hp(5),
    gap: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(30),
    position: 'absolute',
    top: hp(6),
    right: wp(2),
    zIndex: 120,
  },
  loadingOpacity: {
    opacity: 0.5,
  },
  loadingOpacityPendingPayment: {
    opacity: 1,
  },
  logoutText: {
    fontFamily: 'Roboto Mono',
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(2),
    width: wp(100),
  },
  profileView: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(50),
    backgroundColor: 'navy',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoCompleteView1: {
    backgroundColor: '#ffffff',
    zIndex: 110,
    height: hp(16),
    width: wp(88),
    position: 'absolute',
    alignSelf: 'center',
    // borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    // marginTop: hp(1),
    top: hp(7),
    borderRadius: wp(5),
  },
  profileText: {fontFamily: 'Roboto Mono', color: '#ffffff', fontSize: wp(5)},
  horixontalLine: {
    backgroundColor: '#E5E7EB',
    height: 1,
    width: wp(60),
    marginTop: hp(8),
    alignSelf: 'center',
  },
  verticalLine: {
    height: hp(4.4),
    width: wp(0.5),
    alignSelf: 'flex-start',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
  },
  myAddressInput: {
    backgroundColor: 'transparent',
    // flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    // top: hp(7),
    zIndex: 11,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
  iconsView: {
    position: 'absolute',
    top: hp(1),
  },
  inputContainerStyle: {
    width: '80%',
    borderWidth: 0,
    alignSelf: 'center',
    // backgroundColor: 'transparent',
  },
  autoCompleteStyles: {
    height: hp(5),
    fontWeight: '600',
    color: '#464E5F',
    maxWidth: wp(65),
    minWidth: wp(65),
    backgroundColor: 'transparent',
  },
  autoCompleteText: {
    fontFamily: 'Roboto Mono',
    color: '#000000',
    margin: wp(2),
  },
  clearTextView: {
    position: 'absolute',
    right: wp(1),
    top: hp(1),
  },
  clearText: {
    fontFamily: 'Roboto Mono',
    color: '#000000',
    fontWeight: '700',
    fontSize: hp(2),
  },
  destinationAddrView: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    width: wp(88),
    marginTop: hp(9),
    borderBottomStartRadius: wp(5),
    borderBottomEndRadius: wp(5),
  },
  destAddrInput: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 11,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    // marginTop: hp(4),
    // flex: 1,
    // top: hp(7),
    // justifyContent: 'space-between',
    // width:wp(88),
  },
  autoCompleteListStyles: {
    width: wp(80),
    alignSelf: 'center',
    borderRadius: 20,
  },
  doneCardView: {
    height: hp(17),
    width: wp(100),
    alignSelf: 'center',
    position: 'absolute',
    backgroundColor: '#ffffff',
    zIndex: 110,
    bottom: 0,
    // borderRadius: wp(5),
    paddingLeft: wp(5),
    paddingRight: wp(5),
  },
  rideInfoText: {
    fontFamily: 'Roboto Mono',
    color: '#000000',
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: hp(2),
    fontSize: hp(2),
    marginBottom: hp(2),
  },
  spinnerMainView: {
    backgroundColor: '#ffffff',
    width: wp(88),
    borderRadius: 20,
    marginTop: hp(6),
    paddingTop: hp(2),
    paddingBottom: hp(2),
  },
  spinnerMyAddressView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(3),
    paddingRight: 8,
    maxWidth: wp(80),
  },
  spinnerAddressText: {
    fontFamily: 'Roboto Mono',
    color: '#000000',
    marginLeft: wp(2),
    fontWeight: '500',
  },
  horizontal: {
    backgroundColor: '#E5E7EB',
    height: 1,
    width: wp(60),
    marginLeft: wp(6),
    alignSelf: 'center',
  },
  spinnerDropIconView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: hp(1.5),
    paddingLeft: 10,
    paddingRight: wp(3),
    maxWidth: wp(80),
  },
  boldText: {
    fontFamily: 'Roboto Mono',
    marginTop: hp(10),
    fontSize: hp(2.5),
    fontWeight: '600',
    textAlign: 'center',
    color: '#212121',
  },
  holdOntext: {
    fontFamily: 'Roboto Mono',
    marginTop: hp(1),
    fontSize: hp(2),
    fontWeight: '500',
    textAlign: 'center',
    color: '#464E5F',
  },
  dropIconView: {
    left: 0,
    right: 0,
    top: 0,
    zIndex: 11,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
  paymentCard: {
    marginTop: hp(30),
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: wp(5),
    paddingBottom: wp(5),
    paddingTop: wp(8),
    alignItems: 'center',
    elevation: hp(10),
    rowGap: hp(2),
    width: wp(90),
    position: 'absolute',
  },
  paymentText: {
    fontFamily: 'Roboto Mono',
    color: '#212121',
    fontWeight: '600',
  },
  subPaymentText: {
    color: '#464E5F',
    // fontWeight: '900',
    fontSize: wp(4.5),
    marginTop: -15,
  },
  amountView: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 4,
    marginTop: 4,
  },
  amountText: {
    color: '#212121',
    fontSize: wp(7),
    fontWeight: '700',
  },
  ruppeeSymbol: {
    color: '#000000',
    fontSize: wp(7),
    marginRight: 8,
  },
  changePayText: {
    color: '#464E5F',
    textAlign: 'center',
    marginTop: -5,
    fontSize: wp(3.9),
  },
  arriveTimeText: {color: '#464E5F', fontWeight: '700'},
  infoCardHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commonDiplayStyles: {display: 'flex', flexDirection: 'row'},
  carDetailView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingsView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardOtpView: {
    marginLeft: Platform.OS == 'android' ? wp(6) : wp(6),
    marginTop: hp(0),
    borderColor: '#464E5F',
    borderWidth: 0.5,
    borderRadius: 2,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideOtpText: {
    color: '#A0A0A0',
    fontWeight: '500',
    fontSize: hp(2),
  },
  customText: {
    fontFamily: 'Roboto Mono',
    color: '#212121',
    fontWeight: '500',
  },
  paymentButton: {
    backgroundColor: themeColor,
    padding: 10,
    borderRadius: 5,
    width: wp(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(10),
  },
  loader: {position: 'absolute', top: hp(50), left: wp(50)},
  parentMapViewStyles: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
  mapStyles: {
    width: wp(100),
    height: hp(100),
    position: 'relative',
  },
  });
export default MapScreen;
