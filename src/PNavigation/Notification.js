import {StyleSheet, SafeAreaView, FlatList, Alert} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Layout, Text, Icon} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import {auth, db} from '../../firebase';
import {connect, useSelector} from 'react-redux';
import {PageLoader} from '../PScreen/PageLoader';
const Notification = () => {
  const auth = useSelector(state => state.auth);
  const navigation = useNavigation();
  const [user, setUser] = useState(auth?.user);
  const initialList = [];
  const [list, setList] = React.useState(initialList);
  const [loading, setLoading] = React.useState(true);
  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('usersCollections')
      .doc(user.id)
      .collection('alerts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          Alert.alert('No Notifications');
          setList([]);
        }
        setList(
          snapshot.docs.map((doc, index) => ({
            index: index.toString(),
            name: doc.data().title,
            image: require('../../assets/notification.png'),
            msg: doc.data().body,
            hour: moment(doc.data().createdAt).fromNow().toLocaleString(),
          })),
        );
      });
    setLoading(false);
    return unsubscribe;
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
          onPress={() => navigation.navigate('PSetting')}
        />
        <Text style={styles.NotiHead}>Notification</Text>
      </Layout>
      <Text style={styles.NotiPara}>View your notifications</Text>
      {list.length === 0 ? (
        <Layout style={styles.NotiContainer}>
          <Text style={styles.NoNoti}>No Notifications</Text>
        </Layout>
      ) : (
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
                    <Text style={styles.ItemHour}>{item.hour}</Text>
                    <Text style={styles.Msg}>{item.msg}</Text>
                  </Layout>
                </>
              );
            }}
          />
        </SafeAreaView>
      )}
    </Layout>
  );
};
export default Notification;
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
  NotiContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  NoNoti: {
    textAlign: 'center',
    fontFamily: 'GTWalsheimPro-Bold',
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
  Card: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FCFCFC',
    width: '100%',
    marginTop: 15,
    padding: 15,
    paddingBottom: 5,
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
  icon: {
    height: 30,
    width: 30,
    top: 5,
  },
  Circle: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    position: 'absolute',
    marginTop: 19,
    marginLeft: 30,
  },
});
