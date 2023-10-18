import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EveryClient from './EveryClient';
import Gold from './Gold';
import Silver from './Silver';
import Platinum from './Platinum';

const Tab = createMaterialTopTabNavigator();

function TopTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="All" component={EveryClient} />
        <Tab.Screen name="Gold" component={Gold} />
        <Tab.Screen name="Silver" component={Silver} />
        <Tab.Screen name="Platinum" component={Platinum} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default TopTabs;
