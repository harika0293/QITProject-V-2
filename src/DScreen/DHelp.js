import {
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {Layout, Text, Icon} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
const DHelp = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Layout style={styles.MainContainer}>
        <Layout style={styles.Arrow}>
          <Icon
            onPress={() =>
              navigation.navigate('DoctorBottomTab', {screen: 'DSetting'})
            }
            style={styles.arrow}
            fill="#0075A9"
            name="arrow-back"
          />
        </Layout>
        <Layout style={styles.MainHeader}>
          <Text style={styles.Heading}>Contact Us for Enquiries: </Text>
          <Text style={styles.Heading}>Mail us at: </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'mailto:https://mail.google.com/mail/?view=cm&fs=1&to=vigilanceai.app@gmail.com',
              )
            }>
            <Text style={styles.text}>vigilanceai.app@gmail.com </Text>
          </TouchableOpacity>
          <Text style={styles.Heading}>About Vigilance AI: </Text>
          <Text style={styles.text}>
            Vigilance AI is a team of experts in computer vision and healthcare.
            Our values are innovation, compassion, and reliability.{' '}
          </Text>
          <Text style={styles.Heading}>Our Innovation: </Text>
          <Text style={styles.text}>
            We are constantly at the forefront of new technology and never
            settle for the minimal viable product.
          </Text>
          <Text style={styles.Heading}>Our Compassion: </Text>
          <Text style={styles.text}>
            We do our work with compassion. Keeping older adults safe, healthy,
            and in their own homes has special meaning to us and is what
            motivates us. Our hearts are in our work.
          </Text>
          <Text style={styles.Heading}>Our Reliability: </Text>
          <Text style={styles.text}>
            The reliability of our product is everything to us and everything to
            our users.
          </Text>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};
export default DHelp;
const styles = StyleSheet.create({
  MainContainer: {
    height: '100%',
  },
  Arrow: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 10,
    left: 20,
  },
  MainHeader: {
    marginTop: 40,
    marginHorizontal: 30,
  },
  arrow: {
    height: 30,
    width: 30,
  },
  Heading: {
    fontSize: 18,
    fontFamily: 'Recoleta-Bold',
    color: '#0075A9',
    marginTop: 25,
    marginBottom: 7,
  },
  text: {
    fontFamily: 'GTWalsheimPro-Regular',
    color: 'grey',
  },
});
