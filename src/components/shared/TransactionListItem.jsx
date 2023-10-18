import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TransactionListItem = ({ transaction }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.transactionInfo}>
        <Text style={{fontWeight:"bold", color:"gray"}}>{transaction.benef}</Text>
        <Text
                  style={{
                    color: transaction.type === 'credit' ? 'green' : 'red',
                    fontWeight: '600',
                    fontSize: 16,
                  }}
                >
                  {transaction.type === 'credit' ? '+' : '-'} {transaction.amount}
                </Text>
        {/* Add other transaction details as needed */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFBF00',
  },
  transactionInfo: {
    flex: 1,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  transactionType: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionAmount: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default TransactionListItem;
