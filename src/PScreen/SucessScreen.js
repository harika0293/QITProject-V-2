import {StyleSheet, Image, SafeAreaView, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Layout, Text, Button} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {db, auth} from '../../firebase';
import {useDispatch} from 'react-redux';
import {login} from '../reducers';
import {logout} from '../reducers';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {connect, useSelector} from 'react-redux';

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
const SucessScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth);
  const signout = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(logout());
        auth.onAuthStateChanged(_user => {
          if (!_user) {
            navigation.navigate('AuthStack', {screen: 'Login'});
          }
        });
      })
      .catch(error => {
        console.log(error);
        Alert.alert(error);
        //Alert.alert(error);
      });
  };
  const handleEmailVerification = () => {
    signout();
    Alert.alert('Please Verify your Email. Check in your Inbox or Spam');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView>
      <Layout style={styles.MainContainer}>
        <Layout style={styles.MainHeader}>
          <Image
            style={styles.Logo}
            source={require('../../assets/VigilanceAI_logo.png')}
            resizeMode="contain"
          />
          <Image
            style={styles.SuccessGif}
            source={require('../../assets/95029-success.gif')}
            resizeMode="contain"
          />
          <Layout style={styles.Success}>
            <Text style={styles.SuccessTwo}>Success !!!</Text>
            <Text style={styles.SuccessThree}>
              Your Account has been Created
            </Text>
          </Layout>
          <Button
            onPress={() => handleEmailVerification()}
            style={styles.Button}
            size="giant">
            Continue
          </Button>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};
export default SucessScreen;
const styles = StyleSheet.create({
  MainContainer: {
    height: '100%',
    paddingHorizontal: 30,
  },
  MainHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Logo: {
    height: 150,
    width: 150,
    marginTop: 50,
  },
  SuccessGif: {
    width: 150,
    height: 150,
    aspectRatio: 1,
    marginTop: 100,
  },
  Success: {
    marginTop: 50,
  },
  SuccessTwo: {
    textAlign: 'center',
    fontSize: 30,
    color: '#10C741',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  SuccessThree: {
    paddingTop: 10,
    color: '#818181',
    fontSize: 18,
    fontFamily: 'GTWalsheimPro-Regular',
  },
  Button: {
    marginTop: 30,
    backgroundColor: '#0075A9',
    width: 300,
    borderColor: 'transparent',
  },
});
