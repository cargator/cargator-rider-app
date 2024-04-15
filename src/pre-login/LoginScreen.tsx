import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Keyboard,
  ImageBackground,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import PhoneIcon from '../components/svg/PhoneIcon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles as ExternalStyles, themeColor } from '../styles/styles';
import { getcountryCodeAPI, login } from '../services/userservices';

const initialCountryCode = '+91'; // Default country code/
const countryCodeList: any = []; // List of country codes

const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<any>();
  const [isSendOtpClicked, setIsSendOtpClicked] = useState(false);
  const [isTextInputSelected, setIsTextInputSelected] = useState(false);
  const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(initialCountryCode);
  const refTextInput: any = React.useRef(null);


  const handlePhoneAndCodeView = () => {
    if (isTextInputSelected) {
      refTextInput.current?.blur();
    } else {
      refTextInput.current?.focus();
    }
    setIsTextInputSelected(!isTextInputSelected);
    setShowCountryCodeDropdown(false);
  };


  const toggleCountryCodeDropdown = () => {
    setShowCountryCodeDropdown(!showCountryCodeDropdown);
  };

  const handleCountryCodeSelection = (code: any) => {
    setSelectedCountryCode(code);
    toggleCountryCodeDropdown();
  };


  const getCountryCode = async () => {
    try {
      const res = await getcountryCodeAPI();
      for (let i = 0; i < res.data.length; i++) {
        countryCodeList.push(res.data[i].countryCode);
      }
      } catch (error: any) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: error.response.data.error,
        });
      }
    }


  useEffect(() => {
      getCountryCode()
    }, [])



    const loginSchema = Yup.object().shape({
      mobileNumber: Yup.string()
        // .matches(/^\d{10,15}$/, 'Invalid mobile number. Only 10-15 digits allowed.')
        .matches(/^[0-9]+$/, 'Invalid mobile number.')
        .min(10, 'Mobile Number must be 10 digits only.')
        .max(10, 'Mobile Number must be 10 digits only.')
        .required('Mobile number is Required'),
    });

    const handleSendOtp = async (formValues: any) => {
      try {
        setIsSendOtpClicked(true);
        Keyboard.dismiss();
        const loginData = {
          mobileNumber: formValues.mobileNumber,
          // mobileNumber: formattedMobileNumber,
          type: 'rider',
        }
        const res: any = await login(loginData);

        navigation.navigate('LoginOtpScreen', {
          mobileNumber: formValues.mobileNumber,
        });
        setTimeout(() => {
          setIsSendOtpClicked(false);
        }, 1000);
      } catch (error: any) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: error.response.data.error,
        });
        setIsSendOtpClicked(false);
      }
    };

    return (
      <KeyboardAwareScrollView
        // scrollEnabled={false}
        automaticallyAdjustKeyboardInsets={true}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          style={{
            // height: Platform.OS == 'android' ? hp(100) : null,
            height: Platform.OS == 'android' ? hp(99) : hp(90),
            width: wp(100),
            flex: 1,
          }}
          source={require('../components/common/svgviewer-png-output.png')}>
          <View style={ExternalStyles.preLoginCard}>
            <Formik
              initialValues={{
                mobileNumber: '',
              }}
              onSubmit={(values: any) => handleSendOtp(values)}
              validationSchema={loginSchema}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-around',
                    marginVertical: hp(4.5),
                  }}>
                  <View>
                    <Text style={styles.text}>Enter your mobile number</Text>
                    <Text style={[styles.textContinue, { alignSelf: 'flex-start' }]}>
                      to continue
                    </Text>
                  </View>
                  <View style={styles.countryCodeView}>
                    <TouchableOpacity
                      onPress={toggleCountryCodeDropdown}>
                      {/* <PhoneIcon /> */}
                      <Text style={styles.mobileInputCountryCode}>
                        {selectedCountryCode}
                      </Text>
                      <Text style={{ position: 'absolute', right: -17, bottom: -1, color: 'grey', fontSize: 22 }}>▼</Text>
                    </TouchableOpacity>
                  </View>
                  {showCountryCodeDropdown && (
                    <View style={styles.countryCodeDropdown}>
                      {countryCodeList.map((code: any, index: any) => (
                        <TouchableOpacity key={index} onPress={() => handleCountryCodeSelection(code)}>
                          <Text style={code === selectedCountryCode ? { fontWeight: 'bold' } : {}}>{code}</Text>
                        </TouchableOpacity>
                      ))}

                    </View>
                  )}

                  <View style={styles.textInputView}>
                    {/* <View
                    style={styles.phoneIconView}
                    onTouchStart={handlePhoneAndCodeView}>
                    <PhoneIcon />
                    <Text style={styles.code}>{countryCode}</Text>
                  </View> */}

                    {errors.mobileNumber && touched.mobileNumber && (
                      <Text style={styles.errorText}>
                        {errors.mobileNumber.toString()}
                      </Text>
                    )}
                    <TextInput
                      ref={refTextInput}
                      keyboardType="numeric"
                      // placeholder="Enter your mobile number"
                      style={styles.mobileInput}
                      onChangeText={handleChange('mobileNumber')}
                      onBlur={handleBlur('mobileNumber')}
                      value={values.mobileNumber}
                      maxLength={10}
                      onTouchStart={handlePhoneAndCodeView}
                    />
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        handleSubmit();
                      }}
                      disabled={isSendOtpClicked}>
                      {isSendOtpClicked && (
                        <ActivityIndicator size="small" color="#fff" />
                      )}
                      <Text style={ExternalStyles.buttonText}>Send OTP</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    );
  };

  const styles = StyleSheet.create({
    mobileInput: {
      fontFamily: 'RobotoMono-Regular',
      color: '#747688',
      width: wp(90),
      borderRadius: wp(3),
      padding: wp(2),
      backgroundColor: 'white',
      fontSize: wp(4.5),
      paddingLeft: wp(5),
      flex: 1,
      borderColor: 'grey',
      borderWidth: 1,
    },
    button: {
      width: wp(90),
      height: hp(6),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColor,
      borderRadius: wp(3),
      flexDirection: 'row',
      gap: wp(2),
    },
    text: {
      fontFamily: 'RobotoMono-Regular',
      color: '#000000',
      fontSize: wp(5),
      fontWeight: '600',
    },
    textContinue: {
      fontFamily: 'RobotoMono-Regular',
      color: '#747688',
      fontSize: wp(5),
      fontWeight: '600',
    },
    textInputView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: hp(1),
      width: wp(67),
      marginLeft: wp(20),
    },
    // phoneIconView: {
    //   zIndex: 1,
    //   flexDirection: 'row',
    //   position: 'absolute',
    //   left: wp(2),
    //   alignItems: 'center',
    // },
    // code: {
    //   fontFamily: 'RobotoMono-Regular',
    //   fontSize: wp(4.5),
    //   marginLeft: wp(0.5),
    //   color: '#747688',
    // },
    errorText: {
      fontFamily: 'RobotoMono-Regular',
      fontSize: hp(2),
      color: 'red',
      position: 'absolute',
      top: hp(-2.5),
    },
    buttonContainer: { justifyContent: 'center', marginTop: hp(3) },
    countryCodeDropdown: {
      position: 'absolute',
      bottom: hp(17),
      width: wp(13),
      left: wp(4),
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'white',
      padding: 10,
      borderRadius: 5,
      textColor: "grey"
    },
    countryCodeView: {
      height: hp(5.5),
      width: wp(15),
      zIndex: 1,
      paddingTop: hp(0.3),
      flexDirection: 'row',
      position: 'absolute',
      left: wp(3),
      top: hp(9.5),
      alignItems: 'center',
      borderWidth: 1,
      // borderRadius: 3,
      // backgroundColor: 'F2F3F7',
      borderColor: 'grey',
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
    },
    mobileInputCountryCode: {
      color: 'black',
      fontSize: wp(5),
      marginLeft: wp(1),
    },
  });

  export default LoginScreen;
