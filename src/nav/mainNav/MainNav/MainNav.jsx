import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeStackScreens from '../HomeStacks/HomeStack';
import BeneficiariesStackScreens from '../BenefsStack/BenefsStack';
import NotesStackScreens from '../NotesStack/NotesStack';
import SettingsStackScreens from '../SettingsStack/SettingsStack';

import Ionicons from 'react-native-vector-icons/Ionicons';

const AppTab = createBottomTabNavigator();

const AppTabScreens = () => {
    return (
        <AppTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'planet-sharp' : 'planet-outline';
                    } else if (route.name === 'Clients') {
                        iconName = focused ? 'people-circle-sharp' : 'people-circle-outline';
                    } else if (route.name === 'Notes') {
                        iconName = focused ? 'reader' : 'reader-outline';
                    }
                    else if (route.name === 'Settings') {
                        iconName = focused ? 'settings-sharp' : 'settings-outline';
                    }
                    return <Ionicons name={iconName} size={27} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: '#000080',
                tabBarInactiveTintColor: '#818589',
                tabBarLabelStyle:{marginBottom:4},
                tabBarHideOnKeyboard:true
            })}>
            <AppTab.Screen
            name="Home"
            component={HomeStackScreens} />
            <AppTab.Screen
                name="Clients"
                component={BeneficiariesStackScreens}
                options={({ route }) => ({
                    tabBarStyle: ((route) => {
                      const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                    //   console.log(routeName)
                      if (routeName === 'AddBeneficiary' || routeName === 'BeneficiaryDetails') {
                        return { display: "none" }
                      }
                      return{};// Return an empty object to reset tabBarStyle
                    })(route),
                  })}
            />
            <AppTab.Screen
            name="Notes"
            component={NotesStackScreens}
            options={({ route }) => ({
                tabBarStyle: ((route) => {
                  const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                //   console.log(routeName)
                  if (routeName === 'AddNote' || routeName === 'NotesDetails') {
                    return { display: "none" }
                  }
                  return
                })(route),
              })}/>
            <AppTab.Screen
            name="Settings"
            component={SettingsStackScreens} />
        </AppTab.Navigator>
    );
};
export default AppTabScreens

