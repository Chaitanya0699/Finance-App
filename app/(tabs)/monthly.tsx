import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Calendar, TrendingDown, TrendingUp, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface MonthlyExpense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  icon: string;
}

const monthlyExpenses: MonthlyExpense[] = [
  { id: '1', category: 'Food & Dining', amount: 324.50, description: 'Restaurants & Groceries', date: '2025-01-15', type: 'expense', icon: '🍽️' },
  { id: '2', category: 'Salary', amount: 3500.00, description: 'Monthly salary', date: '2025-01-01', type: 'income', icon: '💰' },
  { id: '3', category: 'Transportation', amount: 180.00, description: 'Gas & Public transport', date: '2025-01-14', type: 'expense', icon: '🚗' },
  { id: '4', category: 'Entertainment', amount: 245.00, description: 'Movies & Games', date: '2025-01-13', type: 'expense', icon: '🎮' },
  { id: '5', category: 'Shopping', amount: 420.00, description: 'Clothes & Electronics', date: '2025-01-12', type: 'expense', icon: '🛍️' },
  { id: '6', category: 'Bills & Utilities', amount: 185.00, description: 'Electricity & Internet', date: '2025-01-10', type: 'expense', icon: '💡' },
  { id: '7', category: 'Healthcare', amount: 95.00, description: 'Medical checkup', date: '2025-01-08', type: 'expense', icon: '⚕️' },
  { id: '8', category: 'Freelance', amount: 800.00, description: 'Web design project', date: '2025-01-05', type: 'income', icon: '💻' },
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthlyScreen() {
  const [currentMonth, setCurrentMonth] = useState(0); // January = 0
  const slideValue = useSharedValue(0);

  const monthlyIncome = monthlyExpenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyExpensesTotal = monthlyExpenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpensesTotal;

  const animatedSlideStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideValue.value }],
    };
  });

  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'next' 
      ? (currentMonth + 1) % 12 
      : currentMonth === 0 ? 11 : currentMonth - 1;
    
    slideValue.value = withTiming(
      direction === 'next' ? -width : width,
      { duration: 200 },
      () => {
        runOnJS(setCurrentMonth)(newMonth);
        slideValue.value = withTiming(0, { duration: 200 });
      }
    );
  };

  const renderMonthHeader = () => (
    <View style={styles.monthHeader}>
      <TouchableOpacity 
        style={styles.monthNavButton}
        onPress={() => changeMonth('prev')}>
        <ChevronLeft size={24} color="#3B82F6" strokeWidth={2} />
      </TouchableOpacity>
      
      <Animated.View style={[styles.monthContainer, animatedSlideStyle]}>
        <Calendar size={20} color="#3B82F6" strokeWidth={2} />
        <Text style={styles.monthText}>{months[currentMonth]} 2025</Text>
      </Animated.View>
      
      <TouchableOpacity 
        style={styles.monthNavButton}
        onPress={() => changeMonth('next')}>
        <ChevronRight size={24} color="#3B82F6" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );

  const renderMonthSummary = () => (
    <LinearGradient
      colors={['#10B981', '#059669']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryLabel}>Monthly Summary</Text>
        <View style={styles.balanceIndicator}>
          {monthlyBalance >= 0 ? (
            <TrendingUp size={20} color="#ffffff" strokeWidth={2} />
          ) : (
            <TrendingDown size={20} color="#ffffff" strokeWidth={2} />
          )}
        </View>
      </View>
      
      <Text style={styles.summaryAmount}>
        ₹{Math.abs(monthlyBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </Text>
      <Text style={styles.summaryStatus}>
        {monthlyBalance >= 0 ? 'Money Saved' : 'Over Budget'}
      </Text>
      
      <View style={styles.summaryStats}>
        <View style={styles.summaryStatItem}>
          <Text style={styles.summaryStatLabel}>Income</Text>
          <Text style={styles.summaryStatAmount}>
            +₹{monthlyIncome.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryStatItem}>
          <Text style={styles.summaryStatLabel}>Expenses</Text>
          <Text style={styles.summaryStatAmount}>
            -₹{monthlyExpensesTotal.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderExpenseItem = ({ item }: { item: MonthlyExpense }) => (
    <TouchableOpacity style={styles.expenseItem} activeOpacity={0.7}>
      <View style={styles.expenseLeft}>
        <View style={[
          styles.expenseIcon,
          { backgroundColor: item.type === 'income' ? '#10B981' : '#3B82F6' }
        ]}>
          <Text style={styles.expenseEmoji}>{item.icon}</Text>
        </View>
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseCategory}>{item.category}</Text>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.expenseDate}>
            {new Date(item.date).toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short' 
            })}
          </Text>
        </View>
      </View>
      
      <View style={styles.expenseRight}>
        <Text style={[
          styles.expenseAmount,
          { color: item.type === 'income' ? '#10B981' : '#EF4444' }
        ]}>
          {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
        <TouchableOpacity style={styles.expenseMenuButton}>
          <MoreHorizontal size={16} color="#94a3b8" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSpendingChart = () => {
    const maxAmount = Math.max(...monthlyExpenses.filter(e => e.type === 'expense').map(e => e.amount));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Spending</Text>
        <View style={styles.chart}>
          {Array.from({ length: 7 }, (_, i) => {
            const height = Math.random() * 60 + 20; // Mock data
            return (
              <View key={i} style={styles.chartBar}>
                <View 
                  style={[
                    styles.chartBarFill,
                    { 
                      height: height,
                      backgroundColor: i === 5 ? '#3B82F6' : '#e2e8f0'
                    }
                  ]} 
                />
                <Text style={styles.chartBarLabel}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Expenses</Text>
        <Text style={styles.subtitle}>Track your spending patterns</Text>
      </View>

      {renderMonthHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderMonthSummary()}
        {renderSpendingChart()}
        
        <View style={styles.expensesSection}>
          <Text style={styles.sectionTitle}>All Transactions</Text>
          <FlatList
            data={monthlyExpenses}
            keyExtractor={(item) => item.id}
            renderItem={renderExpenseItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
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
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
  },
  summaryCard: {
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
  balanceIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  summaryStatus: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 20,
    fontWeight: '500',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
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
  summaryStatAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarFill: {
    width: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  chartBarLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  expensesSection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expenseIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  expenseEmoji: {
    fontSize: 20,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  expenseDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  expenseMenuButton: {
    padding: 4,
  },
});