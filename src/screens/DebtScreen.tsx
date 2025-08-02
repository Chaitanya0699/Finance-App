import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Loan {
  id: string;
  name: string;
  type: 'personal' | 'home' | 'vehicle' | 'education' | 'other';
  totalAmount: number;
  interestRate: number;
  startDate: string;
  repaymentMode: 'emi' | 'full';
  emiAmount?: number;
  duration?: number;
  monthsPaid: number;
  status: 'active' | 'closed';
  color: string;
}

interface Liability {
  id: string;
  name: string;
  type: 'credit_card' | 'bill' | 'debt' | 'other';
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  description?: string;
  color: string;
}

const mockLoans: Loan[] = [
  {
    id: '1',
    name: 'Home Loan',
    type: 'home',
    totalAmount: 2500000,
    interestRate: 8.5,
    startDate: '2023-01-15',
    repaymentMode: 'emi',
    emiAmount: 19112,
    duration: 240,
    monthsPaid: 12,
    status: 'active',
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Car Loan',
    type: 'vehicle',
    totalAmount: 800000,
    interestRate: 9.2,
    startDate: '2024-06-01',
    repaymentMode: 'emi',
    emiAmount: 17500,
    duration: 60,
    monthsPaid: 7,
    status: 'active',
    color: '#10B981'
  },
];

const mockLiabilities: Liability[] = [
  {
    id: '1',
    name: 'HDFC Credit Card',
    type: 'credit_card',
    amount: 45000,
    dueDate: '2025-01-25',
    status: 'unpaid',
    description: 'Monthly credit card bill',
    color: '#EF4444'
  },
  {
    id: '2',
    name: 'Electricity Bill',
    type: 'bill',
    amount: 3500,
    dueDate: '2025-01-20',
    status: 'unpaid',
    description: 'Monthly electricity bill',
    color: '#F59E0B'
  },
  {
    id: '3',
    name: 'Personal Debt',
    type: 'debt',
    amount: 25000,
    dueDate: '2025-01-30',
    status: 'unpaid',
    description: 'Money borrowed from friend',
    color: '#8B5CF6'
  },
];

export default function DebtScreen() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'loans' | 'liabilities'>('overview');
  const scaleValue = useSharedValue(1);

  const activeLoans = mockLoans.filter(loan => loan.status === 'active');
  const unpaidLiabilities = mockLiabilities.filter(l => l.status === 'unpaid');
  
  const totalLoanOutstanding = activeLoans.reduce((sum, loan) => {
    if (loan.repaymentMode === 'emi' && loan.emiAmount && loan.duration) {
      const remainingMonths = loan.duration - loan.monthsPaid;
      return sum + (loan.emiAmount * remainingMonths);
    }
    return sum + loan.totalAmount;
  }, 0);

  const totalLiabilities = unpaidLiabilities.reduce((sum, l) => sum + l.amount, 0);
  const totalDebt = totalLoanOutstanding + totalLiabilities;

  const totalMonthlyEMI = activeLoans.reduce((sum, loan) => {
    return sum + (loan.emiAmount || 0);
  }, 0);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const handleCardPress = () => {
    scaleValue.value = withSpring(0.95, { duration: 100 }, () => {
      scaleValue.value = withSpring(1);
    });
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

  const renderDebtCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.debtCard}>
          <View style={styles.debtHeader}>
            <Text style={styles.debtLabel}>Total Debt</Text>
            <View style={styles.debtIcon}>
              <Icon name="alert-triangle" size={24} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.debtAmount}>
            ₹{totalDebt.toLocaleString('en-IN')}
          </Text>
          <View style={styles.debtBreakdown}>
            <View style={styles.debtItem}>
              <Text style={styles.debtItemLabel}>Loans</Text>
              <Text style={styles.debtItemValue}>₹{(totalLoanOutstanding / 100000).toFixed(1)}L</Text>
            </View>
            <View style={styles.debtItem}>
              <Text style={styles.debtItemLabel}>Bills</Text>
              <Text style={styles.debtItemValue}>₹{(totalLiabilities / 1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.debtItem}>
              <Text style={styles.debtItemLabel}>Monthly EMI</Text>
              <Text style={styles.debtItemValue}>₹{(totalMonthlyEMI / 1000).toFixed(0)}K</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderLoan = (loan: Loan) => {
    const progress = loan.repaymentMode === 'emi' && loan.duration 
      ? (loan.monthsPaid / loan.duration) * 100 
      : 0;
    
    const remainingAmount = loan.repaymentMode === 'emi' && loan.emiAmount && loan.duration
      ? loan.emiAmount * (loan.duration - loan.monthsPaid)
      : loan.totalAmount;

    return (
      <TouchableOpacity 
        key={loan.id} 
        style={styles.loanCard} 
        activeOpacity={0.7}>
        <View style={styles.loanHeader}>
          <View style={[styles.loanIcon, { backgroundColor: loan.color }]}>
            <Icon name="home" size={20} color="#ffffff" />
          </View>
          <View style={styles.loanInfo}>
            <Text style={styles.loanName}>{loan.name}</Text>
            <Text style={styles.loanType}>{loan.type.charAt(0).toUpperCase() + loan.type.slice(1)} Loan</Text>
          </View>
          <View style={styles.loanStatus}>
            <Icon name="clock" size={16} color="#F59E0B" />
          </View>
        </View>

        <View style={styles.loanDetails}>
          <View style={styles.loanAmount}>
            <Text style={styles.loanAmountLabel}>Remaining</Text>
            <Text style={styles.loanAmountValue}>
              ₹{remainingAmount.toLocaleString('en-IN')}
            </Text>
          </View>
          
          {loan.repaymentMode === 'emi' && loan.emiAmount && (
            <View style={styles.emiInfo}>
              <Text style={styles.emiAmount}>EMI: ₹{loan.emiAmount.toLocaleString('en-IN')}</Text>
              <Text style={styles.emiProgress}>
                {loan.monthsPaid}/{loan.duration} months paid
              </Text>
            </View>
          )}
        </View>

        {loan.repaymentMode === 'emi' && loan.duration && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBarFill,
                  { 
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: loan.color
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% paid</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderLiability = (liability: Liability) => {
    const dueDate = new Date(liability.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <TouchableOpacity 
        key={liability.id} 
        style={styles.liabilityCard} 
        activeOpacity={0.7}>
        <View style={styles.liabilityHeader}>
          <View style={[styles.liabilityIcon, { backgroundColor: liability.color }]}>
            <Icon name="credit-card" size={20} color="#ffffff" />
          </View>
          <View style={styles.liabilityInfo}>
            <Text style={styles.liabilityName}>{liability.name}</Text>
            <Text style={styles.liabilityType}>
              {liability.type.replace('_', ' ').charAt(0).toUpperCase() + liability.type.replace('_', ' ').slice(1)}
            </Text>
          </View>
          <View style={styles.liabilityStatus}>
            <Icon name="clock" size={16} color="#F59E0B" />
          </View>
        </View>

        <View style={styles.liabilityDetails}>
          <View style={styles.liabilityAmount}>
            <Text style={styles.liabilityAmountValue}>
              ₹{liability.amount.toLocaleString('en-IN')}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: liability.color }]}>
              <Text style={styles.statusText}>
                {liability.status.charAt(0).toUpperCase() + liability.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.liabilityMeta}>
            <View style={styles.dueDateContainer}>
              <Icon name="calendar" size={14} color="#64748b" />
              <Text style={styles.dueDate}>
                Due: {dueDate.toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </Text>
            </View>
            <Text style={[
              styles.daysUntilDue,
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
        </View>

        {liability.description && (
          <Text style={styles.liabilityDescription} numberOfLines={1}>
            {liability.description}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View>
            {renderDebtCard()}
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#EF4444' }]}>
                  <Icon name="credit-card" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Add Loan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}>
                  <Icon name="file-text" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Add Bill</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]}>
                  <Icon name="check" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Pay Bill</Text>
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
              <TouchableOpacity style={styles.addButton}>
                <Icon name="plus" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            {activeLoans.map(renderLoan)}
          </View>
        );
      case 'liabilities':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Liabilities</Text>
              <TouchableOpacity style={styles.addButton}>
                <Icon name="plus" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            {unpaidLiabilities.map(renderLiability)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={styles.header}>
        <Text style={styles.title}>Debt Management</Text>
        <Text style={styles.subtitle}>Track loans and liabilities</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
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
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#3B82F6',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  debtCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  debtLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  debtIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  debtAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
  },
  debtBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debtItem: {
    alignItems: 'center',
    flex: 1,
  },
  debtItemLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  debtItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 8,
  },
  loanCard: {
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
  loanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  loanInfo: {
    flex: 1,
  },
  loanName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  loanType: {
    fontSize: 14,
    color: '#64748b',
  },
  loanStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loanDetails: {
    marginBottom: 16,
  },
  loanAmount: {
    marginBottom: 8,
  },
  loanAmountLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  loanAmountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EF4444',
  },
  emiInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emiAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  emiProgress: {
    fontSize: 14,
    color: '#64748b',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  liabilityCard: {
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
  liabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  liabilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  liabilityInfo: {
    flex: 1,
  },
  liabilityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  liabilityType: {
    fontSize: 14,
    color: '#64748b',
  },
  liabilityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liabilityDetails: {
    marginBottom: 12,
  },
  liabilityAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liabilityAmountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EF4444',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  liabilityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  daysUntilDue: {
    fontSize: 14,
    fontWeight: '600',
  },
  liabilityDescription: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
  },
  spacer: {
    height: 40,
  },
});