import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import firestore from '@react-native-firebase/firestore';




const Beneficiaries = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  // search
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  const [originalClients, setOriginalClients] = useState([]); // Store the original list of clients

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setRefreshing(true); // Start refreshing

      const querySnapshot = await firestore().collection('Clients').get();
      const clientList = [];

      querySnapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data();
        const client = {
          id: documentSnapshot.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          level: data.level || '',
          balance: data.balance || '',
        };
        clientList.push(client);
      });

      // Sort the clientList array by the first letter of the name
      clientList.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      setClients(clientList);
      setOriginalClients(clientList); // Store the original list of clients

      console.log('clients:', clients);

    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setRefreshing(false); // Stop refreshing
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      // If the query is empty, show all clients
      setFilteredClients([]);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      // Check for keywords like "debt" or "credit" in the search query
      if (lowerCaseQuery === 'debt') {
        const filtered = originalClients.filter((item) => item.balance < 0);
        setFilteredClients(filtered);
      } else if (lowerCaseQuery === 'credit') {
        const filtered = originalClients.filter((item) => item.balance > 0);
        setFilteredClients(filtered);
      } else {
        // Filter clients based on the name if no keyword matches
        const filtered = originalClients.filter((client) =>
          client.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredClients(filtered);
      }
    }
  };

  // ...
  const formatNumberWithCommas = (number) => {
    return number.toLocaleString();
  };

  const renderClientItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BeneficiaryDetails', { item })}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", color: "#36454F", fontSize: 18, marginBottom: 5 }}>{item.name}</Text>
        <Text style={{ color: item.balance < 0 ? 'red' : 'green', fontWeight: "bold" }}>
          {formatNumberWithCommas(item.balance)}
        </Text>
      </View>
      {item.phone ? <Text style={{ fontWeight: "bold", color: "gray", margin: 3 }}>{item.phone}</Text> : null}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", color: "gray", margin: 3 }}>{item.email}</Text>
        <Text style={{
          color: "black",
          margin: 5,
          fontWeight: "700"
        }}><FontAwesome6
            name={'medal'}
            size={12}
            color={'#1b1b1b'}
            style={{ marginEnd: 10 }}
          />{item.level}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Clients</Text>
        <View
          style={styles.searchButton}
          onPress={() => {
            // Handle search button press
          }}
        >
          <Ionicons name="search" size={20} color="white" />
          <TextInput placeholder={"search"} style={{ width: 300, height: 50, borderBottomColor: "white", borderBottomWidth: 1, color: "white", fontSize: 18 }} placeholderTextColor="white" onChangeText={handleSearch} value={searchQuery} />
        </View>
      </View>

      {/* Add New Client Button and filter*/}
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBeneficiary')}>
          <Text style={styles.addButtonLabel}>+ Add New Client</Text>
        </TouchableOpacity >
      </View>
      {/* Client List */}

      {/* Client List */}
      {filteredClients.length === 0 ? (
        <View style={{ justifyContent: "center", alignItems: "center", }}>
          <Text style={{ color: "red", fontWeight: "bold", fontSize: 18 }}>
            {searchQuery
              ? 'Search did not match any clients'
              : null}
          </Text>
        </View>
      ) : (
        null
      )}
      <FlatList
        data={filteredClients.length > 0 ? filteredClients : clients}
        keyExtractor={(item) => item.id}
        renderItem={renderClientItem}
        style={styles.flatList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchClients}
            tintColor="#000080"
            title="Refreshing..."
            titleColor="#000080"
            colors={['#000080']}
            progressBackgroundColor="white"
          />
        }
      />
      {/* Activity Indicator */}
      {refreshing && (
        <View style={styles.activityIndicatorContainer}>
          {/* <ActivityIndicator size="large" color="#000080" /> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D5E3F0',
    flex: 1,
  },
  header: {
    backgroundColor: '#191970',
    height: 130,
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchButton: {
    flexDirection: 'row',
    backgroundColor: '#5D3FD3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: "center"
  },
  searchButtonText: {
    color: 'white',
    fontSize: 17,
    marginLeft: 20,
  },
  addButton: {
    backgroundColor: 'white',
    height: 60,
    justifyContent: 'center',
  },
  addButtonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 20,
    color: '#191970',
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    margin: 12,
    borderRadius: 10,
    elevation: 2,
  },
  flatList: {
    flex: 1,
  },
  activityIndicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Beneficiaries;
