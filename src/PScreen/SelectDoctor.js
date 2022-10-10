import {StyleSheet, Image, FlatList, SafeAreaView} from 'react-native';
import {login} from '../reducers';
import {useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Layout, Text, Input, Icon} from '@ui-kitten/components';
import {db} from '../../firebase';
import {PageLoader} from './PageLoader';
import {connect, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
const SearchIcon = props => <Icon {...props} name="search" />;
const SelectDoctor = props => {
  const authUser = useSelector(state => state.auth);
  const navigation = useNavigation();
  const UserDetails1 = authUser.user;
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [myDoctor, setMyDoctor] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState(doctors);
  const [loading, setLoading] = React.useState(false);
  const handleSearch = value => {
    const filtered = doctors.filter(_data =>
      _data?.name?.toLowerCase().includes(value?.toLowerCase()),
    );
    return setSearchData(filtered);
  };
  const handleUpdate = myDoctor => {
    setLoading(true);
    db.collection('usersCollections')
      .doc(UserDetails1.id)
      .update({myDoctor: myDoctor});
    db.collection('usersCollections')
      .doc(UserDetails1.id)
      .get()
      .then(function (user) {
        var userdetails = {...user.data(), id: UserDetails1.id};
        dispatch(login(userdetails));
        setLoading(false);
        navigation.navigate('SucessScreen');
      })
      .catch(function (error) {
        setLoading(false);
        // console.log('Error getting documents: ', error);
      });
  };
  const loadDoctors = () => {
    setLoading(true);
    db.collection('usersCollections')
      .where('role', '==', 'doctor')
      .get()
      .then(querySnapshot => {
        const availdoctors = [];
        querySnapshot.forEach(doc => {
          var newDoc = {
            index: doc.id,
            name: doc.data().fullname,
            designation: doc.data().designation,
            image: require('../../assets/user2.png'),
          };
          availdoctors.push(newDoc);
        });
        setDoctors(availdoctors);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        // console.log('Error getting documents: ', error);
      });
  };
  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue]);
  useEffect(() => {
    setSearchData(doctors);
  }, [doctors]);
  return loading ? (
    <PageLoader />
  ) : (
    <Layout style={styles.MainContainer}>
      <Layout style={styles.TopHead}>
        <Text style={styles.Hello}>Hello !!!</Text>
      </Layout>
      <Text style={styles.DrText}>{UserDetails1.fullname}</Text>
      <Text style={styles.ParaText}>Its Mandatory to Select one Doctor</Text>
      <Layout style={styles.Search}>
        <Input
          placeholder="Search...."
          accessoryRight={SearchIcon}
          value={searchValue}
          onChangeText={newText => setSearchValue(newText)}
          style={styles.InputText}
          size="large"
        />
      </Layout>
      <ScrollView width="100%" showsVerticalScrollIndicator={false}>
        <Layout style={styles.Layout}>
          <SafeAreaView>
            <FlatList
              style={styles.FlatList}
              keyExtractor={key => {
                return key.index;
              }}
              vertical
              extraData={searchData}
              data={searchData}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <>
                    <Layout style={styles.Card}>
                      <Image
                        source={item.image}
                        resizeMode="cover"
                        style={styles.imageTwo}
                      />
                      <Text style={styles.DocName}>{item.name}</Text>
                      <Text style={styles.DocDesig}>{item.designation}</Text>
                      <Text
                        style={styles.DocSelect}
                        onPress={() => handleUpdate(item.index)}>
                        Select Your Doctor
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
export default SelectDoctor;
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
  DrText: {
    fontSize: 25,
    fontFamily: 'Recoleta-Bold',
    color: '#0075A9',
  },
  Layout: {
    width: '100%',
  },
  imageTwo: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  Hello: {
    fontSize: 20,
    fontFamily: 'Recoleta-Bold',
    marginLeft: 4,
    marginBottom: 10,
    marginTop: 40,
  },
  ParaText: {
    fontSize: 17,
    marginTop: 17,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  Search: {
    marginTop: 30,
  },
  InputText: {
    borderRadius: 30,
    fontFamily: 'GTWalsheimPro-Regular',
  },
  FlatList: {
    paddingBottom: 100,
  },
  Card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F9F9F9',
    width: '100%',
    marginTop: 15,
    padding: 15,
    paddingBottom: 20,
  },
  DocName: {
    position: 'absolute',
    marginTop: 10,
    marginLeft: 90,
    fontSize: 18,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  DocDesig: {
    position: 'absolute',
    marginTop: 40,
    marginBottom: 20,
    marginLeft: 90,
    color: '#D5D5D5',
    fontSize: 14,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  DocSelect: {
    marginTop: -7,
    marginHorizontal: 75,
    fontSize: 13,
    color: '#0075A9',
    fontFamily: 'GTWalsheimPro-Bold',
  },
});
