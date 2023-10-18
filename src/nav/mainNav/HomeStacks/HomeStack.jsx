import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../screens/Home/Home';
import AllTransactionsScreen from '../../screens/Home/AllTransactionsScreen';

const HomeStack = createStackNavigator();

const HomeStackScreens = () => {
    return (
        <HomeStack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                headerShown: false,
            }}>
            <HomeStack.Screen name="HomeScreen" component={Home} options={{}} />
            <HomeStack.Screen name="AllTransactionsScreen" component={AllTransactionsScreen} options={{}} />
        </HomeStack.Navigator>
    );
};
export default HomeStackScreens
