import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import firestore from '@react-native-firebase/firestore';

import { useNavigation } from '@react-navigation/native';

import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../../components/shared/CustomInput';
import CustomButton from '../../../components/shared/CustomButton';



const AddBeneficiary = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleAddClient = async () => {
    setIsUploading(true);

    try {
      // Trim input values to remove white spaces
      const trimmedName = name.trim();
      const trimmedPhone = phone.trim();
      const trimmedEmail = email.trim();
      const trimmedLevel = level.trim();

      //data
      const clientData = {
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        level: trimmedLevel,
        balance: 0,
        // Store the document ID as a field
        documentId: '', // Initialize it as an empty string for now
      };

      // Add the data to Firestore and retrieve the document ID
      const documentRef = await firestore().collection('Clients').add(clientData);

      // Update the document with the actual document ID
      await documentRef.update({
        documentId: documentRef.id,
      });

      // Clear form fields after successful upload
      setName('');
      setPhone('');
      setEmail('');
      setLevel('');

      setIsUploading(false); // Hide the Activity Indicator
      // Show an Alert with a custom "OK" button action
      Alert.alert(
        'Upload Successful',
        'New Client has been Added.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Navigate back when "OK" is pressed
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log('Something went wrong', error);
      setIsUploading(false); // Hide the Activity Indicator
      Alert.alert('Error', 'An error occurred while uploading data.');
    }
  };


  return (
    <ScrollView style={{ backgroundColor: "#D5E3F0", flex: 1 }}>
      <View style={{ backgroundColor: "#191970", height: 200, justifyContent: "space-around", alignItems: "center", flexDirection: "row" }}>
        <Ionicons name={"chevron-back"} size={30} color={"white"} />
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }} onPress={navigation.goBack}>Add a New Beneficiary</Text>
      </View>
      {/* forms */}
      <View style={{ margin: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Fontisto
            name={'person'}
            size={20}
            color={'#000080'}
            style={{ marginEnd: 10 }}
          />
          <View>
            <Text style={{ color: 'gray' }}>Name</Text>
            <CustomInput placeholder={"Full Name"} width={300} borderRadius={10} onChangeText={name => setName(name)} />
          </View>
        </View>
        {/* email */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Fontisto
            name={'phone'}
            size={20}
            color={'#000080'}
            style={{ marginEnd: 10 }}
          />
          <View>
            <Text style={{ color: 'gray' }}>Phone Number</Text>
            <CustomInput placeholder={"Enter Phone"} width={300} borderRadius={10} onChangeText={phone => setPhone(phone)} />
          </View>
        </View>
        {/* email */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Fontisto
            name={'email'}
            size={20}
            color={'#000080'}
            style={{ marginEnd: 10 }}
          />
          <View>
            <Text style={{ color: 'gray' }}>Email</Text>
            <CustomInput placeholder={"Email"} width={300} borderRadius={10} onChangeText={email => setEmail(email)} />
          </View>
        </View>
        {/* level */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome6
            name={'medal'}
            size={20}
            color={'#000080'}
            style={{ marginEnd: 10 }}
          />
          <View>
            <Text style={{ color: 'gray' }}>Level</Text>
            <CustomInput placeholder={"Gold/Silver/Platinum"} width={300} borderRadius={10} onChangeText={level => setLevel(level)} />
          </View>
        </View>
        {/* submit */}
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {isUploading ? (
            <ActivityIndicator size="large" color="#000080" />
          ) : (
            <CustomButton type={"primary"} title={"Submit "} onPress={handleAddClient} />
          )}
        </View>
      </View>
    </ScrollView>
  )
}
export default AddBeneficiary