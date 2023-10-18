import { View, Text, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';

import CustomInput from './CustomInput';
import CustomButton from './CustomButton';

const AddCreditModal = ({ isVisibleTwo, onBackdropPress, item, onCloseModal }) => {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState('');
  const [comment, setComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Function to add credit data to Firestore

  // Function to add credit data to Firestore

  const handleAddCredit = async () => {
    setIsUploading(true);

    try {
      const amountValue = parseFloat(amount) || 0; // Parse amount as a number, default to 0 if parsing fails
      const fromValue = from || '';
      const commentValue = comment || '';

      const clientData = {
        amount: amountValue,
        platform: fromValue,
        comment: commentValue,
        userid: item.id,
        beneficiaryName: item.name,
        type: 'credit',
        timestamp: firestore.FieldValue.serverTimestamp(),
        transactionId: '',
      };


      const documentRef = await firestore().collection('Transactions').add(clientData);

      // Update the document with the actual document ID
      await documentRef.update({
        transactionId: documentRef.id,
      });

      // Clear form fields after successful upload
      setAmount('');
      setFrom('');
      setComment('');

      setIsUploading(false);

      Alert.alert(
        'Payment Successful',
        'Debt has been successfully added',
        [
          {
            text: 'OK',
            onPress: onCloseModal,
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log('Something went wrong', error);
      setIsUploading(false);
      Alert.alert('Error', 'An error occurred while uploading data.');
    }
  };

  // Check if the "amount" state is empty or invalid
  const isAmountEmptyOrInvalid = !amount || parseFloat(amount) <= 0;

  // ...



  return (
    <Modal
      animationIn="slideInUp" // Use slide-in animation when modal appears
      animationOut="slideOutDown" // Use slide-out animation when modal disappears
      isVisible={isVisibleTwo}
      style={{ margin: 0 }}
      backdropOpacity={0.5}
      onBackdropPress={onBackdropPress}>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 360,
          backgroundColor: '#efefef',
        }}>
        <View style={{ margin: 35 }}>
          <Text style={{ color: "black", fontWeight: "bold" }}>Amount:</Text>
          <CustomInput borderRadius={8} placeholder={"Amount"} onChangeText={amount => setAmount(amount)} keyboardType={"numeric"} />
          <Text style={{ color: "black", fontWeight: "bold" }}>From:(Platform)</Text>
          <CustomInput borderRadius={8} placeholder={"mpesa/paytym/bank e.t.c"} onChangeText={from => setFrom(from)} />
          <Text style={{ color: "black", fontWeight: "bold" }}>Comment:</Text>
          <CustomInput borderRadius={8} placeholder={"enter any comment"} onChangeText={comment => setComment(comment)} />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {isUploading ? <ActivityIndicator /> : <CustomButton title={"Add Credit"} type={"secondary"} onPress={handleAddCredit} disabled={isAmountEmptyOrInvalid} />}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCreditModal;
