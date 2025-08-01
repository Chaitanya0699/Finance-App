import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, ChartBar as BarChart3, ChartPie as PieChart, DollarSign, Plus, ArrowUpRight, ArrowDownRight, Building2, Briefcase, Globe, Zap } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  shares: number;
  value: number;
  color: string;
}

interface MutualFund {
  id: string;
  name: string;
  nav: number;
  change: number;
  changePercent: number;
  units: number;
  value: number;
  category: string;
  risk: 'Low' | 'Medium' | 'High';
  color: string;
}

const stocks: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 185.25,
    change: 2.45,
    changePercent: 1.34,
    shares: 25,
    value: 4631.25,
    color: '#3B82F6'
  },
  {
    id: '2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.80,
    change: -1.20,
    changePercent: -0.83,
    shares: 15,
    value: 2142.00,
    color: '#10B981'
  },
  {
    id: '3',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.90,
    change: 4.15,
    changePercent: 1.11,
    shares: 12,
    value: 4546.80,
    color: '#8B5CF6'
  },
  {
    id: '4',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.50,
    change: -8.25,
    changePercent: -3.21,
    shares: 8,
    value: 1988.00,
    color: '#EF4444'
  }
];

const mutualFunds: MutualFund[] = [
  {
    id: '1',
    name: 'Large Cap Growth Fund',
    nav: 45.67,
    change: 0.23,
    changePercent: 0.51,
    units: 150,
    value: 6850.50,
    category: 'Large Cap',
    risk: 'Medium',
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Mid Cap Value Fund',
    nav: 32.18,
    change: -0.15,
    changePercent: -0.46,
    units: 200,
    value: 6436.00,
    category: 'Mid Cap',
    risk: 'High',
    color: '#F59E0B'
  },
  {
    id: '3',
    name: 'Bond Index Fund',
    nav: 28.95,
    change: 0.05,
    changePercent: 0.17,
    units: 300,
    value: 8685.00,
    category: 'Debt',
    risk: 'Low',
    color: '#10B981'
  },
  {
    id: '4',
    name: 'International Equity',
    nav: 38.42,
    change: 0.78,
    changePercent: 2.07,
    units: 100,
    value: 3842.00,
    category: 'International',
    risk: 'High',
    color: '#8B5CF6'
  }
];

export default function InvestmentsScreen() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'stocks' | 'mutual_funds'>('overview');
  const scaleValue = useSharedValue(1);

  const totalStocksValue = stocks.reduce((sum, stock) => sum + stock.value, 0);
  const totalMFValue = mutualFunds.reduce((sum, mf) => sum + mf.value, 0);
  const totalPortfolioValue = totalStocksValue + totalMFValue;
  
  const totalDayChange = stocks.reduce((sum, stock) => sum + (stock.change * stock.shares), 0) +
                        mutualFunds.reduce((sum, mf) => sum + (mf.change * mf.units), 0);
  
  const totalDayChangePercent = (totalDayChange / totalPortfolioValue) * 100;

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
      {(['overview', 'stocks', 'mutual_funds'] as const).map((tab) => (
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
            {tab === 'mutual_funds' ? 'Mutual Funds' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPortfolioCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={totalDayChange >= 0 ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.portfolioCard}>
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioLabel}>Portfolio Value</Text>
            <View style={styles.trendIcon}>
              {totalDayChange >= 0 ? (
                <TrendingUp size={24} color="#ffffff" strokeWidth={2} />
              ) : (
                <TrendingDown size={24} color="#ffffff" strokeWidth={2} />
              )}
            </View>
          </View>
          <Text style={styles.portfolioAmount}>
            ₹{totalPortfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.portfolioChange}>
            <Text style={styles.portfolioChangeAmount}>
              {totalDayChange >= 0 ? '+' : ''}₹{totalDayChange.toFixed(2)}
            </Text>
            <Text style={styles.portfolioChangePercent}>
              ({totalDayChangePercent >= 0 ? '+' : ''}{totalDayChangePercent.toFixed(2)}%)
            </Text>
          </View>
          <Text style={styles.portfolioSubtext}>Today's Change</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderAllocationCard = () => (
    <View style={styles.allocationCard}>
      <View style={styles.allocationHeader}>
        <PieChart size={24} color="#3B82F6" strokeWidth={2} />
        <Text style={styles.allocationTitle}>Asset Allocation</Text>
      </View>
      <View style={styles.allocationItems}>
        <View style={styles.allocationItem}>
          <View style={[styles.allocationDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.allocationLabel}>Stocks</Text>
          <Text style={styles.allocationValue}>
            ${totalStocksValue.toLocaleString()} ({((totalStocksValue / totalPortfolioValue) * 100).toFixed(1)}%)
          </Text>
        </View>
        <View style={styles.allocationItem}>
          <View style={[styles.allocationDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.allocationLabel}>Mutual Funds</Text>
          <Text style={styles.allocationValue}>
            ${totalMFValue.toLocaleString()} ({((totalMFValue / totalPortfolioValue) * 100).toFixed(1)}%)
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStockCard = (stock: Stock) => (
    <TouchableOpacity key={stock.id} style={styles.stockCard} activeOpacity={0.7}>
      <View style={styles.stockHeader}>
        <View style={[styles.stockIcon, { backgroundColor: stock.color }]}>
          <Building2 size={20} color="#ffffff" strokeWidth={2} />
        </View>
        <View style={styles.stockInfo}>
          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          <Text style={styles.stockName}>{stock.name}</Text>
        </View>
        <View style={styles.stockChange}>
          {stock.change >= 0 ? (
            <ArrowUpRight size={16} color="#10B981" strokeWidth={2} />
          ) : (
            <ArrowDownRight size={16} color="#EF4444" strokeWidth={2} />
          )}
        </View>
      </View>
      
      <View style={styles.stockDetails}>
        <View style={styles.stockPrice}>
          <Text style={styles.stockPriceAmount}>₹{stock.price.toFixed(2)}</Text>
          <Text style={[
            styles.stockPriceChange,
            { color: stock.change >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </Text>
        </View>
        <View style={styles.stockHolding}>
          <Text style={styles.stockShares}>{stock.shares} shares</Text>
          <Text style={styles.stockValue}>₹{stock.value.toLocaleString('en-IN')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMutualFundCard = (mf: MutualFund) => {
    const getRiskColor = (risk: string) => {
      switch (risk) {
        case 'Low': return '#10B981';
        case 'Medium': return '#F59E0B';
        case 'High': return '#EF4444';
        default: return '#64748B';
      }
    };

    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'Large Cap': return <Building2 size={20} color="#ffffff" strokeWidth={2} />;
        case 'Mid Cap': return <Briefcase size={20} color="#ffffff" strokeWidth={2} />;
        case 'Debt': return <DollarSign size={20} color="#ffffff" strokeWidth={2} />;
        case 'International': return <Globe size={20} color="#ffffff" strokeWidth={2} />;
        default: return <BarChart3 size={20} color="#ffffff" strokeWidth={2} />;
      }
    };

    return (
      <TouchableOpacity key={mf.id} style={styles.mfCard} activeOpacity={0.7}>
        <View style={styles.mfHeader}>
          <View style={[styles.mfIcon, { backgroundColor: mf.color }]}>
            {getCategoryIcon(mf.category)}
          </View>
          <View style={styles.mfInfo}>
            <Text style={styles.mfName}>{mf.name}</Text>
            <View style={styles.mfMeta}>
              <Text style={styles.mfCategory}>{mf.category}</Text>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(mf.risk) }]}>
                <Text style={styles.riskText}>{mf.risk}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.mfDetails}>
          <View style={styles.mfNav}>
            <Text style={styles.mfNavAmount}>₹{mf.nav.toFixed(2)}</Text>
            <Text style={[
              styles.mfNavChange,
              { color: mf.change >= 0 ? '#10B981' : '#EF4444' }
            ]}>
              {mf.change >= 0 ? '+' : ''}₹{mf.change.toFixed(2)} ({mf.changePercent >= 0 ? '+' : ''}{mf.changePercent.toFixed(2)}%)
            </Text>
          </View>
          <View style={styles.mfHolding}>
            <Text style={styles.mfUnits}>{mf.units} units</Text>
            <Text style={styles.mfValue}>₹{mf.value.toLocaleString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPerformanceChart = () => (
    <View style={styles.performanceCard}>
      <View style={styles.performanceHeader}>
        <BarChart3 size={24} color="#3B82F6" strokeWidth={2} />
        <Text style={styles.performanceTitle}>Performance</Text>
      </View>
      <View style={styles.performanceChart}>
        {Array.from({ length: 7 }, (_, i) => {
          const height = Math.random() * 60 + 20;
          const isPositive = Math.random() > 0.5;
          return (
            <View key={i} style={styles.performanceBar}>
              <View 
                style={[
                  styles.performanceBarFill,
                  { 
                    height: height,
                    backgroundColor: isPositive ? '#10B981' : '#EF4444'
                  }
                ]} 
              />
              <Text style={styles.performanceBarLabel}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View>
            {renderPortfolioCard()}
            {renderAllocationCard()}
            {renderPerformanceChart()}
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}>
                  <Plus size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Buy Stocks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]}>
                  <Zap size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Start SIP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case 'stocks':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Stock Holdings</Text>
              <TouchableOpacity style={styles.addButton}>
                <Plus size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Total Value: ₹{totalStocksValue.toLocaleString('en-IN')}
            </Text>
            {stocks.map(renderStockCard)}
          </View>
        );
      case 'mutual_funds':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mutual Fund Holdings</Text>
              <TouchableOpacity style={styles.addButton}>
                <Plus size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Total Value: ₹{totalMFValue.toLocaleString()}
            </Text>
            {mutualFunds.map(renderMutualFundCard)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Investments</Text>
        <Text style={styles.subtitle}>Grow your wealth smartly</Text>
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
  portfolioCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portfolioLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  trendIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  portfolioAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  portfolioChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  portfolioChangeAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  portfolioChangePercent: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  portfolioSubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  allocationCard: {
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
  allocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  allocationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },
  allocationItems: {
    gap: 12,
  },
  allocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  allocationLabel: {
    fontSize: 16,
    color: '#64748b',
    flex: 1,
  },
  allocationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  performanceCard: {
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
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },
  performanceChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
  },
  performanceBar: {
    alignItems: 'center',
    flex: 1,
  },
  performanceBarFill: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  performanceBarLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 8,
  },
  stockCard: {
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
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  stockName: {
    fontSize: 14,
    color: '#64748b',
  },
  stockChange: {
    padding: 8,
  },
  stockDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockPrice: {
    flex: 1,
  },
  stockPriceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  stockPriceChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  stockHolding: {
    alignItems: 'flex-end',
  },
  stockShares: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  mfCard: {
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
  mfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mfIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mfInfo: {
    flex: 1,
  },
  mfName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  mfMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mfCategory: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 12,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  mfDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mfNav: {
    flex: 1,
  },
  mfNavAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  mfNavChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  mfHolding: {
    alignItems: 'flex-end',
  },
  mfUnits: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  mfValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
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