import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, CreditCard, ChartPie as PieChart, Building2, AlertTriangle, Plus, Target } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Mock data for Net Worth calculation
const mockAssets = [
  { name: 'Property', value: 8500000 },
  { name: 'Investments', value: 1250000 },
  { name: 'Vehicle', value: 650000 },
  { name: 'Gold', value: 450000 },
];

const mockLiabilities = [
  { name: 'Credit Card', amount: 45000 },
  { name: 'Bills', amount: 5500 },
  { name: 'Personal Debt', amount: 25000 },
];

const mockLoans = [
  { name: 'Home Loan', outstanding: 2300000 },
  { name: 'Car Loan', outstanding: 520000 },
  { name: 'Personal Loan', outstanding: 200000 },
];

const { width } = Dimensions.get('window');

interface ExpenseData {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

const mockExpenses: ExpenseData[] = [
  { id: '1', category: 'Food', amount: 85.50, description: 'Grocery shopping', date: '2025-01-15', type: 'expense' },
  { id: '2', category: 'Salary', amount: 3500.00, description: 'Monthly salary', date: '2025-01-01', type: 'income' },
  { id: '3', category: 'Transport', amount: 45.00, description: 'Gas refill', date: '2025-01-14', type: 'expense' },
  { id: '4', category: 'Entertainment', amount: 120.00, description: 'Movie tickets', date: '2025-01-13', type: 'expense' },
  { id: '5', category: 'Freelance', amount: 800.00, description: 'Web design project', date: '2025-01-10', type: 'income' },
];

const categoryColors: { [key: string]: string } = {
  Food: '#FF6B6B',
  Transport: '#4ECDC4',
  Entertainment: '#45B7D1',
  Shopping: '#96CEB4',
  Bills: '#FFEAA7',
  Salary: '#10B981',
  Freelance: '#3B82F6',
};

export default function OverviewScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const scaleValue = useSharedValue(1);

  // Net Worth calculations
  const totalAssets = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = mockLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const totalLoans = mockLoans.reduce((sum, loan) => sum + loan.outstanding, 0);
  const netWorth = totalAssets - totalLiabilities - totalLoans;

  const totalIncome = mockExpenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpenses = mockExpenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = mockExpenses
    .filter(expense => expense.type === 'expense')
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });

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

  const renderNetWorthCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={netWorth >= 0 ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.netWorthCard}>
          <View style={styles.netWorthHeader}>
            <Text style={styles.netWorthLabel}>Net Worth</Text>
            <View style={styles.netWorthIcon}>
              <TrendingUp size={24} color="#ffffff" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.netWorthAmount}>
            ₹{Math.abs(netWorth).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.netWorthStatus}>
            {netWorth >= 0 ? 'Positive Net Worth' : 'Negative Net Worth'}
          </Text>
          
          <View style={styles.netWorthBreakdown}>
            <View style={styles.netWorthItem}>
              <Building2 size={16} color="#ffffff" strokeWidth={2} />
              <Text style={styles.netWorthItemLabel}>Assets</Text>
              <Text style={styles.netWorthItemValue}>₹{(totalAssets / 100000).toFixed(1)}L</Text>
            </View>
            <View style={styles.netWorthItem}>
              <AlertTriangle size={16} color="#ffffff" strokeWidth={2} />
              <Text style={styles.netWorthItemLabel}>Liabilities</Text>
              <Text style={styles.netWorthItemValue}>₹{(totalLiabilities / 1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.netWorthItem}>
              <CreditCard size={16} color="#ffffff" strokeWidth={2} />
              <Text style={styles.netWorthItemLabel}>Loans</Text>
              <Text style={styles.netWorthItemValue}>₹{(totalLoans / 100000).toFixed(1)}L</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderNetWorthActions = () => (
    <View style={styles.netWorthActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.netWorthActionButtons}>
        <TouchableOpacity style={[styles.netWorthActionButton, { backgroundColor: '#10B981' }]}>
          <Building2 size={18} color="#ffffff" strokeWidth={2} />
          <Text style={styles.netWorthActionButtonText}>Add Asset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.netWorthActionButton, { backgroundColor: '#EF4444' }]}>
          <AlertTriangle size={18} color="#ffffff" strokeWidth={2} />
          <Text style={styles.netWorthActionButtonText}>Add Liability</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.netWorthActionButton, { backgroundColor: '#F59E0B' }]}>
          <CreditCard size={18} color="#ffffff" strokeWidth={2} />
          <Text style={styles.netWorthActionButtonText}>Add Loan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBalanceCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <View style={styles.trendContainer}>
              <TrendingUp size={20} color="#ffffff" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.balanceAmount}>
            ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.balanceStats}>
            <View style={styles.statItem}>
              <ArrowUpRight size={16} color="#ffffff" strokeWidth={2} />
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statAmount}>+₹{totalIncome.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statItem}>
              <ArrowDownRight size={16} color="#ffffff" strokeWidth={2} />
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statAmount}>-₹{totalExpenses.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {(['week', 'month', 'year'] as const).map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.periodButtonActive,
          ]}
          onPress={() => setSelectedPeriod(period)}>
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.periodButtonTextActive,
            ]}>
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCategoryCard = (category: string, amount: number) => (
    <View key={category} style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View
          style={[
            styles.categoryIcon,
            { backgroundColor: categoryColors[category] || '#64748B' },
          ]}>
          <PieChart size={20} color="#ffffff" strokeWidth={2} />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.categoryAmount}>
            ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
      <View style={styles.categoryProgress}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${(amount / Math.max(...Object.values(expensesByCategory))) * 100}%`,
              backgroundColor: categoryColors[category] || '#64748B',
            },
          ]}
        />
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]}>
          <DollarSign size={24} color="#ffffff" strokeWidth={2} />
          <Text style={styles.actionButtonText}>Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#EF4444' }]}>
          <CreditCard size={24} color="#ffffff" strokeWidth={2} />
          <Text style={styles.actionButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning! 👋</Text>
        <Text style={styles.subtitle}>Here's your financial overview</Text>
      </View>

      {renderNetWorthCard()}
      {renderNetWorthActions()}
      {renderBalanceCard()}
      {renderPeriodSelector()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expense Categories</Text>
        <View style={styles.categoriesContainer}>
          {Object.entries(expensesByCategory).map(([category, amount]) =>
            renderCategoryCard(category, amount)
          )}
        </View>
      </View>

      {renderQuickActions()}
    </ScrollView>
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
  greeting: {
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
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  trendContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    flex: 0.48,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginLeft: 6,
    marginRight: 8,
  },
  statAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  periodSelector: {
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
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  categoryProgress: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  quickActions: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  netWorthCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  netWorthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  netWorthLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  netWorthIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  netWorthAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  netWorthStatus: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 20,
    fontWeight: '500',
  },
  netWorthBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  netWorthItem: {
    alignItems: 'center',
    flex: 1,
  },
  netWorthItemLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
    marginBottom: 2,
  },
  netWorthItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  netWorthActions: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  netWorthActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  netWorthActionButton: {
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
  netWorthActionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
  },
});