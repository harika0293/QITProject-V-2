import React from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};
const slides = [
  {
    id: '1',
    image: require('../../assets/onboarding1.png'),
    title: 'Hospitalizations are Traumatic for Elderly',
    subtitle: 'Elderly do not like to go to hospitals they prefer care at home',
  },
  {
    id: '2',
    image: require('../../assets/onboarding2.png'),
    title: 'For Beneficiaries, balancing work & parents health is hard',
    subtitle: 'Stress from Cost,medical decision-making during hospitalization',
  },
  {
    id: '3',
    image: require('../../assets/onboarding3rg.png'),
    title: 'Hospitals want to keep elderly out of hospitals & er',
    subtitle: 'Fed offers incentives to hospitals to push for outpatient care',
  },
];
const Slide = ({item}) => {
  return (
    <View style={{flex: 1}}>
      <Image
        source={item.image}
        style={{height: '100%', width, resizeMode: 'cover'}}
      />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
};
const OnBoarding = ({navigation}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };
  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };
  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };
  const Footer = () => {
    return (
      <View style={{backgroundColor: '#000'}}>
        <View style={styles.FooterOne}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: COLORS.white,
                  width: 12,
                },
              ]}
            />
          ))}
        </View>
        <View style={{marginBottom: 20}}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{height: 50}}>
              <TouchableOpacity
                style={styles.btn1}
                onPress={() => navigation.navigate('ALoader')}>
                <Text style={styles.Continue}>Continue</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row', position: 'absolute'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: '#fff',
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}>
                <LinearGradient
                  colors={['#4c669f', '#3b5998', '#192f6a']}
                  style={styles.linearGradient}>
                  <Text style={styles.SkipOne}>Skip</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={{width: 15}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}>
                <Text style={styles.NextOne}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.primary}}>
      <StatusBar backgroundColor={COLORS.primary} />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  title: {
    color: COLORS.white,
    fontSize: 22,
    maxWidth: 300,
    marginLeft: 50,
    textAlign: 'center',
    position: 'absolute',
    textTransform: 'uppercase',
    bottom: 220,
    fontFamily: 'Recoleta-Bold',
  },
  subtitle: {
    color: COLORS.white,
    fontSize: 17,
    lineHeight: 23,
    position: 'absolute',
    bottom: 130,
    margin: 30,
    textAlign: 'center',
    fontFamily: 'GTWalsheimPro-Regular',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  FooterOne: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: -150,
    left: 170,
  },
  SkipOne: {
    fontSize: 18,
    fontFamily: 'Recoleta-Bold',
    marginTop: -80,
    left: 200,
    color: '#0075A9',
  },
  NextOne: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Recoleta-Bold',
    top: 20,
    color: 'white',
  },
  Continue: {
    fontSize: 17,
    fontFamily: 'Recoleta-Bold',
    color: 'white',
  },
  indicator: {
    height: 15,
    width: 15,
    backgroundColor: 'grey',
    marginHorizontal: 5,
    borderRadius: 10,
    top: 10,
  },
  btn: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#0075A9',
    justifyContent: 'center',
    alignItems: 'center',
    top: -55,
    right: 90,
  },
  btn1: {
    flex: 1,
    height: 100,
    width: 350,
    borderRadius: 10,
    backgroundColor: '#0075A9',
    justifyContent: 'center',
    alignItems: 'center',
    top: -40,
    left: 20,
  },
});
export default OnBoarding;
