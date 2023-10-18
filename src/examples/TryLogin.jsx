import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import CustomButton from '../components/shared/CustomButton';
import CustomInput from '../components/shared/CustomInput';
import { AuthContext } from './AuthProvider';

const TryLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      await login(email.trim(), password);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#efefef" }}>
      <View style={{ backgroundColor: "white", padding: 20, elevation: 2, borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>Email</Text>
          <CustomInput
            placeholder={'E-mail'}
            value={email}
            onChangeText={userEmail => setEmail(userEmail)}
            height={50}
            width={300}
            borderRadius={10}
          />
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>Password</Text>
          <CustomInput
            placeholder={'password'}
            secureTextEntry={true}
            value={password}
            onChangeText={userPassword => setPassword(userPassword)}
            height={50}
            width={300}
            borderRadius={10}
          />
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {error && (
              <Text style={{ color: 'blue', marginBottom: 10 }}>email or password is incorrect</Text>
            )}
            <CustomButton title={"Login"} type={"primary"} onPress={handleLogin} />
          </>
        )}
        {/* Add your Google login button here */}
      </View>
    </View>
  )
}

export default TryLogin;
