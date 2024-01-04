import React from 'react';
import {ErrorToast, SuccessToast} from 'react-native-toast-message';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SuccessToastIcon from '../svg/SuccessToastIcon';
import ErrorToastIcon from '../svg/ErrorToastIcon';
import RemoveToastIcon from '../svg/RemoveToastIcon';

/*
  1. Create the config
*/
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: any) => (
    <SuccessToast
      {...props}
      style={{
        borderLeftColor: '#fff',
        borderBottomColor: 'green',
        borderBottomWidth: wp(1),
        elevation: hp(1),
        alignItems: 'center',
        width: wp(90),
        paddingRight: wp(2),
      }}
      // activeOpacity={0.9}
      text1NumberOfLines={100}
      text1Style={{
        fontSize: wp(4.5),
        fontWeight: '500',
      }}
      renderLeadingIcon={SuccessToastIcon}
      // renderTrailingIcon={RemoveToastIcon}
    />
  ),

  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#fff',
        borderBottomColor: 'red',
        borderBottomWidth: wp(1),
        elevation: hp(1),
        alignItems: 'center',
        width: wp(90),
        paddingRight: wp(2),
      }}
      // activeOpacity={0.9}
      text1NumberOfLines={100}
      text1Style={{
        fontSize: wp(4.5),
        fontWeight: '500',
      }}
      renderLeadingIcon={ErrorToastIcon}
      // renderTrailingIcon={RemoveToastIcon}
    />
  ),
};

export default toastConfig;
