import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Plus, Calendar, TrendingDown, CircleCheck as CheckCircle, Clock, Chrome as Home, Car, User, Building2, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
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
  duration?: number; // in months
  monthsPaid: number;
  status: 'active' | 'closed';
  color: string;
  icon: string;
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
    color: '#3B82F6',
    icon: '🏠'
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
    color: '#10B981',
    icon: '🚗'
  },
  {
    id: '3',
    name: 'Personal Loan',
    type: 'personal',
    totalAmount: 200000,
    interestRate: 12.5,
    startDate: '2024-03-01',
    repaymentMode: 'full',
    monthsPaid: 0,
    status: 'active',
    color: '#F59E0B',
    icon: '💰'
  }
];

export default function LoansScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'active' | 'closed'>('active');
  const scaleValue = useSharedValue(1);

  const activeLoans = mockLoans.filter(loan => loan.status === 'active');
  const closedLoans = mockLoans.filter(loan => loan.status === 'closed');
  const currentLoans = selectedTab === 'active' ? activeLoans : closedLoans;

  const totalOutstanding = activeLoans.reduce((sum, loan) => {
    if (loan.repaymentMode === 'emi' && loan.emiAmount && loan.duration) {
      const remainingMonths = loan.duration - loan.monthsPaid;
      return sum + (loan.emiAmount * remainingMonths);
    }
    return sum + loan.totalAmount;
  }, 0);

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

  const getLoanIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home size={20} color="#ffffff" strokeWidth={2} />;
      case 'vehicle': return <Car size={20} color="#ffffff" strokeWidth={2} />;
      case 'personal': return <User size={20} color="#ffffff" strokeWidth={2} />;
      case 'education': return <Building2 size={20} color="#ffffff" strokeWidth={2} />;
      default: return <CreditCard size={20} color="#ffffff" strokeWidth={2} />;
    }
  };

  const renderTabSelector = () => (
    <View style={styles.tabSelector}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === 'active' && styles.tabButtonActive,
        ]}
        onPress={() => setSelectedTab('active')}>
        <Text
          style={[
            styles.tabButtonText,
            selectedTab === 'active' && styles.tabButtonTextActive,
          ]}>
          Active ({activeLoans.length})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === 'closed' && styles.tabButtonActive,
        ]}
        onPress={() => setSelectedTab('closed')}>
        <Text
          style={[
            styles.tabButtonText,
            selectedTab === 'closed' && styles.tabButtonTextActive,
          ]}>
          Closed ({closedLoans.length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSummaryCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>Total Outstanding</Text>
            <View style={styles.summaryIcon}>
              <TrendingDown size={24} color="#ffffff" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.summaryAmount}>
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Monthly EMI</Text>
              <Text style={styles.summaryStatValue}>₹{totalMonthlyEMI.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Active Loans</Text>
              <Text style={styles.summaryStatValue}>{activeLoans.length}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderLoanCard = (loan: Loan) => {
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
        activeOpacity={0.7}
        onPress={() => router.push(`/loan-details/${loan.id}`)}>
        <View style={styles.loanHeader}>
          <View style={[styles.loanIcon, { backgroundColor: loan.color }]}>
            {getLoanIcon(loan.type)}
          </View>
          <View style={styles.loanInfo}>
            <Text style={styles.loanName}>{loan.name}</Text>
            <Text style={styles.loanType}>{loan.type.charAt(0).toUpperCase() + loan.type.slice(1)} Loan</Text>
          </View>
          <View style={styles.loanStatus}>
            {loan.status === 'active' ? (
              <Clock size={16} color="#F59E0B" strokeWidth={2} />
            ) : (
              <CheckCircle size={16} color="#10B981" strokeWidth={2} />
            )}
            <ArrowRight size={16} color="#94a3b8" strokeWidth={2} />
          </View>
        </View>

        <View style={styles.loanDetails}>
          <View style={styles.loanAmount}>
            <Text style={styles.loanAmountLabel}>
              {loan.repaymentMode === 'emi' ? 'Remaining' : 'Total Amount'}
            </Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Loans</Text>
        <Text style={styles.subtitle}>Manage your loan portfolio</Text>
      </View>

      {renderTabSelector()}
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        
        {selectedTab === 'active' && renderSummaryCard()}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedTab === 'active' ? 'Active Loans' : 'Closed Loans'}
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add-loan')}>
            <Plus size={20} color="#3B82F6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {currentLoans.length > 0 ? (
          currentLoans.map(renderLoanCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {selectedTab} loans found
            </Text>
            <TouchableOpacity 
              style={styles.addLoanButton}
              onPress={() => router.push('/add-loan')}>
              <Plus size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.addLoanButtonText}>Add Your First Loan</Text>
            </TouchableOpacity>
          </View>
        )}

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
  summaryCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  summaryIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryStatItem: {
    flex: 1,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 4,
  },
  summaryStatValue: {
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  addLoanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addLoanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
});