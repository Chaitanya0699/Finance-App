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

interface Asset {
  id: string;
  name: string;
  type: 'property' | 'vehicle' | 'gold' | 'investment' | 'other';
  currentValue: number;
  purchaseValue: number;
  acquisitionDate: string;
  lastUpdated: string;
  notes?: string;
  color: string;
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  color: string;
}

interface Investment {
  id: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'bond' | 'crypto';
  currentValue: number;
  investedAmount: number;
  change: number;
  changePercent: number;
  color: string;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Apartment - Mumbai',
    type: 'property',
    currentValue: 8500000,
    purchaseValue: 6500000,
    acquisitionDate: '2020-03-15',
    lastUpdated: '2025-01-15',
    notes: '2BHK apartment in Bandra West',
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Honda City',
    type: 'vehicle',
    currentValue: 650000,
    purchaseValue: 1200000,
    acquisitionDate: '2021-08-20',
    lastUpdated: '2025-01-10',
    notes: 'White Honda City 2021 model',
    color: '#10B981'
  },
  {
    id: '3',
    name: 'Gold Jewelry',
    type: 'gold',
    currentValue: 450000,
    purchaseValue: 380000,
    acquisitionDate: '2022-11-05',
    lastUpdated: '2025-01-12',
    notes: '75 grams of 22K gold jewelry',
    color: '#F59E0B'
  },
];

const mockSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 1000000,
    currentAmount: 650000,
    deadline: '2025-12-31',
    category: 'Emergency',
    color: '#EF4444'
  },
  {
    id: '2',
    name: 'Vacation to Europe',
    targetAmount: 500000,
    currentAmount: 280000,
    deadline: '2025-08-15',
    category: 'Travel',
    color: '#3B82F6'
  },
];

const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'HDFC Large Cap Fund',
    type: 'mutual_fund',
    currentValue: 685050,
    investedAmount: 650000,
    change: 35050,
    changePercent: 5.39,
    color: '#10B981'
  },
  {
    id: '2',
    name: 'Reliance Industries',
    type: 'stock',
    currentValue: 245000,
    investedAmount: 230000,
    change: 15000,
    changePercent: 6.52,
    color: '#3B82F6'
  },
];

export default function WealthScreen() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'savings' | 'assets' | 'investments'>('overview');
  const scaleValue = useSharedValue(1);

  const totalAssets = mockAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalSavings = mockSavingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalInvestments = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalWealth = totalAssets + totalSavings + totalInvestments;

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalGains = mockInvestments.reduce((sum, inv) => sum + inv.change, 0);
  const totalGainsPercent = (totalGains / totalInvested) * 100;

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
      {(['overview', 'savings', 'assets', 'investments'] as const).map((tab) => (
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

  const renderWealthCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.wealthCard}>
          <View style={styles.wealthHeader}>
            <Text style={styles.wealthLabel}>Total Wealth</Text>
            <View style={styles.wealthIcon}>
              <Icon name="trending-up" size={24} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.wealthAmount}>
            ₹{totalWealth.toLocaleString('en-IN')}
          </Text>
          <View style={styles.wealthBreakdown}>
            <View style={styles.wealthItem}>
              <Text style={styles.wealthItemLabel}>Assets</Text>
              <Text style={styles.wealthItemValue}>₹{(totalAssets / 100000).toFixed(1)}L</Text>
            </View>
            <View style={styles.wealthItem}>
              <Text style={styles.wealthItemLabel}>Savings</Text>
              <Text style={styles.wealthItemValue}>₹{(totalSavings / 100000).toFixed(1)}L</Text>
            </View>
            <View style={styles.wealthItem}>
              <Text style={styles.wealthItemLabel}>Investments</Text>
              <Text style={styles.wealthItemValue}>₹{(totalInvestments / 100000).toFixed(1)}L</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSavingsGoal = (goal: SavingsGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    
    return (
      <TouchableOpacity key={goal.id} style={styles.goalCard} activeOpacity={0.7}>
        <View style={styles.goalHeader}>
          <View style={[styles.goalIcon, { backgroundColor: goal.color }]}>
            <Icon name="target" size={20} color="#ffffff" />
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

  const renderAsset = (asset: Asset) => {
    const gainLoss = asset.currentValue - asset.purchaseValue;
    const gainLossPercent = (gainLoss / asset.purchaseValue) * 100;

    return (
      <TouchableOpacity 
        key={asset.id} 
        style={styles.assetCard} 
        activeOpacity={0.7}>
        <View style={styles.assetHeader}>
          <View style={[styles.assetIcon, { backgroundColor: asset.color }]}>
            <Icon name="home" size={20} color="#ffffff" />
          </View>
          <View style={styles.assetInfo}>
            <Text style={styles.assetName}>{asset.name}</Text>
            <Text style={styles.assetType}>
              {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
            </Text>
          </View>
          <View style={styles.assetTrend}>
            {gainLoss >= 0 ? (
              <Icon name="arrow-up-right" size={16} color="#10B981" />
            ) : (
              <Icon name="arrow-down-right" size={16} color="#EF4444" />
            )}
          </View>
        </View>

        <View style={styles.assetDetails}>
          <View style={styles.assetValue}>
            <Text style={styles.assetCurrentValue}>
              ₹{asset.currentValue.toLocaleString('en-IN')}
            </Text>
            <Text style={[
              styles.assetGainLoss,
              { color: gainLoss >= 0 ? '#10B981' : '#EF4444' }
            ]}>
              {gainLoss >= 0 ? '+' : ''}₹{Math.abs(gainLoss).toLocaleString('en-IN')} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(1)}%)
            </Text>
          </View>
          <View style={styles.assetMeta}>
            <Text style={styles.assetPurchaseValue}>
              Purchase: ₹{asset.purchaseValue.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.assetDate}>
              {new Date(asset.acquisitionDate).toLocaleDateString('en-IN', {
                month: 'short',
                year: 'numeric'
              })}
            </Text>
          </View>
        </View>

        {asset.notes && (
          <Text style={styles.assetNotes} numberOfLines={2}>
            {asset.notes}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderInvestment = (investment: Investment) => (
    <TouchableOpacity key={investment.id} style={styles.investmentCard} activeOpacity={0.7}>
      <View style={styles.investmentHeader}>
        <View style={[styles.investmentIcon, { backgroundColor: investment.color }]}>
          <Icon name="bar-chart-2" size={20} color="#ffffff" />
        </View>
        <View style={styles.investmentInfo}>
          <Text style={styles.investmentName}>{investment.name}</Text>
          <Text style={styles.investmentType}>
            {investment.type.replace('_', ' ').charAt(0).toUpperCase() + investment.type.replace('_', ' ').slice(1)}
          </Text>
        </View>
        <View style={styles.investmentTrend}>
          {investment.change >= 0 ? (
            <Icon name="arrow-up-right" size={16} color="#10B981" />
          ) : (
            <Icon name="arrow-down-right" size={16} color="#EF4444" />
          )}
        </View>
      </View>
      
      <View style={styles.investmentDetails}>
        <View style={styles.investmentValue}>
          <Text style={styles.investmentCurrentValue}>
            ₹{investment.currentValue.toLocaleString('en-IN')}
          </Text>
          <Text style={[
            styles.investmentGainLoss,
            { color: investment.change >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            {investment.change >= 0 ? '+' : ''}₹{Math.abs(investment.change).toLocaleString('en-IN')} ({investment.changePercent >= 0 ? '+' : ''}{investment.changePercent.toFixed(2)}%)
          </Text>
        </View>
        <Text style={styles.investmentInvested}>
          Invested: ₹{investment.investedAmount.toLocaleString('en-IN')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View>
            {renderWealthCard()}
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]}>
                  <Icon name="plus" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Add Savings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}>
                  <Icon name="home" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Add Asset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}>
                  <Icon name="trending-up" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Invest</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case 'savings':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Savings Goals</Text>
              <TouchableOpacity style={styles.addButton}>
                <Icon name="plus" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            {mockSavingsGoals.map(renderSavingsGoal)}
          </View>
        );
      case 'assets':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Physical Assets</Text>
              <TouchableOpacity style={styles.addButton}>
                <Icon name="plus" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            {mockAssets.map(renderAsset)}
          </View>
        );
      case 'investments':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Investment Portfolio</Text>
              <TouchableOpacity style={styles.addButton}>
                <Icon name="plus" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            <View style={styles.investmentSummary}>
              <Text style={styles.investmentSummaryLabel}>Portfolio Performance</Text>
              <Text style={[
                styles.investmentSummaryValue,
                { color: totalGains >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                {totalGains >= 0 ? '+' : ''}₹{Math.abs(totalGains).toLocaleString('en-IN')} ({totalGainsPercent >= 0 ? '+' : ''}{totalGainsPercent.toFixed(2)}%)
              </Text>
            </View>
            {mockInvestments.map(renderInvestment)}
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
        <Text style={styles.title}>Wealth Management</Text>
        <Text style={styles.subtitle}>Grow and track your wealth</Text>
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
    fontSize: 12,
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
  wealthCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  wealthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wealthLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  wealthIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  wealthAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
  },
  wealthBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wealthItem: {
    alignItems: 'center',
    flex: 1,
  },
  wealthItemLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  wealthItemValue: {
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
  assetCard: {
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
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  assetType: {
    fontSize: 14,
    color: '#64748b',
  },
  assetTrend: {
    padding: 8,
  },
  assetDetails: {
    marginBottom: 12,
  },
  assetValue: {
    marginBottom: 8,
  },
  assetCurrentValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  assetGainLoss: {
    fontSize: 16,
    fontWeight: '600',
  },
  assetMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetPurchaseValue: {
    fontSize: 14,
    color: '#64748b',
  },
  assetDate: {
    fontSize: 14,
    color: '#64748b',
  },
  assetNotes: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  investmentCard: {
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
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  investmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  investmentType: {
    fontSize: 14,
    color: '#64748b',
  },
  investmentTrend: {
    padding: 8,
  },
  investmentDetails: {
    marginBottom: 12,
  },
  investmentValue: {
    marginBottom: 8,
  },
  investmentCurrentValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  investmentGainLoss: {
    fontSize: 16,
    fontWeight: '600',
  },
  investmentInvested: {
    fontSize: 14,
    color: '#64748b',
  },
  investmentSummary: {
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
  investmentSummaryLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  investmentSummaryValue: {
    fontSize: 20,
    fontWeight: '700',
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