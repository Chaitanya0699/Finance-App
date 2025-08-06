import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  useFrameworkReady();

  // Simulate authentication state (replace with your real auth logic)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Example: check local storage or async storage for auth token
    // Replace this with your actual authentication check
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      // setIsLoggedIn(!!token);
      setIsLoggedIn(true); // Set to true if user is logged in
    };
    checkAuth();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={isLoggedIn ? 'index' : 'login'} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}