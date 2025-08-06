import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  useFrameworkReady();


  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="add-asset" />
        <Stack.Screen name="add-liability" />
        <Stack.Screen name="add-loan" />
        <Stack.Screen name="add-expense" />
        <Stack.Screen name="add-savings" />
        <Stack.Screen name="add-stock" />
        <Stack.Screen name="add-mutual-fund" />
        <Stack.Screen name="add-investment" />
        <Stack.Screen name="new-goal" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}