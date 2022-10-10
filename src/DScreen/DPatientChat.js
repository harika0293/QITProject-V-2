import {StyleSheet, FlatList, Image, SafeAreaView} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Layout, Text, Input, Icon} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {connect, useSelector} from 'react-redux';
import {db} from '../../firebase';
import {PageLoader} from '../PScreen/PageLoader';
import {ScrollView} from 'react-native-gesture-handler';
const SearchIcon = props => <Icon {...props} name="search" />;
const DPatientChat = props => {
  const auth = useSelector(state => state.auth);
  const navigation = useNavigation();
  const [patientList, setPatientList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState(patientList);
  const [loading, setLoading] = useState(true);
  const handleSearch = value => {
    const filtered = patientList.filter(_data =>
      _data?.name?.toLowerCase().includes(value?.toLowerCase()),
    );
    return setSearchData(filtered);
  };
  const loadDoctors = () => {
    // console.log('focussed');
    db.collection('usersCollections')
      .where('role', '==', 'patient')
      .where('myDoctor', '==', auth?.user?.id)
      .get()
      .then(querySnapshot => {
        const availpatients = [];
        querySnapshot.forEach(doc => {
          var newDoc = {
            index: doc.id,
            name: doc.data().fullname,
            msg: '',
            image: require('../../assets/user2.png'),
            notification: doc.data().newMessages,
          };
          availpatients.push(newDoc);
        });
        setPatientList(availpatients);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        // console.log('Error getting documents: ', error);
      });
  };
  React.useEffect(() => {
    loadDoctors();
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      // console.log('focus');
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
    <Layout style={{height: '100%'}}>
      <Layout style={styles.mainHead}>
        <Layout style={styles.headTop}>
          <Icon
            name="arrow-back"
            fill="#0075A9"
            style={styles.icon}
            onPress={() => navigation.navigate('DSetting')}
          />
          <Text style={styles.pText}>Your Chat History</Text>
        </Layout>
        <Layout style={styles.Search}>
          <Input
            placeholder="Search...."
            accessoryRight={SearchIcon}
            value={searchValue}
            onChangeText={newText => setSearchValue(newText)}
            style={styles.input}
            size="large"
          />
        </Layout>
        <Text style={styles.PatientList}>Your Patient Chat List</Text>
      </Layout>
      <ScrollView width="100%" showsVerticalScrollIndicator={false}>
        <Layout style={styles.Layout}>
          <SafeAreaView>
            <FlatList
              style={styles.textStyle}
              keyExtractor={item => item.index}
              vertical
              showsVerticalScrollIndicator={false}
              data={searchData}
              extraData={searchData}
              renderItem={({item}) => {
                return (
                  <Layout style={styles.card}>
                    <Image
                      source={item.image}
                      resizeMode="cover"
                      style={styles.imageone}
                    />
                    <Text style={styles.text}>{item.name}</Text>
                    <Text style={styles.msg}>{item.msg}</Text>
                    <Text style={styles.noti}>
                      {item.notification ? item.notification : 0}
                    </Text>
                    <Text
                      style={styles.msgNow}
                      onPress={() =>
                        navigation.navigate('DChat', {thread: item})
                      }>
                      Message Now
                    </Text>
                  </Layout>
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
export default DPatientChat;
const styles = StyleSheet.create({
  mainHead: {
    marginHorizontal: 30,
  },
  input: {
    borderRadius: 30,
    fontFamily: 'GTWalsheimPro-Regular',
  },
  icon: {
    height: 30,
    width: 30,
  },
  PatientList: {
    fontSize: 20,
    fontFamily: 'Recoleta-Bold',
    marginTop: 30,
    marginBottom: 10,
  },
  Layout: {
    width: '85%',
    left: 30,
  },
  imageone: {
    height: 60,
    width: 60,
    borderRadius: 50,
    marginTop: 0,
  },
  headTop: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30,
  },
  pText: {
    fontSize: 20,
    fontFamily: 'Recoleta-Bold',
    left: 10,
  },
  Search: {
    marginTop: 20,
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
  text: {
    position: 'absolute',
    marginTop: 10,
    marginLeft: 90,
    fontSize: 18,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  msgNow: {
    position: 'absolute',
    bottom: 30,
    left: 90,
    fontSize: 15,
    color: '#0075A9',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  textStyle: {
    paddingBottom: 100,
  },
});
