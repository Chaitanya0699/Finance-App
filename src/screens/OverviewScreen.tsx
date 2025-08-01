import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useFinance } from '../context/FinanceContext';
import NetWorthChart from '../components/NetWorthChart';

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

interface OverviewScreenProps {
  navigation: any;
}

export default function OverviewScreen({ navigation }: OverviewScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const scaleValue = useSharedValue(1);
  const { getNetWorth } = useFinance();

  const { totalAssets, totalLiabilities, totalLoans, netWorth } = getNetWorth();

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
              <Icon name="trending-up" size={24} color="#ffffff" />
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
              <Icon name="home" size={16} color="#ffffff" />
              <Text style={styles.netWorthItemLabel}>Assets</Text>
              <Text style={styles.netWorthItemValue}>₹{(totalAssets / 100000).toFixed(1)}L</Text>
            </View>
            <View style={styles.netWorthItem}>
              <Icon name="alert-triangle" size={16} color="#ffffff" />
              <Text style={styles.netWorthItemLabel}>Liabilities</Text>
              <Text style={styles.netWorthItemValue}>₹{(totalLiabilities / 1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.netWorthItem}>
              <Icon name="credit-card" size={16} color="#ffffff" />
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
          <Icon name="home" size={18} color="#ffffff" />
          <Text style={styles.netWorthActionButtonText}>Add Asset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.netWorthActionButton, { backgroundColor: '#EF4444' }]}>
          <Icon name="alert-triangle" size={18} color="#ffffff" />
          <Text style={styles.netWorthActionButtonText}>Add Liability</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.netWorthActionButton, { backgroundColor: '#F59E0B' }]}>
          <Icon name="credit-card" size={18} color="#ffffff" />
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
              <Icon name="trending-up" size={20} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.balanceAmount}>
            ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.balanceStats}>
            <View style={styles.statItem}>
              <Icon name="arrow-up-right" size={16} color="#ffffff" />
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statAmount}>+₹{totalIncome.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="arrow-down-right" size={16} color="#ffffff" />
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
          <Icon name="pie-chart" size={20} color="#ffffff" />
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
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#10B981' }]}
          onPress={() => navigation.navigate('AssetForm')}>
          <Icon name="dollar-sign" size={24} color="#ffffff" />
          <Text style={styles.actionButtonText}>Add Asset</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
          onPress={() => navigation.navigate('LiabilityForm')}>
          <Icon name="credit-card" size={24} color="#ffffff" />
          <Text style={styles.actionButtonText}>Add Liability</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
          onPress={() => navigation.navigate('LoanForm')}>
          <Icon name="home" size={24} color="#ffffff" />
          <Text style={styles.actionButtonText}>Add Loan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.subtitle}>Here's your financial overview</Text>
        </View>

        {renderNetWorthCard()}
        {renderNetWorthActions()}
        {renderBalanceCard()}
        <NetWorthChart 
          totalAssets={totalAssets}
          totalLiabilities={totalLiabilities}
          totalLoans={totalLoans}
        />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
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
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
    textAlign: 'center',
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
    gap: 6,
  },
  netWorthActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  netWorthActionButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 4,
    textAlign: 'center',
  },
});