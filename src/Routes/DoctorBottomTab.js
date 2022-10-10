import React from 'react';
import {Image, View, Dimensions, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DHome from '../DScreen/DHome';
import DNotification from '../DScreen/DNotification';
import DSetting from '../DScreen/DSetting';
import DPatientChat from '../DScreen/DPatientChat';
const width = Dimensions.get('window').width;
const BottomTab = createBottomTabNavigator();
export default function BottomTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#fff',
          width: width,
          marginTop: 20,
          height: 60,
        },
      }}>
      <BottomTab.Screen
        name="DHome"
        component={DHome}
        options={{
          tabBarLabel: ({focused}) => {
            return (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  fontFamily: 'Poppins-Medium',
                  color: focused ? '#4D39E9' : '#CECECE',
                }}></Text>
            );
          },
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                padding: 16,
                borderTopColor: '#0075A9',
                borderTopWidth: focused ? 4 : 0,
                width: 15,
              }}>
              <Image
                style={{alignSelf: 'center', width: 25, height: 25}}
                resizeMode={'contain'}
                source={
                  focused
                    ? require('../../assets/akar-icons_home.png')
                    : require('../../assets/akar-icons_home1.png')
                }
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="DPatientChat"
        component={DPatientChat}
        options={{
          tabBarLabel: ({focused}) => {
            return (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  fontFamily: 'Poppins-Medium',
                  color: focused ? '#4D39E9' : '#CECECE',
                }}></Text>
            );
          },
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                padding: 16,
                borderTopColor: '#0075A9',
                borderTopWidth: focused ? 4 : 0,
                width: 15,
              }}>
              <Image
                style={{alignSelf: 'center', width: 25, height: 25}}
                resizeMode={'contain'}
                source={
                  focused
                    ? require('../../assets/bi_chat-dots1.png')
                    : require('../../assets/bi_chat-dots.png')
                }
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="DNotification"
        component={DNotification}
        options={{
          tabBarVisible: false,
          tabBarLabel: '',
          unmountOnBlur: true,
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                padding: 16,
                borderTopColor: '#0075A9',
                borderTopWidth: focused ? 4 : 0,
                width: 15,
              }}>
              <Image
                style={{alignSelf: 'center', width: 25, height: 25}}
                resizeMode={'contain'}
                source={
                  focused
                    ? require('../../assets/mdi_bell-badge-outline2.png')
                    : require('../../assets/mdi_bell-badge-outline.png')
                }
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="DSetting"
        component={DSetting}
        options={{
          tabBarVisible: false,
          tabBarLabel: '',
          unmountOnBlur: true,
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                padding: 16,
                borderTopColor: '#0075A9',
                borderTopWidth: focused ? 4 : 0,
                width: 15,
              }}>
              <Image
                style={{alignSelf: 'center', width: 25, height: 25}}
                resizeMode={'contain'}
                source={
                  focused
                    ? require('../../assets/ph_gear-six-light2.png')
                    : require('../../assets/ph_gear-six-light.png')
                }
              />
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
