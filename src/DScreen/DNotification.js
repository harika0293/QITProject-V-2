import {StyleSheet, SafeAreaView, FlatList} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Layout, Text, Icon} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import {auth, db} from '../../firebase';
import {connect, useSelector} from 'react-redux';
import {PageLoader} from '../PScreen/PageLoader';
const DNotification = () => {
  const auth = useSelector(state => state.auth);
  const [user, setUser] = useState(auth?.user);
  const navigation = useNavigation();
  const initialList = [];
  const [list, setList] = React.useState(initialList);
  const [loading, setLoading] = React.useState(false);
  let myTimeout = () => {
    getFilter1();
    setTimeout(() => {
      myTimeout();
    }, 600000);
  };

  const getFilter1 = date => {
    var date = moment(new Date()).format('DD/MM/YYYY');
    axios
      .post(
        'https://us-central1-docker-347218.cloudfunctions.net/falling_alert_api',
        {
          date: date,
          email: 'dereckjos12@gmail.com',
          password: 'Vigilance@001',
        },
      )
      .then(function (response) {
        const data = response.data;
        for (const element in data) {
          const newList = data[element].map((item, index) => {
            const newMsg = {
              index: index.toString(),
              name: element,
              image: require('../../assets/notification.png'),
              msg: item[0],
              hour: moment(item[1], 'HH:mm:ss').format('hh:mm A'),
            };
            return newMsg;
          });
          setList(newList);
          setLoading(false);
          return newList;
        }
      })
      .catch(function (error) {
        setLoading(false);
        // console.log(error);
      });
  };
  useLayoutEffect(() => {
    getFilter1();
  }, []);

  useEffect(() => {
    myTimeout();
  }, []);

  return loading ? (
    <PageLoader />
  ) : (
    <Layout style={styles.MainContainer}>
      <Layout style={styles.TopHead}>
        <Icon
          style={styles.Arrow}
          fill="#0075A9"
          name="arrow-back"
          onPress={() => navigation.navigate('DSetting')}
        />
        <Text style={styles.NotiHead}>Notification</Text>
      </Layout>
      <Text style={styles.NotiPara}>View your notifications</Text>
      <SafeAreaView>
        <FlatList
          style={styles.textStyle}
          keyExtractor={(item, index) => index.toString()}
          data={list}
          extraData={list}
          renderItem={({item}) => {
            return (
              <>
                <Layout style={styles.Card}>
                  <Icon style={styles.icon} fill="grey" name="bell-outline" />
                  <Layout style={styles.Circle}></Layout>
                  <Text style={styles.ItemName}>{item.name}</Text>
                  <Layout style={styles.Circle}></Layout>
                  <Text style={styles.ItemHour}>{item.hour}</Text>
                  <Text style={styles.Msg}>{item.msg}</Text>
                </Layout>
              </>
            );
          }}
        />
      </SafeAreaView>
    </Layout>
  );
};
export default DNotification;
const styles = StyleSheet.create({
  MainContainer: {
    height: '100%',
  },
  TopHead: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 20,
  },
  Arrow: {
    width: 30,
    height: 30,
  },
  NotiHead: {
    fontSize: 20,
    fontFamily: 'Recoleta-Bold',
    marginLeft: 10,
  },
  NotiPara: {
    fontSize: 15,
    color: '#DDDDDD',
    fontFamily: 'GTWalsheimPro-Bold',
    marginLeft: 60,
    paddingBottom: 10,
  },
  ItemName: {
    marginLeft: 20,
    fontSize: 17,
    color: '#0075A9',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  ItemHour: {
    marginLeft: 20,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  icon: {
    height: 30,
    width: 30,
    top: 5,
  },
  Card: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FCFCFC',
    width: '100%',
    marginTop: 15,
    padding: 10,
    paddingBottom: 25,
    borderRadius: 10,
    marginBottom: 35,
    marginHorizontal: 30,
  },
  Msg: {
    position: 'absolute',
    marginTop: 30,
    width: 200,
    left: 65,
    top: 20,
    fontSize: 15,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  Circle: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    position: 'absolute',
    marginTop: 16,
    marginLeft: 27,
  },
});
