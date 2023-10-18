import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import UpdateOrDeleteTransactionModal from '../../../components/shared/UpdateOrDeleteTransactionModal';

const AllTransactionsScreen = ({ route }) => {

  //init state
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  // Receive transactions from route params
  const { transactions } = route.params;

  // Function to format timestamp to human-readable date and time

  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) {
        throw new Error('Timestamp is missing or invalid');
      }

      // Convert Firebase Firestore Timestamp to a JavaScript Date object
      const date = timestamp.toDate();

      if (isToday(date)) {
        return `${formatDistanceToNow(date)} ago`;
      } else if (isYesterday(date)) {
        // Format time with hours and minutes (without seconds)
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `Yesterday ${formattedTime}`;
      } else {
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${formattedDate} ${formattedTime}`;
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error.message);
      return 'N/A';
    }
  };
  //Transaction details modal
  const toggleModal = (transaction) => {
    setSelectedTransaction(transaction);
    setLoadingModal(true);
    setModalVisible(!isModalVisible);
    setLoadingModal(false);
  };
  // const closeAddDebtModal = () => {
  //   setSelectedTransaction(null);
  //   setModalVisible(false);
  //   setModalVisible(false);
  // }
  // Function to update a transaction
  const updateTransaction = (updatedData) => {
    // Implement the logic to update the transaction data
    // After updating, close the modal.
    // closeModal();
  };

  // Function to delete a transaction
  const deleteTransaction = () => {
    // Implement the logic to delete the transaction
    // After deleting, close the modal.
    // closeModal();
  };

  // Define a renderItem function for the FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleModal(item)}
      style={{ padding: 10, borderBottomColor: "gray", borderBottomWidth: 1, margin: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold", color: "black" }}>{item.benef}</Text>
        <Text
          style={{
            color: item.type === 'credit' ? 'green' : 'red',
            fontWeight: '600',
            fontSize: 16,
          }}
        >
          {item.type === 'credit' ? '+' : '-'} {item.amount}
        </Text>
      </View>
      <Text style={{ fontWeight: "bold", fontSize: 15, color: "gray" }}>{formatTimestamp(item.timestamp)}</Text>
      <Text style={{color:"gray"}}>{item.platform}-{' '}{item.comment}</Text>
      <View>
      </View>
      {/* Render transaction details here */}
      {/* Add other transaction details as needed */}
    </TouchableOpacity>
  );

  return (
    <View style={{ backgroundColor: '#D5E3F0', flex: 1 }}>
      <View style={{ backgroundColor: '#191970', height: 100, justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold', marginStart: 10 }}>Transactions</Text>
      </View>

      {/* Render FlatList with transactions */}
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <UpdateOrDeleteTransactionModal
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
        transaction={selectedTransaction}
        updateTransaction={updateTransaction}
        deleteTransaction={deleteTransaction}
        benef={selectedTransaction ? selectedTransaction.benef : ''}
      />
      {/* loading modal indicator */}
      {loadingModal && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        }}>
          <ActivityIndicator size="large" color="#000080" />
        </View>
      )}
    </View>
  );
};

export default AllTransactionsScreen;
