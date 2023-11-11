// App.js
import React, { useContext, useState, useEffect } from 'react'
import TryLogin from './src/examples/TryLogin';
import auth from '@react-native-firebase/auth';
import AppTabScreens from './src/nav/mainNav/MainNav/MainNav';
import { AuthContext } from './src/examples/AuthProvider';

const App = () => {
  const { userIn, setUserIn } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (userIn) => {
    setUserIn(userIn);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  return userIn ? <AppTabScreens /> : <TryLogin />;
}

export default App;
