import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './RootStack';
import DoctorBottomTab from './DoctorBottomTab';
function AppNavigator(props) {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
export default AppNavigator;
