import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, Mail, Phone, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    joinDate: '2024-01-15',
    isLoggedIn: true
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleLogin = () => {
    router.push('/login');
  };

  if (!user.isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1e293b" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loginPrompt}>
          <User size={64} color="#94a3b8" strokeWidth={1} />
          <Text style={styles.loginTitle}>Welcome to FinanceApp</Text>
          <Text style={styles.loginSubtitle}>Login to access your financial dashboard</Text>
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1e293b" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit3 size={20} color="#3B82F6" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={32} color="#ffffff" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>
            Member since {new Date(user.joinDate).toLocaleDateString('en-IN', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
        </LinearGradient>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          
          <View style={styles.infoItem}>
            <Mail size={20} color="#64748b" strokeWidth={2} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Phone size={20} color="#64748b" strokeWidth={2} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MapPin size={20} color="#64748b" strokeWidth={2} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{user.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#64748b" strokeWidth={2} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Bell size={20} color="#64748b" strokeWidth={2} />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Shield size={20} color="#64748b" strokeWidth={2} />
            <Text style={styles.menuText}>Privacy & Security</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color="#64748b" strokeWidth={2} />
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" strokeWidth={2} />
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20 
  },
  backButton: { 
    padding: 8, 
    borderRadius: 12, 
    backgroundColor: '#ffffff', 
    elevation: 2 
  },
  title: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  placeholder: { width: 40 },
  editButton: { 
    padding: 8, 
    borderRadius: 12, 
    backgroundColor: '#ffffff', 
    elevation: 2 
  },
  content: { flex: 1, paddingHorizontal: 20 },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 16,
  },
  loginPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
});