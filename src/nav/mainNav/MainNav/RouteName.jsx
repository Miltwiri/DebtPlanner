import { NavigationContainer } from '@react-navigation/native';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../auth/authContext/AuthProvider';
import auth from '@react-native-firebase/auth';
import AppTabScreens from './MainNav';
import Login from '../../../auth/authStack/Login';



const RouteName = () => {

    const { user, setUser } = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);

    const onAuthStateChanged = (user) => {
      console.log('onAuthStateChanged called with user:', user); // Debugging line
      setUser(user);
      if (initializing) setInitializing(false);
    }

    useEffect(() => {
      console.log('useEffect for onAuthStateChanged'); // Debugging line
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber;
    }, []);

    console.log('user:', user); // Debugging line

    if (initializing) return null;
    return (
        <NavigationContainer>
          {user ? <AppTabScreens/> : <Login/>}
        </NavigationContainer>
    );
  };

export default RouteName