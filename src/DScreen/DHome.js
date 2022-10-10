import {StyleSheet, Image, FlatList, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Layout, Text, Input, Icon, Button} from '@ui-kitten/components';
import {useDispatch} from 'react-redux';
import {logout} from '../reducers';
import {db, auth} from '../../firebase';
import {connect, useSelector} from 'react-redux';
import {PageLoader} from '../PScreen/PageLoader';
import {ScrollView} from 'react-native-gesture-handler';
const SearchIcon = props => <Icon {...props} name="search" />;
const DHome = ({navigation}) => {
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth);
  const [loading, setLoading] = React.useState(true);
  const [patientList, setPatientList] = useState([
    {
      index: '1',
      name: 'Mr.Test User',
      msg: 'lLorem ipsum dolor sit amet,consectetur adipiscing elit,ua....',
      notification: '6+',
      image: require('../../assets/user2.png'),
    },
    {
      index: '2',
      name: 'Mr.Test User',
      msg: 'lLorem ipsum dolor sit amet,consectetur adipiscing elit,ua....',
      notification: '12+',
      image: require('../../assets/user2.png'),
    },
    {
      index: '3',
      name: 'Mr.Test User',
      msg: 'lLorem ipsum dolor sit amet,consectetur adipiscing elit,ua....',
      notification: '2+',
      image: require('../../assets/user2.png'),
    },
  ]);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState(patientList);
  const handleSearch = value => {
    const filtered = patientList.filter(_data =>
      _data?.name?.toLowerCase().includes(value?.toLowerCase()),
    );
    return setSearchData(filtered);
  };
  const loadDoctors = () => {
    db.collection('usersCollections')
      .where('role', '==', 'patient')
      .where('myDoctor', '==', authUser?.user?.id)
      .get()
      .then(querySnapshot => {
        const availpatients = [];
        querySnapshot.forEach(doc => {
          var newDoc = {
            index: doc.id,
            name: doc.data().fullname,
            msg: '',
            image: require('../../assets/user2.png'),
            dob: doc.data().dob,
            email: doc.data().email,
            phone: doc.data().phone,
            diagnosis: doc.data().diagnosis,
            notification: doc.data().newMessages,
          };
          availpatients.push(newDoc);
        });
        setPatientList(availpatients);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        //console.log('Error getting documents: ', error);
      });
  };
  React.useEffect(() => {
    loadDoctors();
    const willFocusSubscription = navigation.addListener('focus', () => {
      //console.log('focus');
      loadDoctors();
    });
    return willFocusSubscription;
  }, []);
  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue]);
  useEffect(() => {
    setSearchData(patientList);
  }, [patientList]);
  return loading ? (
    <PageLoader />
  ) : (
    <Layout style={styles.MainContainer}>
      <Layout style={styles.TopHead}>
        <Text style={styles.Hello}>Hello !</Text>
        <Image
          source={require('../../assets/user2.png')}
          style={styles.userImage}
        />
      </Layout>
      <Text style={styles.DrText}>
        {authUser.user.fullname}
        <Image
          source={require('../../assets/hand.png')}
          style={styles.userImage1}
        />
      </Text>
      <Layout style={styles.Search}>
        <Input
          placeholder="Search...."
          accessoryRight={SearchIcon}
          style={styles.input}
          value={searchValue}
          onChangeText={newText => setSearchValue(newText)}
          size="large"
        />
      </Layout>
      <Text style={styles.ParaText}>Your Patients</Text>
      <ScrollView width="100%" showsVerticalScrollIndicator={false}>
        <Layout style={styles.Layout}>
          <SafeAreaView>
            <FlatList
              style={styles.textStyle}
              keyExtractor={key => {
                return key.index;
              }}
              vertical
              showsVerticalScrollIndicator={false}
              extraData={searchData}
              data={searchData}
              renderItem={({item}) => {
                return (
                  <>
                    <Layout style={styles.card}>
                      <Image
                        source={item.image}
                        resizeMode="cover"
                        style={styles.ImageOne}
                      />
                      <Text style={styles.text}>{item.name}</Text>
                      <Text style={styles.msg}>{item.msg}</Text>
                      <Text style={styles.noti}>
                        {item.notification ? item.notification : 0}
                      </Text>
                      <Text
                        style={styles.details}
                        onPress={() =>
                          navigation.navigate('DFilter', {patient: item})
                        }>
                        View Details
                      </Text>
                      <Text
                        style={styles.msgNow}
                        onPress={() => navigation.navigate('DPatientChat')}>
                        Message
                      </Text>
                    </Layout>
                  </>
                );
              }}
            />
          </SafeAreaView>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
const mapStateToProps = state => ({
  user: state.auth.user,
});
export default DHome;
const styles = StyleSheet.create({
  MainContainer: {
    height: '100%',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  TopHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 65,
    height: 65,
    marginTop: 25,
    marginBottom: -15,
    borderRadius: 50,
    left: -20,
  },
  Layout: {
    width: '100%',
  },
  ImageOne: {
    height: 60,
    width: 60,
    borderRadius: 50,
    marginTop: 3,
  },
  Hello: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Recoleta-Bold',
  },
  DrText: {
    fontSize: 27,
    fontFamily: 'Recoleta-Bold',
    color: '#0075A9',
    marginTop: -6,
    marginRight: 20,
  },
  Search: {
    marginTop: 30,
  },
  input: {
    borderRadius: 30,
    fontFamily: 'GTWalsheimPro-Regular',
  },
  ParaText: {
    fontSize: 25,
    marginTop: 25,
    fontFamily: 'Recoleta-Bold',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F9F9F9',
    width: '100%',
    marginTop: 15,
    padding: 15,
    paddingBottom: 20,
  },
  text: {
    position: 'absolute',
    marginTop: 10,
    marginLeft: 90,
    fontSize: 18,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  msg: {
    position: 'absolute',
    marginTop: 40,
    marginLeft: 90,
    color: '#D5D5D5',
    fontSize: 16,
  },
  noti: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#FF6969',
    color: 'white',
    width: 30,
    height: 30,
    borderRadius: 50,
    paddingTop: 4,
    textAlign: 'center',
    fontSize: 15,
    marginTop: -10,
  },
  details: {
    marginTop: -30,
    marginHorizontal: 75,
    fontSize: 15,
    color: '#0075A9',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  msgNow: {
    position: 'absolute',
    bottom: 20,
    left: 210,
    fontSize: 15,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  textStyle: {
    paddingBottom: 100,
  },
  userImage1: {
    height: 25,
    width: 25,
    borderRadius: 50,
    position: 'absolute',
    marginTop: 10,
    left: -90,
    padding: 10,
  },
});
