import { View, Text, FlatList, RefreshControl, Alert, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';

import { useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';

import AddDebtModal from '../../../components/shared/AddDebtModal';
import AddCreditModal from '../../../components/shared/AddCredit';

import { TouchableOpacity } from 'react-native-gesture-handler';


const BeneficiaryDetails = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();

  //get transactions
  // Get transactions
  const [userTransactions, setUserTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [calcBalance, setCalcBalance] = useState(0);

  useEffect(() => {
    fetchUserTransactions();
  }, []);

  useEffect(() => {
    // Calculate the balance
    const calcBalance = calculateBalance();
    setCalcBalance(calcBalance); // Update the balance state

    // Update the balance in Firestore whenever it changes
    updateBalanceInFirestore(calcBalance);
  }, [userTransactions, calcBalance]); // This useEffect runs whenever userTransactions changes

  const fetchUserTransactions = async () => {
    try {
      setRefreshing(true); // Start refreshing

      const querySnapshot = await firestore()
        .collection('Transactions')
        .where('beneficiaryName', '==', item.name) // Filter by beneficiaryName
        .get();

      const userTransactionsList = [];

      querySnapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data();
        const transaction = {
          amount: data.amount || '',
          type: data.type || '',
          comment: data.comment || '',
          platform: data.platform || '',
          timestamp: data.timestamp || '',
          // Add other fields you want to include in the transaction object
        };
        userTransactionsList.push(transaction);
      });

      setUserTransactions(userTransactionsList);

    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setRefreshing(false); // Stop refreshing
    }
  };
  // Function to format timestamp to human-readable date and time

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return 'N/A'; // Handle "Invalid date" gracefully
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
  };

  //get transactions end

  //show modal start
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleTwo, setModalVisibleTwo] = useState(false);

  const [transactionOngoing, setTransactionOngoing] = useState(false);


  const toggleModal = () => {
    setTransactionOngoing(true);
    setModalVisible(!isModalVisible);
    setTransactionOngoing(false);
  };

  const toggleModal2 = () => {
    setModalVisibleTwo(!isModalVisibleTwo);
    setTransactionOngoing(false);
  };
  //show modal end

  //calculate balance
  const calculateBalance = () => {
    let creditSum = 0;
    let debtSum = 0;

    userTransactions.forEach((transaction) => {
      if (transaction.type === 'credit') {
        creditSum += parseFloat(transaction.amount);
      } else if (transaction.type === 'debt') {
        debtSum += parseFloat(transaction.amount);
      }
    });

    return creditSum - debtSum;
  };

  const balance = calculateBalance();
  // Format a number with commas
  const formatNumberWithCommas = (number) => {
    return number.toLocaleString();
  };

  // Sort userTransactions by timestamp in descending order
  const sortedTransactions = [...userTransactions].sort((a, b) => b.timestamp - a.timestamp);

  const closeAddCreditModal = () => {
    setModalVisibleTwo(false);
    fetchUserTransactions();
  };
  const closeAddDebtModal = () => {
    setModalVisible(false);
    fetchUserTransactions();
  }
  //delete client
  const deleteClient = () => {
    try {
      // Show a confirmation dialog to the user here (using Alert)
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this client?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              // User confirmed, proceed with deletion
              firestore()
                .collection('Clients')
                .doc(item.id)
                .delete()
                .then(() => {
                  // Successfully deleted, navigate back to the previous screen or a different screen
                  navigation.goBack(); // You can adjust this navigation action as needed
                })
                .catch(error => {
                  console.error('Error deleting client:', error);
                });
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error showing confirmation dialog:', error);
    }
  };

  // Update balance function
  const updateBalanceInFirestore = async (balance) => {
    try {
      await firestore()
        .collection('Clients')
        .doc(item.id)
        .update({
          balance: balance,
        });
      console.log('Balance updated successfully.', balance);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };
  //share transactions
  const sendWhatsAppMessageWithTransactions = (phoneNumber) => {
    const formattedTransactions = userTransactions.map((transaction) => {
      let formattedTransaction = `_${formatTimestamp(transaction.timestamp)}_\n`;

      if (transaction.type === 'debt') {
        formattedTransaction += `${transaction.type}\n*Amount*: *-${transaction.amount}*\n`;
      } else {
        formattedTransaction += `${transaction.type}\n*Amount*: *${transaction.amount}*\n`;
      }

      if (transaction.comment) {
        formattedTransaction += `*Comment*: ${transaction.comment}\n`;
      }
      return formattedTransaction + '\n';
    });

    // Calculate the balance and format it as bold
    const balanceText = `*Balance*: *${formatNumberWithCommas(balance)}*\n\n`;

    const message = `Transactions for ${item.name}:\n\n${balanceText}${formattedTransactions.join('')}`;
    // Define the recipient phone number
    const recipientPhone = item.phone ? item.phone : '+918431687054';

    const whatsappUrl = `whatsapp://send?phone=${recipientPhone}&text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          console.log("WhatsApp is not installed on this device.");
        }
      })
      .catch((error) => {
        console.error("Error opening WhatsApp:", error);
      });
  };

  //clear transactions
  const clearTransactions = () => {
    try {
      Alert.alert(
        'Confirm Clear Transactions',
        'Are you sure you want to clear all transactions for this client?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              // User confirmed, proceed with clearing transactions
              firestore()
                .collection('Transactions')
                .where('beneficiaryName', '==', item.name)
                .get()
                .then((querySnapshot) => {
                  const batch = firestore().batch();
                  querySnapshot.forEach((documentSnapshot) => {
                    const docRef = firestore().collection('Transactions').doc(documentSnapshot.id);
                    batch.delete(docRef);
                  });
                  return batch.commit();
                })
                .then(() => {
                  // Transactions successfully cleared, refresh the list
                  fetchUserTransactions();
                })
                .catch((error) => {
                  console.error('Error clearing transactions:', error);
                });
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error showing confirmation dialog:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#D5E3F0" }}>
      <View style={{ backgroundColor: "#191970", height: 130 }}>
        <View style={{ flexDirection: "row", alignItems: "center", margin: 17 }}>
          <Ionicons name="chevron-back" size={25} color="white" />
          <Text style={{ fontWeight: "300", fontSize: 20, color: "white" }} onPress={navigation.goBack}>Clients</Text>
        </View>
        <Text style={{ marginStart: 20, fontWeight: "bold", fontSize: 25, color: "white" }}>{item.name}</Text>
      </View>
      <View style={{ backgroundColor: "white", height: 183 }}>
        <View style={{ padding: 10, borderBottomColor: "orange", borderBottomWidth: 0.3 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {item.phone ? <Text style={{ color: "#191970", fontWeight: "bold", marginBottom: 7, fontSize: 16 }}>
              <Fontisto
                name={'phone'}
                size={10}
                color={'#000080'}
                style={{ marginEnd: 10 }}
              />{' '}{item.phone}</Text> : <Text></Text>}
            <Entypo
              Entypo name={'trash'} color={'#000080'} size={23}
              style={{ marginEnd: 10 }}
              onPress={deleteClient}
            />

          </View>
          {item.email ? <Text style={{ color: "#191970", fontWeight: "bold", marginBottom: 7, fontSize: 16 }}><Fontisto
            name={'email'}
            size={12}
            color={'#000080'}
            style={{ marginEnd: 10 }}
          />{' '}{item.email}</Text> : null}
          <Text style={{ color: "#191970", fontWeight: "bold", marginBottom: 7, fontSize: 16 }}><FontAwesome6
            name={'medal'}
            size={12}
            color={'#000080'}
            style={{ marginEnd: 10 }}
          />{' '}{item.level}{' '}Level Client</Text>
        </View>
        <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginEnd: 6 }}>
          <View>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 17 }}>Current Balance</Text>
            <Text style={{ color: balance < 0 ? "red" : "green", fontWeight: "bold", fontSize: 26 }}>₹{''}{formatNumberWithCommas(balance)}</Text>
          </View>
          <TouchableOpacity onPress={() => sendWhatsAppMessageWithTransactions(item.phone)}>
            <Ionicons name="share-social-sharp" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ padding: 15, flexDirection: "row", justifyContent: "space-between" }}>
        {transactionOngoing ? (
          <ActivityIndicator size="large" color="#000080" />
        ) : (
          <>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={{ fontWeight: "bold", color: "#191970", fontSize: 17 }}>
                <FontAwesome name="send" size={18} color="#191970" />{' '}SEND MONEY
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ fontWeight: "bold", color: "#191970", fontSize: 17 }} onPress={toggleModal2}>
                <Ionicons name="download" size={20} color="#191970" />{' '}RECEIVE PAYMENT
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <View style={{ marginHorizontal: 20, borderBottomColor: "orange", borderBottomWidth: 1, marginTop: 20, flexDirection: "row", justifyContent: "space-between", padding: 7 }}>
          <Text style={{ color: "#000080", fontWeight: "bold" }}>TRANSACTIONS</Text>
          {userTransactions.length > 0 && ( // Conditionally render the button
            <Text
              style={{ fontWeight: "bold", color: "gray" }}
              onPress={clearTransactions}
            >
              Clear Transactions
            </Text>
          )}
        </View>

        {/* transaction cards Start */}
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchUserTransactions}
              tintColor="#000080"
              title="Refreshing..."
              titleColor="#000080"
              colors={['#000080']}
              progressBackgroundColor="white"
            />
          }
          data={sortedTransactions} // Use sortedTransactions instead of userTransactions
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: 20, padding: 12, borderBottomColor: "gray", borderBottomWidth: 0.5, }}>
              {/* Render transaction details here */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 15 }}>{formatTimestamp(item.timestamp)}</Text>
                <Text
                  style={{
                    color: item.type === 'credit' ? 'green' : 'red',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                >
                  {item.type === 'credit' ? '+' : '-'} {item.amount}
                </Text>
              </View>
              {item.comment ? <Text style={{ color: "gray", fontWeight: "bold" }}>{item.comment}</Text> : null}
              {item.platform ? <Text style={{ color: "gray", fontWeight: "bold" }}>{item.platform}</Text> : null}
              {/* Add other transaction details as needed */}
            </View>
          )}
        />
        {/* transaction cards end */}
      </View>
      <AddCreditModal
        onBackdropPress={() => setModalVisibleTwo(false)}
        isVisibleTwo={isModalVisibleTwo}
        item={item}
        onCloseModal={closeAddCreditModal}
      />
      <AddDebtModal
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
        item={item}
        onCloseModal={closeAddDebtModal}
      />
      {refreshing && (
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
          {/* <ActivityIndicator size="large" color="#000080" /> */}
        </View>
      )}
    </View>
  )
}

export default BeneficiaryDetails