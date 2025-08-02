import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FinanceProvider } from './src/context/FinanceContext';

// Import screens
import OverviewScreen from './src/screens/OverviewScreen';
import MonthlyScreen from './src/screens/MonthlyScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import WealthScreen from './src/screens/WealthScreen';
import DebtScreen from './src/screens/DebtScreen';
import LoanFormScreen from './src/screens/LoanFormScreen';
import AssetFormScreen from './src/screens/AssetFormScreen';
import LiabilityFormScreen from './src/screens/LiabilityFormScreen';

// Import icons
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
      }}>
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Monthly"
        component={MonthlyScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddExpenseScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon name="plus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wealth"
        component={WealthScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Debt"
        component={DebtScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon name="credit-card" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen name="LoanForm" component={LoanFormScreen} />
              <Stack.Screen name="AssetForm" component={AssetFormScreen} />
              <Stack.Screen name="LiabilityForm" component={LiabilityFormScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </FinanceProvider>
  );
}