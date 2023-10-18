import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Notes = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotes = async () => {
    try {
      const notesSnapshot = await firestore().collection('Notes').orderBy('timestamp', 'desc').get();
      const notesData = notesSnapshot.docs.map((doc) => doc.data());
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setRefreshing(false); // Turn off refresh indicator
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true); // Turn on refresh indicator
    fetchNotes();
  };

  const trimText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
    onPress={() => navigation.navigate('NotesDetails', { note: item })}
    style={{ backgroundColor: 'white', margin: 10, padding: 10, borderRadius: 10, borderColor: 'gray', borderWidth: 1 }}>
      <Text style={{ fontWeight: 'bold', color: "black" }}>{trimText(item.title, 15)}</Text>
      <Text style={{ color: "gray" }}>{trimText(item.body, 15)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ backgroundColor: '#D5E3F0', flex: 1 }}>
      <View style={{ backgroundColor: '#191970', height: 100, justifyContent: 'flex-end' }}>
        <View style={{ margin: 20 }}>
          <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold', marginBottom: 20 }}>My Notes</Text>
        </View>
      </View>
      <TouchableOpacity style={{ backgroundColor: 'white', height: 60 }} onPress={() => navigation.navigate('AddNote')}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 20, color: '#1b1b1b' }}>+ New Note</Text>
      </TouchableOpacity>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default Notes;
