import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../PScreen/SplashScreen';
import OnBoarding from '../PScreen/OnBoarding';
import ALoader from '../PScreen/ALoader';
import Login from '../PScreen/Login';
import PForgotPwd from '../PScreen/PForgotPwd';
import DForgotPwd from '../DScreen/DForgotPwd';
import OTPScreen from '../PScreen/OTPScreen';
import SucessScreen from '../PScreen/SucessScreen';
import BottomNavigator from './BottomNavigator';
import SelectDoctor from '../PScreen/SelectDoctor';
import PSetting from '../PScreen/PSetting';
import PHelp from '../PScreen/PHelp';
import PPatientDetails from '../PScreen/PPatientDetails';
import DLogin from '../DScreen/DLogin';
import DOTPScreen from '../DScreen/DOTPScreen';
import DSuccess from '../DScreen/DSuccess';
import DSetting from '../DScreen/DSetting';
import DEditProfile from '../DScreen/DEditProfile';
import DoctorBottomTab from './DoctorBottomTab';
import DChat from '../DScreen/DChat';
import DDetails from '../DScreen/DDetails';
import DFilter from '../DScreen/DFilter';
import DHelp from '../DScreen/DHelp';

import {connect, useSelector} from 'react-redux';
const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = () => (
  <Stack.Navigator>
    <RootStack.Screen
      name="OnBoarding"
      component={OnBoarding}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="ALoader"
      component={ALoader}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="OTPScreen"
      component={OTPScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SucessScreen"
      component={SucessScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="DLogin"
      component={DLogin}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="SelectDoctor"
      component={SelectDoctor}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="DEditProfile"
      component={DEditProfile}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="DOTPScreen"
      component={DOTPScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="DSuccess"
      component={DSuccess}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="PForgotPwd"
      component={PForgotPwd}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="DForgotPwd"
      component={DForgotPwd}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);
const RootStackNavigator = () => {
  const authUser = useSelector(state => state.auth);
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="AuthStack"
        component={AuthStack}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="DoctorBottomTab"
        component={DoctorBottomTab}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="Details"
        component={DDetails}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="DFilter"
        component={DFilter}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="DDetails"
        component={DDetails}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="PSetting"
        component={PSetting}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="PPatientDetails"
        component={PPatientDetails}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="PHelp"
        component={PHelp}
        options={{headerShown: false}}
      />

      <RootStack.Screen
        name="DChat"
        component={DChat}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="DSetting"
        component={DSetting}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="DHelp"
        component={DHelp}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  );
};
export default RootStackNavigator;
