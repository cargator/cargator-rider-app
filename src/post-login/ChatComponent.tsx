import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {Avatar} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import BackArrow2 from '../components/svg/BackArrow2';
import {themeColor} from '../styles/styles';

const ChatComponent = ({
  setIsChatComponent,
  messages,
  handleSendMessage,
  setUnseenMessagesCount,
  handleSeenAllMessges,
  driverDetails
}: any) => {
  const userId = useSelector((store: any) => store.userData._id);

  const handleGoBack = () => {
    handleSeenAllMessges();
    setUnseenMessagesCount(0);
    setIsChatComponent(false);
  };

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        textStyle={{left: {color: 'black'}}}
        wrapperStyle={{
          left: {backgroundColor: 'white'},
          right: {backgroundColor: themeColor},
        }}
      />
    );
  };

  useEffect(() => {
    handleSeenAllMessges();
  }, [messages]);

  useEffect(() => {
    const backAction = () => {
      handleGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      handleSeenAllMessges();
      backHandler.remove();
    };
  }, []);

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerRight} onPress={handleGoBack}>
          {/* <Text style={{fontSize: wp(4), fontWeight: '900'}}>Go Back</Text> */}
          <BackArrow2 />
        </TouchableOpacity>

        <View style={styles.headerLeft}>
          <Text style={{fontSize: wp(5), fontWeight: '900', color: 'black'}}>
            {driverDetails.firstName} {driverDetails.lastName}
          </Text>
          <Avatar
            rounded
            icon={{name: 'user', type: 'font-awesome'}}
            source={{
              //   uri: auth?.currentUser?.photoURL,
              uri: 'https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-placeholder-black-png-image_3918427.jpg',
            }}
          />
        </View>
      </View>

      <View style={styles.chatView}>
        <GiftedChat
          messages={messages}
          onSend={messages => handleSendMessage(messages)}
          renderBubble={renderBubble}
          showAvatarForEveryMessage={true}
          scrollToBottom={true}
          timeTextStyle={{
            left: {
              color: 'black',
            },
          }}
          maxInputLength={100}
          isTyping={true}
          user={{
            _id: userId,
            name: 'Rider Name',
            avatar:
              'https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-placeholder-black-png-image_3918427.jpg',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingLeft: wp(1),
    paddingRight: wp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: hp(0.1),
    height: hp(7),
    backgroundColor: '#E5E4E2',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginLeft: wp(2),
  },
  headerRight: {
    marginRight: wp(2),
  },
  chatView: {flex: 1, width: wp(100)},
});

export default ChatComponent;
