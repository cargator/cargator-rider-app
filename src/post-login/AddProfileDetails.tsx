import React, { useRef, useState } from 'react';
import {
  ActivityIndicator, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles as ExternalStyles, themeColor } from '../styles/styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { addProfileDetails } from '../services/userservices';

const AddProfilDetails = () => {
  const scrollViewRef = useRef<any>();
  const refTextInput: any = React.useRef(null);
  const [isSendOtpClicked, setIsSendOtpClicked] = useState(false);
  const userId = useSelector((store:any)=>store.userData._id)
  const dispatch = useDispatch()
  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('FirstName is Required')
      .matches(/^(?![\s-])[\w\s-]+$/, 'Invalid Name'),
    lastName: Yup.string()
      .required('LastName is Required')
      .matches(/^(?![\s-])[\w\s-]+$/, 'Invalid Name'),
  });

  const handleProfileDetails = async (values: any) => {
    try {
      setIsSendOtpClicked(true);
      const response: any = await addProfileDetails(userId,values)
      setIsSendOtpClicked(false);
      dispatch(setUserData(response.data))
    } catch (err:any) {
      console.log('err', err.response.data);
      Toast.show({
        type: 'error',
        text1: err.response.data.message,
      });
      setIsSendOtpClicked(false);
    }
  };
  return (
    <KeyboardAwareScrollView
      // automaticallyAdjustKeyboardInsets={true}
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current.scrollToEnd({animated: true})
      }
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{flexGrow: 1}}>
      <View
        style={styles.cardView}>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
          }}
          onSubmit={(values: any) => handleProfileDetails(values)}
          validationSchema={ProfileSchema}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <TextInput
                ref={refTextInput}
                keyboardType="default"
                placeholder="Enter your First Name"
                style={styles.nameInput}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
              />
              {errors.firstName && touched.firstName && (
                <Text style={{color: 'red'}}>
                  {errors?.firstName.toString()}
                </Text>
              )}

              <TextInput
                ref={refTextInput}
                keyboardType="default"
                placeholder="Enter your Last Name"
                style={styles.nameInput}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
              />
              {errors.lastName && touched.lastName && (
                <Text style={{color: 'red'}}>
                  {errors?.lastName.toString()}
                </Text>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit(values)}
                  disabled={isSendOtpClicked}>
                  {isSendOtpClicked && (
                    <ActivityIndicator size="small" color="#fff" />
                  )}
                  <Text style={ExternalStyles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  nameInput: {
    color: '#747688',
    width: wp(75),
    borderRadius: wp(3),
    padding: wp(2),
    backgroundColor: 'white',
    fontSize: wp(4.5),
    height: hp(5),
    marginTop:hp(4)
  },
  buttonContainer: {justifyContent: 'center', marginTop: hp(3)},
  button: {
    width: wp(40),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColor,
    borderRadius: wp(3),
    flexDirection: 'row',
    gap: wp(2),
    alignSelf:'center'
  },
  cardView:{
    borderRadius: wp(10),
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderTopStartRadius: wp(10),
    borderTopEndRadius: wp(10),
    width: wp(100),
    height: hp(35),
    marginTop: hp(20),
  }
});
export default AddProfilDetails;
