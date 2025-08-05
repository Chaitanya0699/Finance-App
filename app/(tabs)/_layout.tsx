import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Wallet, Calendar, PiggyBank, TrendingUp, TriangleAlert as AlertTriangle, User } from 'lucide-react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ size, color }) => (
            <Wallet size={size} color={color} strokeWidth={2} />
          ),
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#f8fafc',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerRight: () => (
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
            >
              <User size={24} color="#3B82F6" strokeWidth={2} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good morning! 👋</Text>
              <Text style={styles.subtitle}>Here's your financial overview</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="monthly"
        options={{
          title: 'Monthly',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Savings',
          tabBarIcon: ({ size, color }) => (
            <PiggyBank size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="liabilities"
        options={{
          title: 'Debt',
          tabBarIcon: ({ size, color }) => (
            <AlertTriangle size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    marginRight: 20,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerLeft: {
    marginLeft: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});
