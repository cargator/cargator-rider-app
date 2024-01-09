import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
  ImageBackground,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { setLoginToken, setUserData } from './../redux/redux';
import Toast from 'react-native-toast-message';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import RightArrow from '../components/svg/RightArrow';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles as ExternalStyles, themeColor } from '../styles/styles';
import { login, verifyOtp } from '../services/userservices';

const LoginOtpScreen = ({route}: any) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<any>();
  const [OTP, setOTP] = useState('');
  const [user, setUser] = useState<any>();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpEnterted, setIsOtpEnterted] = useState(false);

  const handleContinueBtn = async () => {
    if (!isOtpVerified) {
      Toast.show({
        type: 'error',
        text1: 'Please enter OTP.',
      });
      return;
    }
    console.log(`handleContinueBtn called :>> `, user);
  };

  const sendOTP = async (otp: any) => {
    try {
      setIsOtpEnterted(true);
      Keyboard.dismiss();

      // API Call to verify Login-OTP.
      const data = {
        otp,
        type: 'rider',
        mobileNumber: route.params.mobileNumber,
      }
      const res: any = await verifyOtp(data)

      if (res.status=200) {
        console.log('OTP verified.');
        Toast.show({
          type: 'success',
          text1: 'OTP verified !!',
        });
        setIsOtpVerified(true);
        setOTP(otp);
        setUser(res.user);
        dispatch(setUserData(res.user));
        // dispatch(setUserId(res.user._id));
        dispatch(setLoginToken(res.token));
        setTimeout(() => {
          setIsOtpEnterted(false);
        }, 1000);
      }
    } catch (error: any) {
      console.log(`sendOTP >> error :>> `, error);
      setOTP('');
      Toast.show({
        type: 'error',
        // text1: error.message,
        text1: error.response.data.error,
      });
      setIsOtpEnterted(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setOTP('');
      const loginData = {
        mobileNumber: route.params.mobileNumber,
        type: 'rider',
      }
      // API Call to again request OTP for Login (same as in LoginScreen). // ! Do we need another API to re-generate OTP ?
      const res: any = await login(loginData)

      Toast.show({
        type: 'success',
        text1: 'New OTP Sent !',
      });
    } catch (error: any) {
      console.log(`handleResendOTP error :>> `, error);
      Toast.show({
        type: 'error',
        // text1: error.message,
        text1: error.response.data.error,
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      // scrollEnabled={true}
      automaticallyAdjustKeyboardInsets={true}
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current.scrollToEnd({animated: true})
      }
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{flexGrow: 1}}>
      <ImageBackground
        style={{
          // height: Platform.OS == 'android' ? hp(100) : hp(90),
          height: Platform.OS == 'android' ? hp(99) : hp(90),
          width: wp(100),
          flex: 1,
        }}
        source={require('../components/common/svgviewer-png-output.png')}>
        {/* <View style={ExternalStyles.parentView}> */}
        <View style={ExternalStyles.preLoginCard}>
          <View>
            <Text style={styles.greyText}>Enter the 6 digit code sent to</Text>
            <Text style={styles.text}>
              {/* {route.params.formattedMobileNumber} */}
              +91 {route.params.mobileNumber}
            </Text>

            <View style={styles.otpView}>
              <OTPInputView
                style={styles.otpInputStyle}
                pinCount={6}
                code={OTP} // You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged={code => {
                  setOTP(code);
                }}
                autoFocusOnLoad={false}
                selectionColor="black"
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                keyboardType="number-pad"
                editable={true}
                onCodeFilled={code => {
                  sendOTP(code); // API Call to Verify-OTP.
                }}
              />
            </View>

            <TouchableOpacity style={styles.otpView} onPress={handleResendOTP}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>

            <View style={styles.otpView}>
              <TouchableOpacity
                style={[
                  styles.button,
                  // {backgroundColor: isOtpVerified ? '#EC5800' : 'red'},
                ]}
                // disabled={!isOtpVerified}
                disabled={isOtpEnterted}
                onPress={() => handleContinueBtn()}>
                {isOtpEnterted && (
                  <ActivityIndicator size="small" color="#fff" />
                )}

                <Text style={ExternalStyles.buttonText}>Continue</Text>

                <View style={styles.arrow}>
                  <RightArrow />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* </View> */}
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  ViewtextInput: {
    width: wp(90),
    backgroundColor: 'white',
    borderRadius: wp(3),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: wp(2),
  },
  button: {
    width: wp(90),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColor,
    borderRadius: wp(3),
    marginTop: hp(2),
    flexDirection: 'row',
    gap: wp(2),
  },
  underlineStyleBase: {
    width: wp(6),
    height: hp(7),
    borderWidth: wp(0),
    borderBottomWidth: wp(1),
    color: 'black',
    fontSize: wp(6),
    borderColor: themeColor,
    fontWeight: '600',
  },
  underlineStyleHighLighted: {
    borderColor: 'white',
  },
  greyText: {
    fontFamily:'Roboto Mono',
    color: '#747688',
    fontSize: wp(5),
    marginTop: hp(4),
    alignSelf: 'flex-start',
    fontWeight: '400',
  },
  text: {
    color: '#000000',
    fontSize: wp(5),
    alignSelf: 'flex-start',
    fontWeight: '400',
  },
  otpView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInputStyle: {width: wp(50), height: hp(8.5)},
  resendText: {color: '#747688', fontSize: hp(2.2)},
  arrow: {position: 'absolute', right: wp(7)},
});

export default LoginOtpScreen;
