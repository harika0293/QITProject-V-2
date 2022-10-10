import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Layout,
  Text,
  Input,
  Button,
  Icon,
  IndexPath,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {login} from '../reducers';
import {db, auth} from '../../firebase';
import {connect, useSelector} from 'react-redux';
import {logout} from '../reducers';
import firebase from 'firebase/compat/app';
import {PageLoader} from './PageLoader';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {sendEmailVerification} from 'firebase/auth';
const OTPScreen = () => {
  const data = ['None', 'Male', 'Female', 'Nonbinary', 'Unknown'];
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = React.useState(false);
  const [gender, setGender] = useState('');
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [toggleSecureEntry, setoggleSecureEntry] = useState(true);
  const displayValue = data[selectedIndex.row];
  const CalendarIcon = props => <Icon {...props} name="calendar" />;
  const [date, setDate] = useState(new Date(Date.now()));
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };
  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const AlertIcon = props => <Icon {...props} name="alert" />;
  useEffect(() => {
    setGender(displayValue);
  }, [displayValue]);
  const renderOption = title => <SelectItem title={title} />;
  const renderIcon = props => (
    <TouchableWithoutFeedback
      onPress={() => setoggleSecureEntry(!toggleSecureEntry)}>
      <Icon {...props} name={toggleSecureEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );
  const renderCaption = () => {
    return (
      <Text style={styles.captionContainer}>
        {AlertIcon(styles.captionIcon)}
        <Text style={styles.captionText}>
          Should contain at least 8 symbols
        </Text>
      </Text>
    );
  };

  const checkFullNameValidity = value => {
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (isContainsNumber.test(value)) {
      return 'Full Name must not contain Digits.';
    }
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (isContainsSymbol.test(value)) {
      return 'Full Name must not contain Special Symbol.';
    }
    const isValidLength = /^.{3,17}$/;
    if (!isValidLength.test(value)) {
      return 'Full Name must be 3-17 Characters Long.';
    }
    return null;
  };
  const checkPhoneNoValidity = value => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return 'Phone Number must not contain Whitespaces.';
    }
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (isContainsUppercase.test(value)) {
      return 'Phone Number must not contain Uppercase Character.';
    }
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (isContainsLowercase.test(value)) {
      return 'Phone Number must not contain Lowercase Character.';
    }
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (isContainsSymbol.test(value)) {
      return 'Phone Number must not contain Special Symbol.';
    }
    const isValidLength = /^.{10}$/;
    if (!isValidLength.test(value)) {
      return 'Phone Number must be 10 Digits.'; //doubt 10 characters long
    }

    return null;
  };
  const checkPasswordValidity = value => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return 'Password must not contain Whitespaces.';
    }
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      return 'Password must have at least one Uppercase Character.';
    }
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
      return 'Password must have at least one Lowercase Character.';
    }
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
      return 'Password must contain at least one Digit.';
    }
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(value)) {
      return 'Password must contain at least one Special Symbol.';
    }
    const isValidLength = /^.{6,16}$/;
    if (!isValidLength.test(value)) {
      return 'Password must be 6-16 Characters Long.';
    }
    return null;
  };

  const onRegister = () => {
    if (
      fullname === '' ||
      phone === '' ||
      email === '' ||
      password === '' ||
      gender === '' ||
      date === ''
    ) {
      Alert.alert('Please fill all the fields');
    } else {
      const checkFullName = checkFullNameValidity(fullname);
      const checkPhoneNumber = checkPhoneNoValidity(phone);
      const checkPassword = checkPasswordValidity(password);

      if (!checkFullName) {
        if (!checkPhoneNumber) {
          if (!checkPassword) {
            setLoading(true);
            firebase
              .auth()
              .createUserWithEmailAndPassword(email.trim(), password)
              .then(response => {
                const data = {
                  email: email.trim(),
                  fullname: fullname,
                  phone: phone,
                  role: 'patient',
                  dob: moment(date).format('MM/DD/YYYY'),
                  gender: gender,
                  appIdentifier: 'rn-android-universal-listings',
                };
                const user_uid = response.user.uid;
                db.collection('usersCollections').doc(user_uid).set(data);
                db.collection('usersCollections')
                  .doc(user_uid)
                  .get()
                  .then(function (user) {
                    AsyncStorage.setItem('@loggedInUserID:id', user_uid);
                    AsyncStorage.setItem('@loggedInUserID:email', email);
                    AsyncStorage.setItem('@loggedInUserID:password', password);
                    AsyncStorage.setItem(
                      '@loggedInUserID:role',
                      user.data().role,
                    );
                    AsyncStorage.setItem('@loggedInUserID:onboarded', 'true');
                    var userdetails = {...user.data(), id: user_uid};
                    dispatch(login(userdetails));
                    sendEmailVerification(auth.currentUser); ////Send Email
                    navigation.navigate('SelectDoctor');
                  })
                  .catch(function (error) {
                    setLoading(false);
                    const {code, message} = error;
                    Alert.alert('Enter Proper Data. Please contact support.');
                    //Alert.alert(message);
                  });
              })
              .catch(error => {
                setLoading(false);
                const {code, message} = error;
                switch (code) {
                  case 'auth/email-already-in-use':
                    Alert.alert('Email already in use');
                    break;
                  case 'auth/invalid-email':
                    Alert.alert('Invalid email');
                    break;
                  case 'auth/weak-password':
                    Alert.alert('Weak password');
                    break;
                  default:
                    Alert.alert(message);
                }
              });
          } else {
            alert(checkPassword);
          }
        } else {
          alert(checkPhoneNumber);
        }
      } else {
        alert(checkFullName);
      }
    }
  };
  return loading ? (
    <PageLoader />
  ) : (
    <SafeAreaView>
      <ScrollView width="100%" showsVerticalScrollIndicator={false}>
        <Layout style={styles.MainContainer}>
          <Layout style={styles.MainHeader}>
            <Image
              style={styles.image}
              source={require('../../assets/VigilanceAI_logo.png')}
              resizeMode="contain"
            />
            <Text style={styles.heading}>
              Create your <Text style={styles.Account}>ACCOUNT</Text>
            </Text>
            <Text style={styles.paragraph}>
              With our innovative technology,we're making the world safer for
              elderly people
            </Text>
            <Layout style={styles.signin}>
              <Text style={styles.Already}>Already Have An Account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.SigninOne}> Sign in</Text>
              </TouchableOpacity>
            </Layout>

            <Layout style={styles.Layout}>
              <Text style={styles.inputHeading}>Enter your Full Name</Text>
              <Input
                placeholder="Full Name"
                value={fullname}
                onChangeText={nextValue => setFullname(nextValue)}
                size="large"
                maxLength={17}
                style={styles.input}
              />
              <Text style={styles.inputHeading}>Enter your Phone Number</Text>
              <Input
                placeholder="Phone Number"
                value={phone}
                onChangeText={nextValue => setPhone(nextValue)}
                size="large"
                style={styles.input}
              />
              <Text style={styles.inputHeading}>Enter your Email Address</Text>
              <Input
                placeholder="Email Address"
                value={email}
                onChangeText={nextValue => setEmail(nextValue)}
                size="large"
                autoCapitalize="none"
                style={styles.input}
              />
              <Text style={styles.DOB}>Date of Birth</Text>
              <Layout style={styles.calendar}>
                <TouchableOpacity
                  style={styles.CalendarTwo}
                  onPress={() => showDatepicker()}
                  date={date}
                  onSelect={nextDate => setDate(nextDate)}>
                  <Text style={styles.CalendarThree}>
                    {' '}
                    {moment(date).format('DD-MM-YYYY')}
                  </Text>
                  <Icon
                    style={styles.CalendarFour}
                    fill="#0075A9"
                    name="calendar"
                  />
                </TouchableOpacity>
              </Layout>
              <Text style={styles.Gender}>Select your Gender</Text>
              <Select
                style={styles.input}
                placeholder="Default"
                value={displayValue}
                onSelect={index => setSelectedIndex(index)}>
                {data.map(renderOption)}
              </Select>
              <Text style={styles.inputHeading}>Enter your Password</Text>
              <Input
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={nextValue => setPassword(nextValue)}
                size="large"
                caption={'Should contain at least 6 Characters'}
                accessoryRight={renderIcon}
                secureTextEntry={toggleSecureEntry}
              />
              <Button
                onPress={() => onRegister()}
                style={styles.button}
                size="giant">
                Sign Up
              </Button>
            </Layout>
          </Layout>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};
export default OTPScreen;
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
  },
  Account: {
    fontFamily: 'Recoleta-Bold',
    color: '#0075A9',
    fontSize: 22,
  },
  Layout: {
    width: '100%',
  },
  inputHeading: {
    fontFamily: 'Recoleta-Medium',
    marginTop: 8,
    marginBottom: -10,
    color: '#0075A9',
    paddingLeft: 15,
  },
  DOB: {
    fontFamily: 'Recoleta-Medium',
    marginTop: 10,
    color: '#0075A9',
    paddingLeft: 15,
  },
  CalendarTwo: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CalendarThree: {
    fontSize: 15,
    paddingLeft: 10,
  },
  CalendarFour: {
    height: 25,
    width: 25,
    right: 15,
  },
  Gender: {
    fontFamily: 'Recoleta-Medium',
    marginTop: 20,
    marginBottom: -10,
    color: '#0075A9',
    paddingLeft: 15,
  },
  Already: {
    fontSize: 15,
    color: '#818181',
    fontFamily: 'Recoleta-Medium',
  },
  image: {
    height: 130,
    width: 100,
    aspectRatio: 1,
    marginTop: 30,
  },
  SigninOne: {
    fontSize: 17,
    color: '#0075A9',
    fontFamily: 'Recoleta-Medium',
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
    width: '100%',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0075A9',
    borderColor: 'transparent',
    marginBottom: 50,
  },
  btnSecondary: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '95%',
  },
  btnImage: {
    width: 25,
    height: 25,
    marginLeft: 15,
  },
  signin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 20,
  },
  calendar: {
    padding: 4,
    top: 10,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 3,
    backgroundColor: '#F7F9FC',
  },
});
