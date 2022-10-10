import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Layout, Text, Input, Button, Icon} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {db, auth} from '../../firebase';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {login} from '../reducers';
import {PageLoader} from '../PScreen/PageLoader';
import {ScrollView} from 'react-native-gesture-handler';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {sendPasswordResetEmail} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBEaodLg-dWm-Hp_izwzhCn_ndP0WKZa7A',
  authDomain: 'vigilanceai.firebaseapp.com',
  projectId: 'vigilanceai',
  storageBucket: 'vigilanceai.appspot.com',
  messagingSenderId: '745944856196',
  appId: '1:745944856196:web:68d5d90a2307f4ed2634d1',
};
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const DForgotPwd = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '745944856196-j93km6d0o582pa875fl5s0m1vv3m72ev.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const forgotPassword = email => {
    sendPasswordResetEmail(auth, email, null)
      .then(() => {
        navigation.navigate('DLogin');
        Alert.alert(
          'Reset Password Link sent to your Email Check your Inbox or your Spam',
        );
        setEmail({value: ''});
      })
      .catch(function (e) {
        Alert.alert('User not Found Please Check your Email');
      });
  };

  return loading ? (
    <PageLoader />
  ) : (
    <SafeAreaView>
      <ScrollView width="100%" showsVerticalScrollIndicator={false}>
        <Layout style={styles.MainContainer}>
          <Layout style={styles.MainHeader}>
            <Icon
              style={styles.Arrow}
              fill="#0075A9"
              name="arrow-back"
              onPress={() => navigation.navigate('DLogin')}
            />
            <Image
              style={styles.image}
              source={require('../../assets/VigilanceAI_logo.png')}
              resizeMode="contain"
            />
            <Text style={styles.heading}>
              Forgot Your <Text style={styles.Vigilance}>Password</Text>
            </Text>
            <Text style={styles.paragraph}>
              Please Enter your Email address to Reset your Password. Link will
              be sent to your Registered Mail Id.
            </Text>
            <Text style={styles.inputHeading}>Enter your Email Address</Text>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={nextValue => setEmail(nextValue)}
              size="large"
              autoCapitalize="none"
              style={styles.input}
            />
            <Button
              onPress={() => forgotPassword(email)}
              style={styles.button}
              size="giant">
              Send Link to Email
            </Button>
          </Layout>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};
export default DForgotPwd;
const styles = StyleSheet.create({
  MainContainer: {
    height: '100%',
  },
  MainHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 60,
  },
  Arrow: {
    width: 30,
    height: 30,
    left: -150,
  },
  Vigilance: {
    fontFamily: 'Recoleta-Bold',
    color: '#0075A9',
    fontSize: 22,
  },
  inputHeading: {
    fontFamily: 'Recoleta-Medium',
    marginTop: 30,
    marginBottom: -3,
    color: '#0075A9',
    left: -70,
  },
  image: {
    height: 130,
    width: 100,
    aspectRatio: 1,
    marginTop: 5,
  },
  heading: {
    marginTop: 20,
    fontSize: 22,
    fontFamily: 'Recoleta-Bold',
  },
  paragraph: {
    fontSize: 16,
    marginTop: 20,
    color: '#C1C1C1',
    fontFamily: 'GTWalsheimPro-Regular',
    justifyContent: 'center',
    textAlign: 'center',
  },
  input: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0075A9',
    width: 330,
    borderColor: 'transparent',
  },
});
