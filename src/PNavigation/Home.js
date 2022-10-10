import {
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Layout, Text, Input, Icon} from '@ui-kitten/components';
import {useSelector} from 'react-redux';
import {PageLoader} from '../PScreen/PageLoader';
import axios from 'axios';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
const SearchIcon = props => <Icon {...props} name="search" />;
const Home = ({navigation}) => {
  const authUser = useSelector(state => state.auth);
  const initialList = [
    {
      index: 'cough_count',
      name: 'Number of Cough',
      image: require('../../assets/Group.png'),
      steps: '0',
    },
    {
      index: 'night_waking',
      name: 'No of Night Waking',
      image: require('../../assets/fa6-solid_person-walking.png'),
      steps: '0',
    },
    {
      index: 'drink_count',
      name: 'Number of Drinking',
      image: require('../../assets/gg_glass-alt.png'),
      steps: '0',
    },
    {
      index: 'fall_count',
      name: 'Number of Falls',
      image: require('../../assets/fa6-solid_person-falling.png'),
      steps: '0',
    },
  ];
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState(initialList);

  const getFilter1 = () => {
    var date = moment(new Date()).format('DD/MM/YYYY');
    setList(initialList);

    axios
      .post('https://us-central1-docker-347218.cloudfunctions.net/Data-API', {
        date: date,
        email: 'dereckjos12@gmail.com',
        password: 'Vigilance@001',
      })
      .then(function (response) {
        const data = response.data;
        const newList = list.map(item => {
          if (data[item.index]) {
            const updatedItem = {
              ...item,
              steps: data[item.index],
            };
            return updatedItem;
          }
          return item;
        });
        setList(newList);
        setLoading(false);
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  useLayoutEffect(() => {
    getFilter1();
  }, []);

  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState(list);
  const handleSearch = value => {
    const filtered = list.filter(_data =>
      _data?.name?.toLowerCase().includes(value?.toLowerCase()),
    );
    return setSearchData(filtered);
  };
  useEffect(() => {
    setSearchData(list);
  }, [list]);
  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue]);
  return loading ? (
    <PageLoader />
  ) : (
    <SafeAreaView>
      <Layout style={styles.Container}>
        <Layout style={styles.mainHeader}>
          <Layout style={styles.TopHead}>
            <Text style={styles.Hello}>Hello !</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PSetting')}>
              <Image
                source={require('../../assets/user2.png')}
                style={styles.image}
              />
              <Icon
                name="settings-outline"
                style={styles.setting}
                fill="#0075A9"
                onPress={() => navigation.navigate('PSetting')}
              />
            </TouchableOpacity>
          </Layout>
          <Text style={styles.FullName}>
            {authUser.user.fullname}
            <Image
              source={require('../../assets/hand.png')}
              style={styles.userImage1}
            />
          </Text>

          <Text style={styles.text}>
            Today's <Text style={styles.AnalyticsOne}>Analytics</Text>
          </Text>
          <Text style={styles.DailyAna}>
            {' '}
            View your Today's Analysis Here....!!!
          </Text>

          <Layout style={styles.Width}>
            <SafeAreaView>
              <FlatList
                style={styles.listStyle}
                keyExtractor={key => {
                  return key.index;
                }}
                extraData={searchData}
                numColumns={2}
                data={searchData}
                renderItem={({item}) => {
                  return (
                    <>
                      <Layout style={styles.textStyle}>
                        <Image
                          source={item.image}
                          resizeMode="contain"
                          style={styles.imageCard}
                        />
                        <Text style={styles.NameFull}>{item.name}</Text>
                        <Text style={styles.Steps}>{item.steps}</Text>
                      </Layout>
                    </>
                  );
                }}
              />
            </SafeAreaView>
          </Layout>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};
const mapStateToProps = state => ({
  user: state.auth.user,
});
export default Home;
const styles = StyleSheet.create({
  Container: {
    height: '100%',
    marginBotton: 30,
  },
  Hello: {
    marginTop: 35,
    marginBottom: -5,
    fontSize: 18,
    fontFamily: 'Recoleta-Bold',
    paddingBottom: 12,
  },
  mainHeader: {
    marginHorizontal: 30,
    marginBotton: 30,
  },
  Width: {
    width: '100%',
  },
  TopHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  DailyAna: {
    fontFamily: 'Recoleta-Medium',
    fontSize: 15,
    color: 'grey',
    paddingTop: 17,
    paddingBottom: 14,
  },

  FullName: {
    fontSize: 25,
    fontFamily: 'Recoleta-Bold',
    color: '#0075A9',
    marginTop: 10,
  },
  input: {
    borderRadius: 30,
    fontFamily: 'GTWalsheimPro-Regular',
  },
  AnalyticsOne: {
    fontSize: 22,
    fontFamily: 'Recoleta-Bold',
    color: '#0075A9',
    marginTop: 14,
  },
  NameFull: {
    maxWidth: 100,
    color: '#000',
    fontSize: 17,
    textAlign: 'center',
    paddingTop: 10,
    fontWeight: '600',
    fontFamily: 'GTWalsheimPro-Regular',
  },
  Steps: {
    backgroundColor: '#0075A9',
    fontSize: 26,
    color: 'white',
    paddingLeft: 26,
    paddingRight: 26,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontFamily: 'GTWalsheimPro-Regular',
  },
  text: {
    marginTop: 14,
    fontSize: 25,
    fontFamily: 'Recoleta-Bold',
  },
  textStyle: {
    padding: 10,
    backgroundColor: '#EEF5F9',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    borderRadius: 10,
  },
  listStyle: {
    textAlign: 'center',
    padding: 10,
    margin: 0,
    paddingBottom: 10,
  },
  lineStyle: {
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  imageCard: {
    width: 50,
    height: 50,
    marginTop: 7,
  },
  setting: {
    width: 30,
    height: 30,
    position: 'absolute',
    marginTop: 26,
    left: 40,
  },
  image: {
    height: 65,
    width: 65,
    borderRadius: 50,
    position: 'absolute',
    marginTop: 7,
    left: -90,
  },
  userImage1: {
    height: 25,
    width: 25,
    borderRadius: 50,
    position: 'absolute',
    marginTop: 10,
    left: -90,
  },
});
