import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
const ALoader = ({navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
      <Layout style={styles.mainContainer}>
        <Layout style={styles.homeTop}>
          <Image
            style={styles.logo}
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
          <Text style={styles.Text1}>Press Anywhere to Continue</Text>
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
};
export default ALoader;
const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    backgroundColor: '#fff',
  },
  homeTop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logo: {
    height: 180,
    width: 100,
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    marginTop: 270,
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
    alignItems: 'center',
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
  Text1: {
    marginTop: 50,
    color: 'grey',
    fontSize: 18,
    fontFamily: 'Recoleta-Bold',
    alignItems: 'center',
  },
});
