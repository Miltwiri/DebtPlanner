import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../authContext/AuthProvider';

import CustomInput from '../../components/shared/CustomInput';
import CustomButton from '../../components/shared/CustomButton';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authContext = useContext(AuthContext);
  const { login } = authContext;


  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#191970", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white", fontSize: 23, fontWeight: "900" }}>Awilo's Planner</Text>
      
      <CustomInput
        placeholder={'E-mail'}
        value={email}
        onChangeText={userEmail => setEmail(userEmail)}
        height={50}
        width={300}
      />
      <CustomInput
        placeholder={'password'}
        secureTextEntry={true}
        value={password}
        onChangeText={userPassword => setPassword(userPassword)}
        height={50}
        width={300}
      />
      <CustomButton title={"Login"} type={"primary"} onPress={handleLogin} />
    </View>
  )
}

export default Login
