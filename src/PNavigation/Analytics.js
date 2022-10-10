import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Layout, Text, Icon} from '@ui-kitten/components';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {PageLoader} from '../PScreen/PageLoader';
import {ScrollView} from 'react-native-gesture-handler';
const Analytics = () => {
  const authUser = useSelector(state => state.auth);
  const initialList = [
    {
      index: 'cough_count',
      name: 'Number of Cough',
      image: require('../../assets/cough.png'),
      steps: '0',
    },
    {
      index: 'night_waking',
      name: 'No of Night Walking',
      image: require('../../assets/walking.png'),
      steps: '0',
    },
    {
      index: 'drink_count',
      name: 'Number of Drinking',
      image: require('../../assets/glass.png'),
      steps: '0',
    },
    {
      index: 'fall_count',
      name: 'Number of Falls',
      image: require('../../assets/falling.png'),
      steps: '0',
    },
  ];
  const [date, setDate] = useState(new Date(Date.now())); //current date code
  const [list, setList] = React.useState(initialList);
  const [loading, setLoading] = React.useState(false);
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
  const getFilter1 = date => {
    date = moment(date).format('DD/MM/YYYY');
    setList(initialList);
    //setLoading(true);
    axios
      .post('https://us-central1-docker-347218.cloudfunctions.net/Data-API', {
        date: date,
        email: 'dereckjos12@gmail.com',
        password: 'Vigilance@001',
      })
      .then(function (response) {
        const data = response.data;

        const newList = list.map(item => {
          if (data[item.index] === 0) {
            setList(initialList);
            setLoading(false);
            return item;
          } else {
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
          }
        });
      })
      .catch(function (error) {
        setLoading(false);
        setList(initialList);
        //console.log(error);
      });
  };
  useLayoutEffect(() => {
    getFilter1(date);
  }, [date]);
  return loading ? (
    <PageLoader />
  ) : (
    <SafeAreaView>
      <Layout style={styles.MainContainer}>
        <Layout style={styles.mainHead}>
          <Layout style={styles.mainHeader}>
            <Text style={styles.Daily}>
              Daily
              <Text style={styles.Analytics}> Analytics</Text>
            </Text>
            <Text style={styles.DailyAna}>
              {' '}
              View your daily analysis on daily basis
            </Text>
          </Layout>
          <Layout style={styles.Calendar}>
            <Text style={styles.Selected}>
              Selected
              <Text style={styles.CalendarTwo}> Date </Text>
            </Text>
            <TouchableOpacity
              style={styles.CalendarThree}
              onPress={() => showDatepicker()}>
              <Text style={styles.CalendarFour}>
                : {moment(date).format('DD-MM-YYYY')}
              </Text>
              <Icon style={styles.icon2} fill="#0075A9" name="calendar" />
            </TouchableOpacity>
          </Layout>
          <Layout style={{width: '100%'}}>
            <FlatList
              style={styles.textStyle}
              keyExtractor={key => {
                return key.index;
              }}
              data={list}
              extraData={list}
              renderItem={({item}) => {
                return (
                  <>
                    <Layout style={styles.card}>
                      <Image source={item.image} resizeMode="contain" />
                      <Text style={styles.text}>{item.name}</Text>
                      <Text style={styles.step}>{item.steps}</Text>
                    </Layout>
                  </>
                );
              }}
            />
          </Layout>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};
export default Analytics;
const styles = StyleSheet.create({
  MainContainer: {
    height: '100%',
  },
  mainHead: {
    marginHorizontal: 30,
  },
  mainHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  CalendarTwo: {
    color: '#0075A9',
    fontSize: 22,
    fontFamily: 'Recoleta-Bold',
  },
  CalendarThree: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CalendarFour: {
    color: '#C1C1C1',
    fontSize: 18,
    fontFamily: 'Recoleta-Bold',
  },
  Selected: {
    fontSize: 22,
    fontFamily: 'Recoleta-Bold',
  },
  Daily: {
    fontSize: 25,
    fontFamily: 'Recoleta-Bold',
  },
  Analytics: {
    color: '#0075A9',
    fontSize: 25,
    fontFamily: 'Recoleta-Bold',
  },
  DailyAna: {
    fontFamily: 'GTWalsheimPro-Regular',
    fontSize: 17,
    color: '#C5C5C5',
    textAlign: 'center',
  },

  text: {
    marginTop: 10,
    alignItems: 'center',
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  Calendar: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#EEF5F9',
    width: '100%',
    marginTop: 15,
    padding: 15,
    paddingBottom: 30,
  },
  image: {
    height: 100,
    width: 100,
  },
  step: {
    position: 'absolute',
    fontSize: 40,
    marginTop: 20,
    left: 100,
    top: 30,
    color: '#0075A9',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  icon2: {
    width: 30,
    height: 25,
    left: 20,
  },
  textStyle: {
    paddingBottom: 100,
  },
});
