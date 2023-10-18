import { createStackNavigator } from '@react-navigation/stack';
import Notes from '../../screens/Notes/Notes';
import NoteDetails from '../../screens/Notes/NoteDetails';
import AddNote from '../../screens/Notes/AddNote';


const NotesStack = createStackNavigator();

const NotesStackScreens = () => {
    return (
        <NotesStack.Navigator
            initialRouteName="NotesList"
            screenOptions={{
                headerShown: false,
            }}>
            <NotesStack.Screen name="NotesList" component={Notes} options={{}} />
            <NotesStack.Screen name="NotesDetails" component={NoteDetails} options={{}} />
            <NotesStack.Screen name="AddNote" component={AddNote} options={{}} />
        </NotesStack.Navigator>
    );
};
export default NotesStackScreens
