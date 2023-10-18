import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import CustomButton from '../../../components/shared/CustomButton'
import { AuthContext } from '../../../examples/AuthProvider';

const Settings = () => {
  const {logout} = useContext(AuthContext);
  return (
    <View style={{backgroundColor:"#D5E3F0", flex:1, alignItems:"center", justifyContent:"center"}}>
      <CustomButton type={"primary"} title={"Logout "} onPress={() => logout()}/>
    </View>
  )
}

export default Settings