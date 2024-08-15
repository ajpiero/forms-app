import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import CreateFormScreen from './screens/CreateFormScreen';
import ViewFormsScreen from './screens/ViewFormsScreen';
import FormDetailScreen from './screens/FormDetailScreen';
import store from './store';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Form Creator' }} />
          <Stack.Screen name="CreateForm" component={CreateFormScreen} options={{ title: 'Create New Form' }} />
          <Stack.Screen name="ViewForms" component={ViewFormsScreen} options={{ title: 'View All Forms' }} />
          <Stack.Screen name="FormDetail" component={FormDetailScreen} options={{ title: 'Form Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
