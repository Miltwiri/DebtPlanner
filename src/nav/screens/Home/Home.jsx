import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, Image, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import TransactionListItem from '../../../components/shared/TransactionListItem';

const Home = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyCreditSum, setDailyCreditSum] = useState({});
  const [dailyDebtSum, setDailyDebtSum] = useState({});

  const [refreshing, setRefreshing] = useState(false); // Add refreshing state


  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch only the latest transactions
  const fetchTransactions = async () => {
    try {
      const transactionSnapshot = await firestore()
        .collection('Transactions')
        .orderBy('timestamp', 'desc')
        .get();

      const transactionList = [];

      transactionSnapshot.forEach((doc) => {
        const data = doc.data();
        transactionList.push({
          id: doc.id,
          amount: data.amount || 0,
          type: data.type || '',
          benef: data.beneficiaryName || '',
          platform: data.platform || '',
          timestamp: data.timestamp || '',
          comment: data.comment || '',
          // Add other fields to include in the transaction object
        });
      });

      setTransactions(transactionList);
      calculateDailySums(transactionList); // Calculate credit and debt sums here
      setLoading(false);
      setRefreshing(false); // Set refreshing state to false here
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setRefreshing(false); // Set refreshing state to false in case of an error
    }
  };



  const calculateDailySums = (transactionList) => {
    const dailyCreditSums = {};
    const dailyDebtSums = {};
  
    transactionList.forEach((transaction) => {
      // Check if the transaction has a valid timestamp
      if (transaction.timestamp && transaction.timestamp.toDate) {
        const date = transaction.timestamp.toDate(); // Convert timestamp to JavaScript Date object
        const dateString = date.toISOString().split('T')[0]; // Extract the date string (YYYY-MM-DD)
  
        if (transaction.type === 'credit') {
          if (dailyCreditSums[dateString]) {
            dailyCreditSums[dateString] += parseFloat(transaction.amount);
          } else {
            dailyCreditSums[dateString] = parseFloat(transaction.amount);
          }
        } else if (transaction.type === 'debt') {
          if (dailyDebtSums[dateString]) {
            dailyDebtSums[dateString] += parseFloat(transaction.amount);
          } else {
            dailyDebtSums[dateString] = parseFloat(transaction.amount);
          }
        }
      } else {
        console.error('Invalid timestamp for transaction:', transaction);
      }
    });

    setDailyCreditSum(dailyCreditSums);
    setDailyDebtSum(dailyDebtSums);
  };


  // Format a number with commas
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleRefresh = () => {
    setRefreshing(true); // Set refreshing state to true
    fetchTransactions(); // Fetch new data
    setRefreshing(false); // Set refreshing state to true
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#D5E3F0", flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#000080']} // Customize the color of the refresh indicator
        />
      }
    >
      <StatusBar backgroundColor="#191970" />
      <View style={{ backgroundColor: "#191970", height: 130, justifyContent: "flex-end" }}>
        <View style={{ margin: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>Hello,</Text>
            <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>Flamboyant</Text>
          </View>
          <View>
            <Image source={require("../../../../assets/images/Awilo.jpeg")} style={{ height: 50, width: 50, borderRadius: 25, borderWidth: 1, borderColor: "white" }} />
          </View>
        </View>
      </View>
      {/* body */}
      <View style={{ margin: 10 }}>
        {/* totals */}
        <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ justifyContent: "space-between", alignItems: "center", borderRadius: 10, backgroundColor: "white", elevation: 3, height: 150, width: 175, padding: 10 }}>
            <View style={{ borderBottomColor: "#FFBF00", borderBottomWidth: 1 }}><Text style={{ color: "black" }}>YOU'VE SENT </Text></View>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 25 }}>₹{' '}
              {formatNumberWithCommas(
                Object.values(dailyDebtSum).reduce((acc, val) => acc + val, 0)
              )}</Text>
            <Text style={{ color: "green", fontSize: 11 }}>Money Sent </Text>
          </View>
          <View style={{ justifyContent: "space-between", alignItems: "center", borderRadius: 10, backgroundColor: "white", elevation: 3, height: 150, width: 175, padding: 10 }}>
            <View style={{ borderBottomColor: "#FFBF00", borderBottomWidth: 1 }}><Text style={{ color: "black" }}>YOU'VE RECEIVED </Text></View>
            <Text style={{ color: "green", fontWeight: "bold", fontSize: 25 }}>
              ₹{' '}
              {formatNumberWithCommas(
                Object.values(dailyCreditSum).reduce((acc, val) => acc + val, 0)
              )}
            </Text>
            <Text style={{ color: "red", fontSize: 10 }}>Total Credits </Text>
          </View>
        </View>
        {/* transactions overview*/}
        <View style={{ marginVertical: 20, backgroundColor: "white", borderRadius: 8 }}>
          <View style={{ padding: 10, borderBottomColor: "#FFBF00", borderBottomWidth: 1, alignItems: "center" }}>
            <Text style={{ color: "#000080", fontWeight: "bold", fontSize: 15, padding: 10 }}>Transactions Made</Text>
          </View>
          {/* show only the last 10 transactions */}
          {transactions.slice(0, 10).map((transaction) => (
            <TransactionListItem key={transaction.id} transaction={transaction} />
          ))}

          {loading && <ActivityIndicator size="large" color="#000080" />}
          <TouchableOpacity
            style={{ alignItems: 'center', padding: 10 }}
            onPress={() => navigation.navigate('AllTransactionsScreen', { transactions })}>
            <Text style={{ color: 'blue', fontWeight: 'bold' }}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default Home