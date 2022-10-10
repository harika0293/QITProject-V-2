import {StyleSheet, Image, Alert, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {db, auth} from '../../firebase';
import firebase from 'firebase/compat/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {login} from '../reducers';
import Loader from './Loader';
const SplashScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    tryToLoginFirst();
  }, []);
  async function tryToLoginFirst() {
    const email = await AsyncStorage.getItem('@loggedInUserID:email');
    const password = await AsyncStorage.getItem('@loggedInUserID:password');
    const id = await AsyncStorage.getItem('@loggedInUserID:id');
    const role = await AsyncStorage.getItem('@loggedInUserID:role');
    const profile = await AsyncStorage.getItem('@loggedInUserID:profile');
    const onboarded = await AsyncStorage.getItem('@loggedInUserID:onboarded');
    if (
      id != null &&
      id.length > 0 &&
      password != null &&
      password.length > 0
    ) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          db.collection('usersCollections')
            .doc(id)
            .get()
            .then(function (doc) {
              //  console.log(doc.data());
              var userDict = {
                id: id,
                email: email,
                profileURL: doc.photoURL,
                fullname: doc.data().fullname,
                role: role,
                profile: doc.data().profile,
                dob: doc.data().dob,
                phone: doc.data().phone,
                designation: doc.data().designation,
                gender: doc.data().gender,
                newMessages: doc.data().newMessages,
                doctor: doc.data().myDoctor,
              };
              if (doc.exists) {
                dispatch(login(userDict));
                if (role == 'patient') navigation.navigate('BottomNavigator');
                else if (role == 'doctor')
                  navigation.navigate('DoctorBottomTab');
              } else {
                //console.log('No such user');
                setIsLoading(false);
              }
            })
            .catch(function (error) {
              setIsLoading(false);
              const {code, message} = error;
              Alert.alert(message);
            });
        })
        .catch(error => {
          const {code, message} = error;
          setIsLoading(false);
          Alert.alert(message);
        });
      return;
    }
    const googleToken = await AsyncStorage.getItem(
      '@loggedInUserID:googleCredentialAccessToken',
    );
    if (
      id != null &&
      id.length > 0 &&
      googleToken != null &&
      googleToken.length > 0
    ) {
      const credential =
        firebase.auth.GoogleAuthProvider.credential(googleToken);
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(result => {
          var user = result.user;

          db.collection('usersCollections')
            .doc(user.uid)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                var userDict = {
                  id: user.uid,
                  email: doc.data().email,
                  photoURL: doc.data().photoURL,
                  fullname: doc.data().fullname,
                  role: doc.data().role,
                  dob: doc.data().dob,
                  phone: doc.data().phone,
                  gender: doc.data().gender,
                  newMessages: doc.data().newMessages,
                  doctor: doc.data().myDoctor,
                };
                AsyncStorage.setItem('@loggedInUserID:id', user.uid);
                AsyncStorage.setItem('@loggedInUserID:email', doc.data().email);
                AsyncStorage.setItem('@loggedInUserID:role', doc.data().role);
                AsyncStorage.setItem('@loggedInUserID:onboarded', 'true');
              } else {
                var userDict = {
                  id: user.uid,
                  fullname: user.displayName,
                  email: user.email,
                  role: role,
                  photoURL: user.photoURL,
                  profile: profile,
                };
              }
              dispatch(login(userDict));
              if (role == 'patient') navigation.navigate('BottomNavigator');
              else if (role == 'doctor') navigation.navigate('DoctorBottomTab');
            })
            .catch(function (error) {
              // console.log(error);
            });
        })
        .catch(error => {
          // console.log(error);
          setIsLoading(false);
          if (onboarded == 'true') {
            if (role == 'patient') {
              navigation.navigate('AuthStack', {screen: 'Login'});
            } else if (role == 'doctor') {
              navigation.navigate('AuthStack', {screen: 'DLogin'});
            }
          } else {
            navigation.navigate('AuthStack', {screen: 'OnBoarding'});
          }
        });
      return;
    }
    setIsLoading(false);
    if (onboarded == 'true') {
      if (role == 'patient') {
        navigation.navigate('AuthStack', {screen: 'Login'});
      } else if (role == 'doctor') {
        navigation.navigate('AuthStack', {screen: 'DLogin'});
      }
    } else {
      navigation.navigate('AuthStack', {screen: 'OnBoarding'});
    }
  }
  return isLoading ? (
    <Loader />
  ) : (
    <SafeAreaView>
      <Layout style={styles.MainContainer}>
        <Image
          style={styles.Logo}
          source={require('../../assets/VigilanceAI_logo.png')}
          resizeMode="contain"
        />
        <Layout style={styles.MainHeader}>
          <Text style={styles.Text}>ALERT</Text>
          <Layout style={styles.Circle}></Layout>
          <Text style={styles.Text}>ACT</Text>
          <Layout style={styles.Circle}></Layout>
          <Text style={styles.Text}>PREVENT</Text>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};
export default SplashScreen;
const styles = StyleSheet.create({
  MainContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: 8,
  },
  Logo: {
    height: 200,
    width: 200,
    aspectRatio: 1,
    marginTop: 230,
  },
  MainHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
  },
  Text: {
    color: '#0075A9',
    fontSize: 18,
    fontFamily: 'Recoleta-Bold',
    textAlign: 'center',
  },
  Circle: {
    marginTop: 10,
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: 'grey',
    marginLeft: 5,
    marginRight: 5,
  },
});
