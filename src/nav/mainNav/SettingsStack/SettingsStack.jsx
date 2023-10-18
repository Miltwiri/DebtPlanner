import { createStackNavigator } from '@react-navigation/stack';
import Settings from '../../screens/Settings/Settings';


const SettingsStack = createStackNavigator();

const SettingsStackScreens = () => {
    return (
        <SettingsStack.Navigator
            initialRouteName="SettingsHome"
            screenOptions={{
                headerShown: false,
            }}>
            <SettingsStack.Screen name="SettingsHome" component={Settings} options={{}} />
        </SettingsStack.Navigator>
    );
};
export default SettingsStackScreens
