// AppWrapper.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/examples/AuthProvider';
import App from './App';

function AppWrapper() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default AppWrapper;
