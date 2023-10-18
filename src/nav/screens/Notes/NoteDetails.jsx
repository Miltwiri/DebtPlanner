import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'; // Import Firebase Firestore
import CustomButton from '../../../components/shared/CustomButton';

const NoteDetails = ({ route, navigation }) => {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);

  // Function to handle changes in the title input
  const handleTitleChange = (text) => {
    setTitle(text);
  };

  // Function to handle changes in the body input
  const handleBodyChange = (text) => {
    setBody(text);
  };

  // Function to update the note in Firestores
  const handleUpdate = async () => {
    try {
      // Use the documentId field to access the document ID
      await firestore().collection('Notes').doc(note.documentId).update({
        title,
        body,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      console.log('Note updated successfully');
      navigation.goBack(); // Navigate back to the Notes screen after updating
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Function to show a confirmation alert before deleting the note
  const confirmDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: handleDelete, // Call the handleDelete function if the user confirms
          style: 'destructive', // This makes the text of the button red for emphasis
        },
      ],
      { cancelable: false }
    );
  };

  // Function to delete the note from Firestore
  const handleDelete = async () => {
    try {
      // Use the documentId field to access the document ID
      await firestore().collection('Notes').doc(note.documentId).delete();
      console.log('Note deleted successfully');
      navigation.goBack(); // Navigate back to the Notes screen after deleting
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Determine if the Update button should be disabled
  const isUpdateDisabled = title.trim() === note.title && body.trim() === note.body;

  return (
    <View style={{ flex: 1, backgroundColor: "#D5E3F0" }}>
      <View style={{ backgroundColor: "#191970", padding: 20 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Edit Note</Text>
      </View>
      <View style={{ margin: 20 }}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={handleTitleChange}
          style={{ borderColor: "gray", borderWidth: 1, borderRadius: 10, color: "black", textAlignVertical: "top" }}
          numberOfLines={3}
        />
        <TextInput
          placeholder="Body"
          value={body}
          onChangeText={handleBodyChange}
          style={{ borderColor: "gray", borderWidth: 1, marginTop: 20, borderRadius: 10, color: "black", textAlignVertical: "top" }}
          multiline={true}
          numberOfLines={20}
        />
        <View style={{ justifyContent: "center", marginTop: 20, alignItems: "center" }}>
          <CustomButton title={"Update "} type={"primary"} onPress={handleUpdate} disabled={isUpdateDisabled} />
          <View style={{ marginTop: 20 }}>
            <CustomButton title={"Delete Note "} type={"secondary"} onPress={confirmDelete} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default NoteDetails;
