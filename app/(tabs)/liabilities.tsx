import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TriangleAlert as AlertTriangle, 
  Plus, 
  Calendar, 
  CircleCheck as CheckCircle, 
  Clock, 
  CreditCard, 
  Receipt, 
  ArrowRight,
  Chrome as Home,
  Car,
  User,
  TrendingDown
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// Mock data for loans
const mockLoans = [
  { id: '1', name: 'Home Loan', type: 'home', outstanding: 2300000, emi: 19112, duration: 240, monthsPaid: 12, color: '#3B82F6' },
  { id: '2', name: 'Car Loan', type: 'vehicle', outstanding: 520000, emi: 17500, duration: 60, monthsPaid: 7, color: '#10B981' },
  { id: '3', name: 'Personal Loan', type: 'personal', outstanding: 200000, emi: 8500, duration: 36, monthsPaid: 5, color: '#F59E0B' },
];

// Mock data for liabilities
const mockLiabilities = [
  { id: '1', name: 'HDFC Credit Card', type: 'credit_card', amount: 45000, dueDate: '2025-01-25', status: 'unpaid', color: '#EF4444' },
  { id: '2', name: 'Electricity Bill', type: 'bill', amount: 3500, dueDate: '2025-01-20', status: 'unpaid', color: '#F59E0B' },
  { id: '3', name: 'Internet Bill', type: 'bill', amount: 1200, dueDate: '2025-01-15', status: 'paid', color: '#10B981' },
  { id: '4', name: 'Personal Debt', type: 'debt', amount: 25000, dueDate: '2025-01-30', status: 'unpaid', color: '#8B5CF6' },
];

export default function LiabilitiesScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'loans' | 'liabilities'>('overview');
  const scaleValue = useSharedValue(1);

  const totalLoans = mockLoans.reduce((sum, loan) => sum + loan.outstanding, 0);
  const totalEMI = mockLoans.reduce((sum, loan) => sum + loan.emi, 0);
  const totalLiabilities = mockLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const unpaidLiabilities = mockLiabilities.filter(l => l.status === 'unpaid').reduce((sum, l) => sum + l.amount, 0);
  const totalDebt = totalLoans + totalLiabilities;

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handleCardPress = () => {
    scaleValue.value = withSpring(0.95, { duration: 100 }, () => {
      scaleValue.value = withSpring(1);
    });
  };

  const getLoanIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home size={20} color="#ffffff" strokeWidth={2} />;
      case 'vehicle': return <Car size={20} color="#ffffff" strokeWidth={2} />;
      case 'personal': return <User size={20} color="#ffffff" strokeWidth={2} />;
      default: return <CreditCard size={20} color="#ffffff" strokeWidth={2} />;
    }
  };

  const getLiabilityIcon = (type: string) => {
    switch (type) {
      case 'credit_card': return <CreditCard size={20} color="#ffffff" strokeWidth={2} />;
      case 'bill': return <Receipt size={20} color="#ffffff" strokeWidth={2} />;
      case 'debt': return <AlertTriangle size={20} color="#ffffff" strokeWidth={2} />;
      default: return <Receipt size={20} color="#ffffff" strokeWidth={2} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} color="#10B981" strokeWidth={2} />;
      case 'unpaid': return <Clock size={16} color="#F59E0B" strokeWidth={2} />;
      case 'overdue': return <AlertTriangle size={16} color="#EF4444" strokeWidth={2} />;
      default: return <Clock size={16} color="#64748B" strokeWidth={2} />;
    }
  };

  const renderTabSelector = () => (
    <View style={styles.tabSelector}>
      {(['overview', 'loans', 'liabilities'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            selectedTab === tab && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab(tab)}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === tab && styles.tabButtonTextActive,
            ]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDebtSummaryCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>Total Debt</Text>
            <View style={styles.summaryIcon}>
              <TrendingDown size={24} color="#ffffff" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.summaryAmount}>
            ₹{totalDebt.toLocaleString('en-IN')}
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Monthly EMI</Text>
              <Text style={styles.summaryStatValue}>₹{totalEMI.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Unpaid Bills</Text>
              <Text style={styles.summaryStatValue}>₹{unpaidLiabilities.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderLoanCard = (loan: any) => {
    const progress = (loan.monthsPaid / loan.duration) * 100;
    
    return (
      <TouchableOpacity key={loan.id} style={styles.itemCard} activeOpacity={0.7}>
        <View style={styles.itemHeader}>
          <View style={[styles.itemIcon, { backgroundColor: loan.color }]}>
            {getLoanIcon(loan.type)}
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{loan.name}</Text>
            <Text style={styles.itemSubtitle}>EMI: ₹{loan.emi.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.itemTrend}>
            <ArrowRight size={16} color="#94a3b8" strokeWidth={2} />
          </View>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemValue}>₹{loan.outstanding.toLocaleString('en-IN')}</Text>
          <Text style={styles.itemProgress}>{loan.monthsPaid}/{loan.duration} months</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressBarFill,
                { width: `${Math.min(progress, 100)}%`, backgroundColor: loan.color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% paid</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLiabilityCard = (liability: any) => {
    const dueDate = new Date(liability.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <TouchableOpacity key={liability.id} style={styles.itemCard} activeOpacity={0.7}>
        <View style={styles.itemHeader}>
          <View style={[styles.itemIcon, { backgroundColor: liability.color }]}>
            {getLiabilityIcon(liability.type)}
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{liability.name}</Text>
            <Text style={styles.itemSubtitle}>
              Due: {dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
          <View style={styles.itemStatus}>
            {getStatusIcon(liability.status)}
          </View>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemValue}>₹{liability.amount.toLocaleString('en-IN')}</Text>
          <Text style={[
            styles.itemDays,
            { color: daysUntilDue < 0 ? '#EF4444' : daysUntilDue <= 3 ? '#F59E0B' : '#64748b' }
          ]}>
            {daysUntilDue < 0 
              ? `${Math.abs(daysUntilDue)} days overdue`
              : daysUntilDue === 0 
                ? 'Due today'
                : `${daysUntilDue} days left`
            }
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View>
            {renderDebtSummaryCard()}
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                  onPress={() => router.push('/add-loan')}>
                  <Plus size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Add Loan</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
                  onPress={() => router.push('/add-liability')}>
                  <Plus size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Add Bill</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case 'loans':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Loans</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/add-loan')}>
                <Plus size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Total Outstanding: ₹{totalLoans.toLocaleString('en-IN')}
            </Text>
            {mockLoans.map(renderLoanCard)}
          </View>
        );
      case 'liabilities':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bills & Liabilities</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/add-liability')}>
                <Plus size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Total Amount: ₹{totalLiabilities.toLocaleString('en-IN')}
            </Text>
            {mockLiabilities.map(renderLiabilityCard)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Loans & Liabilities</Text>
        <Text style={styles.subtitle}>Manage your debt portfolio</Text>
      </View>

      {renderTabSelector()}
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#64748b', fontWeight: '500' },
  tabSelector: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 4, 
    marginBottom: 24, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabButtonActive: { backgroundColor: '#3B82F6' },
  tabButtonText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  tabButtonTextActive: { color: '#ffffff' },
  content: { flex: 1, paddingHorizontal: 20 },
  summaryCard: { borderRadius: 20, padding: 24, marginBottom: 24, elevation: 8 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryLabel: { fontSize: 16, color: '#ffffff', opacity: 0.8, fontWeight: '500' },
  summaryIcon: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 12, padding: 8 },
  summaryAmount: { fontSize: 36, fontWeight: '800', color: '#ffffff', marginBottom: 20 },
  summaryStats: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryStatItem: { flex: 1 },
  summaryStatLabel: { fontSize: 12, color: '#ffffff', opacity: 0.7, marginBottom: 4 },
  summaryStatValue: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  sectionSubtitle: { fontSize: 16, color: '#64748b', marginBottom: 16, fontWeight: '500' },
  addButton: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 8 },
  itemCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  itemIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 2 },
  itemSubtitle: { fontSize: 14, color: '#64748b' },
  itemTrend: { padding: 8 },
  itemStatus: { padding: 8 },
  itemDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemValue: { fontSize: 20, fontWeight: '700', color: '#EF4444' },
  itemProgress: { fontSize: 14, color: '#64748b' },
  itemDays: { fontSize: 14, fontWeight: '600' },
  progressContainer: { flexDirection: 'row', alignItems: 'center' },
  progressBar: { flex: 1, height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, marginRight: 12 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  quickActions: { marginBottom: 24 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, elevation: 3 },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff', marginLeft: 8 },
  spacer: { height: 40 },
});