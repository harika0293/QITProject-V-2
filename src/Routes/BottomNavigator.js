import React from 'react';
import {Image, View, Dimensions, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../PNavigation/Home';
import Analytics from '../PNavigation/Analytics';
import Notification from '../PNavigation/Notification';
import PatientChat from '../PScreen/PatientChat';
const width = Dimensions.get('window').width;
const BottomTab = createBottomTabNavigator();
function BottomNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          width: width,
          height: 60,
          marginTop: 20,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
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
        name="Analytics"
        component={Analytics}
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
                    ? require('../../assets/gridicons_stats-alt-3.png')
                    : require('../../assets/gridicons_stats-alt-2.png')
                }
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Notification"
        component={Notification}
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
                    ? require('../../assets/ep_bell-filled2.png')
                    : require('../../assets/ep_bell-filled.png')
                }
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={PatientChat}
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
                    ? require('../../assets/bx_message-square-detail2.png')
                    : require('../../assets/bx_message-square-detail.png')
                }
              />
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
export default BottomNavigator;
