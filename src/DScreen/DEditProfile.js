import {
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {PageLoader} from '../PScreen/PageLoader';
import {useNavigation} from '@react-navigation/native';
import {db} from '../../firebase';
import {
  Layout,
  Text,
  Icon,
  Divider,
  Input,
  Button,
  IndexPath,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import {ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';
import {connect, useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {login} from '../reducers';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
const CalendarIcon = props => <Icon {...props} name="calendar" />;
const data = ['None', 'Male', 'Female', 'Nonbinary', 'Unknown'];
const DEditProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth);
  const user = authUser.user;
  const [fullname, setFullname] = useState(user.fullname);
  const [designation, setDesignation] = useState(user.designation);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const [gender, setGender] = useState(user.gender);
  const [loading, setLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const displayValue = data[selectedIndex.row];
  useEffect(() => {
    setGender(displayValue);
  }, [displayValue]);
  const [date, setDate] = useState(new Date(Date.now())); //current date code
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
  const checkDesignationValidity = value => {
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (isContainsNumber.test(value)) {
      return 'Designation must not contain Digits.';
    }
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (isContainsSymbol.test(value)) {
      return 'Designation must not contain Special Symbol.';
    }
    const isValidLength = /^.{2,20}$/;
    if (!isValidLength.test(value)) {
      return 'Designation must be 2-20 Characters Long.';
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
  const handleUpdate = () => {
    const checkFullName = checkFullNameValidity(fullname);
    const checkDesignation = checkDesignationValidity(designation);
    const checkPhoneNumber = checkPhoneNoValidity(phone);

    if (!checkFullName) {
      if (!checkDesignation) {
        if (!checkPhoneNumber) {
          setLoading(true);
          const data = {
            email: email,
            fullname: fullname,
            phone: phone,
            gender: gender,
            designation: designation,
            dob: moment(date).format('MM/DD/YYYY'),
          };
          const user_uid = user.id;
          db.collection('usersCollections')
            .doc(user_uid)
            .set(data, {merge: true});
          db.collection('usersCollections')
            .doc(user_uid)
            .get()
            .then(function (user) {
              var userdetails = {...user.data(), id: user_uid};
              dispatch(login(userdetails));
              if (user.exists) {
                setLoading(false);
                navigation.navigate('DSetting');
                Alert.alert('Your Details are Updated');
              } else {
                setLoading(false);
                Alert.alert('Please try again');
              }
            });
        } else {
          alert(checkPhoneNumber);
        }
      } else {
        alert(checkDesignation);
      }
    } else {
      alert(checkFullName);
    }
  };
  const renderOption = title => <SelectItem title={title} />;
  return loading ? (
    <PageLoader />
  ) : (
    <ScrollView width="100%" showsVerticalScrollIndicator={false}>
      <Layout style={{width: '100%'}}>
        <SafeAreaView>
          <Layout style={styles.MainContainer}>
            <Layout style={styles.topHead}>
              <Icon
                style={styles.arrow}
                fill="#0075A9"
                name="arrow-back"
                onPress={() =>
                  navigation.navigate('DoctorBottomTab', {screen: 'DSetting'})
                }
              />
              <Text style={styles.TopHeader}>Edit Your Profile</Text>
            </Layout>
            <Divider />
            <Layout style={styles.MainContainerTwo}>
              <Image
                source={require('../../assets/user2.png')}
                style={styles.image}
              />
              <Input
                placeholder="Full Name"
                style={styles.input}
                value={fullname}
                maxLength={17}
                onChangeText={text => setFullname(text)}
                label={evaProps => (
                  <Text {...evaProps} style={styles.FullName}>
                    Full Name
                  </Text>
                )}
              />
              <Input
                placeholder="Designation "
                value={designation}
                defaultValue={designation}
                onChangeText={text => setDesignation(text)}
                label={evaProps => (
                  <Text {...evaProps} style={styles.Designation}>
                    Designation
                  </Text>
                )}
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
              <Select
                style={styles.input}
                label={evaProps => (
                  <Text {...evaProps} style={styles.Gender}>
                    Gender
                  </Text>
                )}
                placeholder="Default"
                value={displayValue}
                onSelect={index => setSelectedIndex(index)}>
                {data.map(renderOption)}
              </Select>
              <Input
                placeholder="name@email.com"
                style={styles.input}
                value={email}
                disabled={true}
                onChangeText={text => handleCheckEmail(text)}
                label={evaProps => (
                  <Text {...evaProps} style={styles.Email}>
                    Email Address
                  </Text>
                )}
              />
              <Input
                placeholder="Phone Number"
                value={phone}
                onChangeText={text => setPhone(text)}
                style={styles.input}
                label={evaProps => (
                  <Text {...evaProps} style={styles.PhoneNo}>
                    Phone Number
                  </Text>
                )}
              />
            </Layout>
            <Layout style={styles.bottomButton}>
              <Button
                style={styles.cancel}
                onPress={() => {
                  navigation.navigate('DoctorBottomTab', {screen: 'DSetting'});
                }}>
                Cancel
              </Button>
              <Button style={styles.save} onPress={handleUpdate}>
                Save
              </Button>
            </Layout>
          </Layout>
        </SafeAreaView>
      </Layout>
    </ScrollView>
  );
};
export default DEditProfile;
const styles = StyleSheet.create({
  MainContainer: {
    height: '100%',
    paddingBottom: 80,
  },
  MainContainerTwo: {
    backgroundColor: '#F9F9F9',
    marginHorizontal: 30,
    top: 30,
    padding: 30,
  },
  input: {
    marginTop: 15,
  },
  Gender: {
    fontFamily: 'GTWalsheimPro-Bold',
    marginBottom: 5,
    fontSize: 17,
  },
  DOB: {
    fontFamily: 'GTWalsheimPro-Bold',
    marginTop: 8,
    marginBottom: -4,
    fontSize: 17,
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
  TopHeader: {
    left: 70,
    fontFamily: 'Recoleta-Bold',
    paddingBottom: 15,
    textTransform: 'uppercase',
    marginLeft: 10,
    fontSize: 20,
  },
  FullName: {
    fontFamily: 'GTWalsheimPro-Bold',
    marginBottom: 5,
    fontSize: 17,
  },
  Designation: {
    fontFamily: 'GTWalsheimPro-Bold',
    marginBottom: 5,
    fontSize: 17,
    paddingTop: 10,
  },
  PhoneNo: {
    fontFamily: 'GTWalsheimPro-Bold',
    marginBottom: 5,
    fontSize: 17,
  },
  image: {
    width: 70,
    height: 70,
    position: 'absolute',
    top: -25,
    right: 10,
  },
  bottomButton: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 30,
    top: 50,
  },
  Email: {
    fontFamily: 'GTWalsheimPro-Bold',
    marginBottom: 5,
    fontSize: 17,
  },
  cancel: {
    width: 150,
    backgroundColor: '#0F7BAB',
    borderColor: '#0F7BAB',
  },
  save: {
    width: 150,
    backgroundColor: '#0F7BAB',
    borderColor: '#0F7BAB',
    left: 30,
  },
  arrow: {
    width: 30,
    height: 30,
    left: 30,
    top: 30,
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
