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
import { 
  PiggyBank, 
  Target, 
  TrendingUp, 
  Calendar,
  Plus,
  ArrowUpRight,
  Coins,
  CreditCard,
  Building2
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  color: string;
  icon: string;
}

interface SavingsAccount {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  type: 'savings' | 'fixed_deposit' | 'recurring';
  color: string;
}

const savingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    deadline: '2025-12-31',
    category: 'Emergency',
    color: '#EF4444',
    icon: '🚨'
  },
  {
    id: '2',
    name: 'Vacation to Europe',
    targetAmount: 5000,
    currentAmount: 2800,
    deadline: '2025-08-15',
    category: 'Travel',
    color: '#3B82F6',
    icon: '✈️'
  },
  {
    id: '3',
    name: 'New Car',
    targetAmount: 25000,
    currentAmount: 8500,
    deadline: '2026-06-30',
    category: 'Vehicle',
    color: '#10B981',
    icon: '🚗'
  },
  {
    id: '4',
    name: 'Home Down Payment',
    targetAmount: 50000,
    currentAmount: 15000,
    deadline: '2027-01-01',
    category: 'Real Estate',
    color: '#F59E0B',
    icon: '🏠'
  }
];

const savingsAccounts: SavingsAccount[] = [
  {
    id: '1',
    name: 'High Yield Savings',
    balance: 12500,
    interestRate: 4.5,
    type: 'savings',
    color: '#10B981'
  },
  {
    id: '2',
    name: 'Fixed Deposit',
    balance: 25000,
    interestRate: 6.2,
    type: 'fixed_deposit',
    color: '#3B82F6'
  },
  {
    id: '3',
    name: 'Monthly SIP',
    balance: 8500,
    interestRate: 5.8,
    type: 'recurring',
    color: '#8B5CF6'
  }
];

export default function SavingsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'goals' | 'accounts'>('overview');
  const scaleValue = useSharedValue(1);

  const totalSavings = savingsAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalGoalsTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalsCurrent = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const goalsProgress = (totalGoalsCurrent / totalGoalsTarget) * 100;

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
      {(['overview', 'goals', 'accounts'] as const).map((tab) => (
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

  const renderOverviewCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewLabel}>Total Savings</Text>
            <View style={styles.savingsIcon}>
              <PiggyBank size={24} color="#ffffff" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.overviewAmount}>
            ₹{totalSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatLabel}>Monthly Growth</Text>
              <Text style={styles.overviewStatValue}>+₹1,25,000</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatLabel}>Interest Earned</Text>
              <Text style={styles.overviewStatValue}>+₹18,500</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderGoalCard = (goal: SavingsGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    
    return (
      <TouchableOpacity key={goal.id} style={styles.goalCard} activeOpacity={0.7}>
        <View style={styles.goalHeader}>
          <View style={[styles.goalIcon, { backgroundColor: goal.color }]}>
            <Text style={styles.goalEmoji}>{goal.icon}</Text>
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{goal.name}</Text>
            <Text style={styles.goalCategory}>{goal.category}</Text>
          </View>
          <View style={styles.goalProgress}>
            <Text style={styles.goalProgressText}>{Math.round(progress)}%</Text>
          </View>
        </View>
        
        <View style={styles.goalAmounts}>
          <Text style={styles.goalCurrent}>
            ₹{goal.currentAmount.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.goalTarget}>
            of ₹{goal.targetAmount.toLocaleString('en-IN')}
          </Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill,
                { width: `${Math.min(progress, 100)}%`, backgroundColor: goal.color }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.goalFooter}>
          <Text style={styles.goalRemaining}>
            ₹{remaining.toLocaleString('en-IN')} remaining
          </Text>
          <Text style={styles.goalDeadline}>
            Due: {new Date(goal.deadline).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAccountCard = (account: SavingsAccount) => {
    const getAccountIcon = () => {
      switch (account.type) {
        case 'savings': return <Coins size={24} color="#ffffff" strokeWidth={2} />;
        case 'fixed_deposit': return <Building2 size={24} color="#ffffff" strokeWidth={2} />;
        case 'recurring': return <CreditCard size={24} color="#ffffff" strokeWidth={2} />;
        default: return <Coins size={24} color="#ffffff" strokeWidth={2} />;
      }
    };

    const getAccountType = () => {
      switch (account.type) {
        case 'savings': return 'Savings Account';
        case 'fixed_deposit': return 'Fixed Deposit';
        case 'recurring': return 'Recurring Deposit';
        default: return 'Account';
      }
    };

    return (
      <TouchableOpacity key={account.id} style={styles.accountCard} activeOpacity={0.7}>
        <LinearGradient
          colors={[account.color, account.color + '80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.accountGradient}>
          <View style={styles.accountHeader}>
            <View style={styles.accountIconContainer}>
              {getAccountIcon()}
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountType}>{getAccountType()}</Text>
            </View>
            <View style={styles.accountRate}>
              <Text style={styles.accountRateText}>{account.interestRate}%</Text>
              <Text style={styles.accountRateLabel}>APY</Text>
            </View>
          </View>
          
          <Text style={styles.accountBalance}>
            ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          
          <View style={styles.accountFooter}>
            <Text style={styles.accountEarnings}>
              Monthly: +₹{((account.balance * account.interestRate) / 100 / 12).toFixed(0)}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-savings')}>
              <Plus size={20} color="#3B82F6" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderGoalsProgress = () => (
    <View style={styles.goalsProgressCard}>
      <View style={styles.goalsProgressHeader}>
        <Target size={24} color="#3B82F6" strokeWidth={2} />
        <Text style={styles.goalsProgressTitle}>Goals Progress</Text>
      </View>
      <Text style={styles.goalsProgressAmount}>
        ₹{totalGoalsCurrent.toLocaleString('en-IN')} / ₹{totalGoalsTarget.toLocaleString('en-IN')}
      </Text>
      <View style={styles.goalsProgressBarContainer}>
        <View style={styles.goalsProgressBar}>
          <View 
            style={[
              styles.goalsProgressBarFill,
              { width: `${Math.min(goalsProgress, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.goalsProgressPercent}>{Math.round(goalsProgress)}%</Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View>
            {renderOverviewCard()}
            {renderGoalsProgress()}
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                  onPress={() => router.push('/add-savings')}>
                  <PiggyBank size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Add Savings</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                  onPress={() => router.push('/new-goal')}>
                  <Target size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>New Goal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case 'goals':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Savings Goals</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/new-goal')}>
                <Plus size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            {savingsGoals.map(renderGoalCard)}
          </View>
        );
      case 'accounts':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Savings Accounts</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/add-savings')}>
                <Plus size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            {savingsAccounts.map(renderAccountCard)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Savings & Goals</Text>
        <Text style={styles.subtitle}>Build your financial future</Text>
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
  overviewCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  savingsIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  overviewAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewStat: {
    flex: 1,
  },
  overviewStatLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 4,
  },
  overviewStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  goalsProgressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  goalsProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalsProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },
  goalsProgressAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 16,
  },
  goalsProgressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalsProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginRight: 12,
  },
  goalsProgressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  goalsProgressPercent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
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
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalEmoji: {
    fontSize: 20,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  goalCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  goalProgress: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  goalCurrent: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginRight: 8,
  },
  goalTarget: {
    fontSize: 14,
    color: '#64748b',
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalRemaining: {
    fontSize: 14,
    color: '#64748b',
  },
  goalDeadline: {
    fontSize: 12,
    color: '#94a3b8',
  },
  accountCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  accountGradient: {
    padding: 20,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  accountRate: {
    alignItems: 'center',
  },
  accountRateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  accountRateLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  accountBalance: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
  },
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountEarnings: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  accountAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 6,
  },
  quickActions: {
    marginBottom: 24,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
});