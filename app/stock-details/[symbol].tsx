import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Minus, Building2, ChartBar as BarChart3, DollarSign } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock data
const mockStockDetails = {
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 18525.00,
    change: 245.00,
    changePercent: 1.34,
    shares: 25,
    value: 463125.00,
    dayHigh: 18650.00,
    dayLow: 18400.00,
    volume: 45678900,
    marketCap: 2890000000000,
    pe: 28.5,
    dividend: 0.96,
    about: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    priceHistory: [
      { date: '2025-01-15', price: 18525 },
      { date: '2025-01-14', price: 18280 },
      { date: '2025-01-13', price: 18450 },
      { date: '2025-01-12', price: 18200 },
      { date: '2025-01-11', price: 18350 },
      { date: '2025-01-10', price: 18100 },
      { date: '2025-01-09', price: 18250 },
    ]
  }
};

export default function StockDetailsScreen() {
  const router = useRouter();
  const { symbol } = useLocalSearchParams();
  const [stock] = useState(mockStockDetails[symbol as string]);
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '1Y'>('1W');

  if (!stock) {
    return (
      <View style={styles.container}>
        <Text>Stock not found</Text>
      </View>
    );
  }

  const renderChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Price Chart</Text>
        <View style={styles.periodSelector}>
          {(['1D', '1W', '1M', '1Y'] as const).map((period) => (
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
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.chart}>
        {stock.priceHistory.map((point, index) => {
          const height = ((point.price - 18000) / 1000) * 60 + 20;
          return (
            <View key={index} style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill,
                  { 
                    height: height,
                    backgroundColor: stock.change >= 0 ? '#10B981' : '#EF4444'
                  }
                ]} 
              />
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1e293b" strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          <Text style={styles.stockName}>{stock.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Plus size={20} color="#10B981" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Minus size={20} color="#EF4444" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={stock.change >= 0 ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.priceCard}>
          <View style={styles.priceHeader}>
            <Text style={styles.priceLabel}>Current Price</Text>
            {stock.change >= 0 ? (
              <TrendingUp size={24} color="#ffffff" strokeWidth={2} />
            ) : (
              <TrendingDown size={24} color="#ffffff" strokeWidth={2} />
            )}
          </View>
          <Text style={styles.priceAmount}>
            ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.priceChange}>
            {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </Text>
          <Text style={styles.priceSubtext}>Today's Change</Text>
        </LinearGradient>

        <View style={styles.holdingCard}>
          <Text style={styles.cardTitle}>Your Holdings</Text>
          <View style={styles.holdingDetails}>
            <View style={styles.holdingItem}>
              <Text style={styles.holdingLabel}>Shares Owned</Text>
              <Text style={styles.holdingValue}>{stock.shares}</Text>
            </View>
            <View style={styles.holdingItem}>
              <Text style={styles.holdingLabel}>Total Value</Text>
              <Text style={styles.holdingValue}>₹{stock.value.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.holdingItem}>
              <Text style={styles.holdingLabel}>Avg. Cost</Text>
              <Text style={styles.holdingValue}>₹{(stock.value / stock.shares).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {renderChart()}

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Key Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Day High</Text>
              <Text style={styles.statValue}>₹{stock.dayHigh.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Day Low</Text>
              <Text style={styles.statValue}>₹{stock.dayLow.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Volume</Text>
              <Text style={styles.statValue}>{(stock.volume / 1000000).toFixed(1)}M</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>₹{(stock.marketCap / 1000000000000).toFixed(1)}T</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>P/E Ratio</Text>
              <Text style={styles.statValue}>{stock.pe}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Dividend</Text>
              <Text style={styles.statValue}>{stock.dividend}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.cardTitle}>About {stock.name}</Text>
          <Text style={styles.aboutText}>{stock.about}</Text>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={[styles.tradeButton, { backgroundColor: '#10B981' }]}>
            <Plus size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.tradeButtonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tradeButton, { backgroundColor: '#EF4444' }]}>
            <Minus size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.tradeButtonText}>Sell</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  stockSymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  stockName: {
    fontSize: 14,
    color: '#64748b',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  priceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  priceChange: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  holdingCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  holdingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  holdingItem: {
    alignItems: 'center',
  },
  holdingLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  holdingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  chartContainer: {
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  periodButtonTextActive: {
    color: '#ffffff',
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
    width: 20,
    borderRadius: 10,
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  aboutCard: {
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
  aboutText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  actionsCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  tradeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
});