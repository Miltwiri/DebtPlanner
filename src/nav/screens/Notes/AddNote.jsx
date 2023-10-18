import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'; // Import Firebase Firestore
import CustomButton from '../../../components/shared/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';

const AddNote = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const [documentId, setDocumentId] = useState(''); // State to store the document ID

  // Function to handle changes in the title input
  const handleTitleChange = (text) => {
    setTitle(text);
  };

  // Function to handle changes in the body input
  const handleBodyChange = (text) => {
    setBody(text);
  };

  // Function to submit the note to Firestore
  const handleSubmit = async () => {
    setIsLoading(true); // Set loading state to true while uploading

    try {
      // Add the note to the Firestore "Notes" collection
      const docRef = await firestore().collection('Notes').add({
        title,
        body,
        timestamp: firestore.FieldValue.serverTimestamp(),
        documentId: '', // Initialize the documentId field as an empty string
      });

      // Get the generated document ID and update the document with it
      const generatedId = docRef.id;
      await firestore().collection('Notes').doc(generatedId).update({
        documentId: generatedId, // Update the document with the actual document ID
      });

      // Clear the input fields after submission
      setTitle('');
      setBody('');

      setIsLoading(false); // Set loading state to false after successful upload

      // Show an alert after successful upload
      Alert.alert('Note Added', 'The note has been successfully added.', [
        {
          text: 'OK',
          onPress: () => {
            setIsLoading(false); // Set loading state to false
            // You can navigate to the previous screen here if needed
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      setIsLoading(false); // Set loading state to false in case of an error
      console.error('Error submitting note:', error);
    }
  };

  // Determine if the Submit button should be disabled
  const isSubmitDisabled = title.trim() === '' || body.trim() === '';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#D5E3F0" }}>
      <View style={{ backgroundColor: "#191970", padding: 20 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Add Note</Text>
      </View>
      <View style={{ margin: 20 }}>
        <Text style={{color:"gray"}}>Title:</Text>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={handleTitleChange}
          style={{ borderColor: "gray", borderWidth: 1, borderRadius: 10, fontSize: 16, textAlignVertical: "top", color: "black" }}
          numberOfLines={3}
        />
        <Text style={{color:"gray", marginTop: 20,}}>Body:</Text>
        <TextInput
          placeholder="Body"
          value={body}
          onChangeText={handleBodyChange}
          style={{ borderColor: "gray", borderWidth: 1,  textAlignVertical: "top", borderRadius: 10, fontSize: 20, color: "black" }}
          multiline={true} // Allow multiple lines
          numberOfLines={15} // Specify the initial number of lines (adjust as needed)
        />
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 10 }}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#191970" />
          ) : (
            <CustomButton title={"Submit "} type={"primary"} onPress={handleSubmit} disabled={isSubmitDisabled} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default AddNote;
