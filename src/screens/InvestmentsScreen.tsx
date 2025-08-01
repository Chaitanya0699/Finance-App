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
                <Icon name="trending-up" size={24} color="#ffffff" />
              ) : (
                <Icon name="trending-down" size={24} color="#ffffff" />
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

  const renderStockCard = (stock: Stock) => (
    <TouchableOpacity key={stock.id} style={styles.stockCard} activeOpacity={0.7}>
      <View style={styles.stockHeader}>
        <View style={[styles.stockIcon, { backgroundColor: stock.color }]}>
          <Icon name="home" size={20} color="#ffffff" />
        </View>
        <View style={styles.stockInfo}>
          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          <Text style={styles.stockName}>{stock.name}</Text>
        </View>
        <View style={styles.stockChange}>
          {stock.change >= 0 ? (
            <Icon name="arrow-up-right" size={16} color="#10B981" />
          ) : (
            <Icon name="arrow-down-right" size={16} color="#EF4444" />
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

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View>
            {renderPortfolioCard()}
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}>
                  <Icon name="plus" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Buy Stocks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]}>
                  <Icon name="zap" size={20} color="#ffffff" />
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
                <Icon name="plus" size={20} color="#3B82F6" />
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
                <Icon name="plus" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Total Value: ₹{totalMFValue.toLocaleString()}
            </Text>
            {mutualFunds.map((mf) => (
              <TouchableOpacity key={mf.id} style={styles.mfCard} activeOpacity={0.7}>
                <View style={styles.mfHeader}>
                  <View style={[styles.mfIcon, { backgroundColor: mf.color }]}>
                    <Icon name="bar-chart-2" size={20} color="#ffffff" />
                  </View>
                  <View style={styles.mfInfo}>
                    <Text style={styles.mfName}>{mf.name}</Text>
                    <View style={styles.mfMeta}>
                      <Text style={styles.mfCategory}>{mf.category}</Text>
                      <View style={[styles.riskBadge, { backgroundColor: mf.risk === 'Low' ? '#10B981' : mf.risk === 'Medium' ? '#F59E0B' : '#EF4444' }]}>
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
            ))}
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