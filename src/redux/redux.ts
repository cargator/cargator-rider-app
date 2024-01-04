import {configureStore, createSlice} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userData: {},
    infoVisible: false,
    myApiKey: 'AIzaSyD5uT-lkmYmOXp58LmMi5939ZFstUDpC0k',
    rideDetails: {},
    loginToken: '',
    orderDetails: {},
    liveLocation: {},
    messages: [],
    unseenMessagesCount: 0,
    utils: {},
    paymentCompleted: false, // To show payment is processing if we didmt get callback form razorpay
    locationPermission: false,
    gpsPermission: false,
  },
  // initialState: initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    removeUserData: state => {
      state.userData = {};
      state.infoVisible = false;
      state.rideDetails = {};
      state.loginToken = '';
      state.myApiKey='',
      state.orderDetails = {};
      state.liveLocation = {};
      state.messages = [];
      state.unseenMessagesCount = 0;
      state.utils ={};
      state.paymentCompleted = false;
    },
    setInfoVisible: (state, action) => {
      state.infoVisible = action.payload;
    },
    setRideDetails: (state, action) => {
      state.rideDetails = action.payload;
    },
    removeRideDetails: state => {
      state.rideDetails = {};
    },
    setLoginToken: (state, action) => {
      state.loginToken = action.payload;
    },
    setOrderId: (state, action) => {
      state.orderDetails = action.payload;
    },
    removeOrderId: state => {
      state.orderDetails = {};
    },
    setRiderLocation: (state, action) => {
      state.liveLocation = action.payload;
    },
    setMessagesInRedux: (state, action) => {
      state.messages = action.payload;
    },
    setUnseenMessagesCountInRedux: (state, action) => {
      state.unseenMessagesCount = action.payload;
    },
    setUtils: (state, action) => {
      state.utils = action.payload;
    },
    setPaymentCompleted: (state, action) => {
      state.paymentCompleted = action.payload;
    },
    setLocationPermission: (state, action) => {
      state.locationPermission = action.payload;
    },
    setGpsPermission: (state, action) => {
      state.gpsPermission = action.payload;
    },
  },
});

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

export const {
  setUserData,
  removeUserData,
  setInfoVisible,
  setRideDetails,
  removeRideDetails,
  setLoginToken,
  setOrderId,
  removeOrderId,
  setRiderLocation,
  setMessagesInRedux,
  setUnseenMessagesCountInRedux,
  setUtils,
  setPaymentCompleted,
  setLocationPermission,
  setGpsPermission,
} = authSlice.actions;

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
export const persistor = persistStore(store);
