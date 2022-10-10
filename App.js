import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import AppNavigator from './src/Routes/AppNavigator';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import AppReducer from './src/reducers';
const store = createStore(AppReducer, applyMiddleware(thunk));
const App = () => {
  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <AppNavigator />
      </ApplicationProvider>
    </Provider>
  );
};
export default App;
const styles = StyleSheet.create({});
