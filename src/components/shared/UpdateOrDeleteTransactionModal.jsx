import { View, Text, Alert, ActivityIndicator,  } from 'react-native';
import React, { useState, useEffect } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';

import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';


const UpdateOrDeleteTransactionModal = ({ isVisible, transaction, updateTransaction, deleteTransaction, onBackdropPress, benef }) => {
    const [updatedData, setUpdatedData] = useState({
        amount: '',
        platform: '',
        comment: '',
        type: '',
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (transaction) {
            setUpdatedData({
                amount: String(transaction.amount),
                platform: transaction.platform,
                comment: transaction.comment || '',
                type: transaction.type,
            });
        }
    }, [transaction]);

    useEffect(() => {
        // Check if there are changes in updatedData compared to the original transaction data
        if (
            updatedData.amount !== String(transaction?.amount || '') ||
            updatedData.platform !== (transaction?.platform || '') ||
            updatedData.comment !== (transaction?.comment || '') ||
            updatedData.type !== (transaction?.type || '')
        ) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [updatedData, transaction]);

    // Function to handle the update operation
    const handleUpdate = async () => {
        try {
            setIsUpdating(true);

            const updatedTransactionData = {
                amount: parseFloat(updatedData.amount),
                platform: updatedData.platform,
                comment: updatedData.comment,
                type: updatedData.type,
            };

            // Update the transaction document in the Firestore collection
            await firestore()
                .collection('Transactions')
                .doc(transaction?.id)
                .update(updatedTransactionData);

            // Call the parent component's updateTransaction function to handle any necessary state updates or UI changes
            updateTransaction(updatedTransactionData);

            // Close the modal
            onBackdropPress();

            // Show an alert for successful update
            Alert.alert('Success', 'Transaction updated successfully', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Handle the OK button press if needed
                        setIsUpdating(false);
                    },
                },
            ]);
        } catch (error) {
            console.error('Error updating transaction:', error);
            // Handle the error here, e.g., show an error message
            Alert.alert('Error', 'Failed to update transaction. Please try again later.', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Handle the OK button press if needed
                    },
                },
            ]);
        }

    };

    // Function to handle the delete operation
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            // Delete the transaction document from the Firestore collection
            await firestore()
                .collection('Transactions')
                .doc(transaction?.id)
                .delete();

            // Call the parent component's deleteTransaction function to handle any necessary state updates or UI changes
            deleteTransaction();

            // Close the modal
            onBackdropPress();
            // Show an alert for successful update
            Alert.alert('Success', 'Transaction Deleted!', [
                {
                    text: 'OK',
                    onPress: () => {
                        setIsDeleting(false);
                    },
                },
            ]);
        } catch (error) {
            console.error('Error deleting transaction:', error);
            // Handle the error here, e.g., show an error message
        }
    };


    return (
        <Modal
            isVisible={isVisible}
            style={{ margin: 0 }}
            backdropOpacity={0.5}
            onBackdropPress={onBackdropPress}>
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: 450,
                    backgroundColor: '#efefef',
                    borderTopEndRadius: 20,
                    borderTopStartRadius: 20
                }}>
                <View style={{ margin: 20 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: "#000080", fontWeight: "bold", fontSize: 20 }}>{benef}</Text>
                        <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "blue", fontWeight: "bold" }} onPress={onBackdropPress}>Close</Text>
                            <Entypo
                                Entypo name={'cross'}
                                color={'blue'}
                                size={27}
                                style={{ marginEnd: 10 }}
                                onPress={onBackdropPress}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: "black", fontWeight: "bold" }}>Amount:</Text>
                    <CustomInput
                        borderRadius={8}
                        keyboardType={"numeric"}
                        onChangeText={(text) => {
                            setUpdatedData({ ...updatedData, amount: text });
                            setHasChanges(true); // Enable the "Update" button when the value changes
                        }}
                        value={updatedData.amount}
                        placeholder="Amount"
                    />
                    <Text style={{ color: "black", fontWeight: "bold" }}>To:(Platform)</Text>
                    <CustomInput
                        borderRadius={8} placeholder={"mpesa/paytym/bank e.t.c"}
                        onChangeText={(text) => {
                            setUpdatedData({ ...updatedData, platform: text });
                            setHasChanges(true); // Enable the "Update" button when the value changes
                        }}
                        value={updatedData.platform} />
                    <Text style={{ color: "black", fontWeight: "bold" }}>Comment:</Text>
                    <CustomInput
                        borderRadius={8}
                        placeholder={"enter any comment"}
                        onChangeText={(text) => {
                            setUpdatedData({ ...updatedData, comment: text });
                            setHasChanges(true); // Enable the "Update" button when the value changes
                        }}
                        value={updatedData.comment} />
                    {/* I will replace this with a debit credit dropdown */}
                    <Text style={{ color: "black", fontWeight: "bold" }}>Type:</Text>
                    <Picker
                        selectedValue={updatedData.type}
                        onValueChange={(itemValue) => {
                            setUpdatedData({ ...updatedData, type: itemValue });
                            setHasChanges(true); // Enable the "Update" button when the value changes
                        }}
                    >
                        <Picker.Item label="Debt" value="debt" style={{color:"red"}}/>
                        <Picker.Item label="Credit" value="credit" style={{color:"green"}}/>
                    </Picker>
                    <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                        {isUpdating || isDeleting ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <Text></Text>
                                <CustomButton title={'Update '} type={'primary'} disabled={!hasChanges} onPress={handleUpdate} />
                                <Entypo
                                    name={'trash'}
                                    color={'maroon'}
                                    size={23}
                                    style={{ marginEnd: 10 }}
                                    onPress={handleDelete}
                                />
                            </>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default UpdateOrDeleteTransactionModal;
