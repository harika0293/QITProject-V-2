import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useCallback, useEffect, useLayoutEffect} from 'react';
import {auth, db} from '../../firebase';
import {connect, useSelector} from 'react-redux';
import {Layout, Icon} from '@ui-kitten/components';
import {GiftedChat} from 'react-native-gifted-chat';
import {PageLoader} from './PageLoader';
const PatientChat = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const auth = useSelector(state => state.auth);
  const [loading, setLoading] = React.useState(true);
  const [doctor, setDoctor] = React.useState('');
  const [user, setUser] = useState({
    uid: auth?.user?.id,
    displayName: auth?.user?.fullname,
    photoURL: auth.user.image
      ? auth.user.image
      : 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg',
    email: auth.user.email,
  });
  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('usersCollections')
      .doc(user.uid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot =>
        setMessages(
          snapshot.docs.map(doc => ({
            _id: doc.data()._id,
            text: doc.data().text,
            createdAt: doc.data().createdAt.toDate(),
            user: doc.data().user,
          })),
        ),
      );
    setLoading(false);
    return unsubscribe;
  }, []);
  useLayoutEffect(() => {
    db.collection('usersCollections')
      .doc(auth?.user?.doctor)
      .get()
      .then(doc => {
        if (doc.exists) {
          setDoctor(doc.data().fullname);
        }
      })
      .catch(error => {
        // console.log(error);
      });
  }, []);
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, text, createdAt, user} = messages[0];

    db.collection('usersCollections').doc(user._id).collection('messages').add({
      _id,
      text,
      createdAt,
      user,
    });
  }, []);
  return loading ? (
    <PageLoader />
  ) : (
    <View style={{flex: 1}}>
      <Layout>
        <Layout style={styles.mainHead}>
          <Layout style={styles.headTop}>
            <Icon
              name="arrow-back"
              fill="#0075A9"
              style={styles.icon}
              onPress={() => navigation.navigate('PSetting')}
            />
            <Text style={styles.pText}>Your Doctor {doctor}</Text>
          </Layout>
        </Layout>
      </Layout>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={messages => onSend(messages)}
        textInputStyle={{color: '#000'}}
        user={{
          _id: user?.uid,
          name: user?.displayName,
          avatar: user?.photoURL,
        }}
      />
    </View>
  );
};
export default PatientChat;
const styles = StyleSheet.create({
  mainHead: {
    marginHorizontal: 30,
  },
  icon: {
    height: 25,
    width: 25,
  },
  headTop: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 17,
  },
  pText: {
    fontSize: 17,
    fontFamily: 'Recoleta-Bold',
    left: 10,
    paddingBottom: 15,
  },
});
