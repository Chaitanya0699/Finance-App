import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TrendingUp,
  Plus,
  Building2,
  TriangleAlert as AlertTriangle,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Briefcase,
  Car,
  Coins,
  Chrome as Home,
  User,
  ChartPie as PieChart,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAssets } from '../../hooks/useFirebaseData';
import { useAuth } from '../../contexts/AuthContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';


export default function PortfolioScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { assets, loading } = useAssets();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'stocks' | 'mutual_funds' | 'assets'>('overview');
  const scaleValue = useSharedValue(1);

  if (!user) {
    return null;
  }

  const stockAssets = assets.filter(asset => asset.type === 'investment');
  const physicalAssets = assets.filter(asset => asset.type !== 'investment');
  
  const totalStocksValue = stockAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalAssetsValue = physicalAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalPortfolioValue = totalStocksValue + totalAssetsValue;
  
  // Calculate day change (mock for now)
  const totalDayChange = totalPortfolioValue * 0.01; // 1% mock change
  
  const totalDayChangePercent = (totalDayChange / totalPortfolioValue) * 100;

  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handleCardPress = () => {
    scaleValue.value = withSpring(0.95, { duration: 100 }, () => {
      scaleValue.value = withSpring(1);
    });
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'property': return <Home size={20} color="#ffffff" strokeWidth={2} />;
      case 'vehicle': return <Car size={20} color="#ffffff" strokeWidth={2} />;
      case 'gold': return <Coins size={20} color="#ffffff" strokeWidth={2} />;
      default: return <Building2 size={20} color="#ffffff" strokeWidth={2} />;
    }
  };

  const renderTabSelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      style={styles.tabSelector}>
      {(['overview', 'stocks', 'mutual_funds', 'assets'] as const).map((tab) => (
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
    </ScrollView>
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
            <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
            <View style={styles.trendIcon}>
              {totalDayChange >= 0 ? (
                <TrendingUp size={24} color="#ffffff" strokeWidth={2} />
              ) : (
                <ArrowDownRight size={24} color="#ffffff" strokeWidth={2} />
              )}
            </View>
          </View>
          <Text style={styles.portfolioAmount}>
            ₹{totalPortfolioValue.toLocaleString('en-IN')}
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
        <Text style={styles.allocationTitle}>Portfolio Allocation</Text>
      </View>
      <View style={styles.allocationItems}>
        <View style={styles.allocationItem}>
          <View style={[styles.allocationDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.allocationLabel}>Stocks</Text>
          <Text style={styles.allocationValue}>
            ₹{totalStocksValue.toLocaleString('en-IN')} ({totalPortfolioValue > 0 ? ((totalStocksValue / totalPortfolioValue) * 100).toFixed(1) : 0}%)
          </Text>
        </View>
        <View style={styles.allocationItem}>
          <View style={[styles.allocationDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.allocationLabel}>Investments</Text>
          <Text style={styles.allocationValue}>
            ₹{totalStocksValue.toLocaleString('en-IN')} ({totalPortfolioValue > 0 ? ((totalStocksValue / totalPortfolioValue) * 100).toFixed(1) : 0}%)
          </Text>
        </View>
        <View style={styles.allocationItem}>
          <View style={[styles.allocationDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.allocationLabel}>Assets</Text>
          <Text style={styles.allocationValue}>
            ₹{totalAssetsValue.toLocaleString('en-IN')} ({totalPortfolioValue > 0 ? ((totalAssetsValue / totalPortfolioValue) * 100).toFixed(1) : 0}%)
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAssetCard = (asset: any) => (
    <TouchableOpacity key={asset.id} style={styles.itemCard} activeOpacity={0.7}>
      <View style={styles.itemHeader}>
        <View style={[styles.itemIcon, { backgroundColor: '#3B82F6' }]}>
          <Building2 size={20} color="#ffffff" strokeWidth={2} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{asset.name}</Text>
          <Text style={styles.itemSubtitle}>{asset.type}</Text>
        </View>
        <View style={styles.itemTrend}>
          {asset.currentValue >= asset.purchaseValue ? (
            <ArrowUpRight size={16} color="#10B981" strokeWidth={2} />
          ) : (
            <ArrowDownRight size={16} color="#EF4444" strokeWidth={2} />
          )}
        </View>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemValue}>₹{asset.currentValue.toLocaleString('en-IN')}</Text>
        <Text style={[styles.itemChange, { color: asset.currentValue >= asset.purchaseValue ? '#10B981' : '#EF4444' }]}>
          {asset.currentValue >= asset.purchaseValue ? '+' : ''}₹{Math.abs(asset.currentValue - asset.purchaseValue).toFixed(2)} 
          ({asset.currentValue >= asset.purchaseValue ? '+' : ''}{(((asset.currentValue - asset.purchaseValue) / asset.purchaseValue) * 100).toFixed(2)}%)
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMutualFundCard = (mf: any) => (
    <TouchableOpacity key={mf.id} style={styles.itemCard} activeOpacity={0.7}>
      <View style={styles.itemHeader}>
        <View style={[styles.itemIcon, { backgroundColor: mf.color }]}>
          <Briefcase size={20} color="#ffffff" strokeWidth={2} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{mf.name}</Text>
          <Text style={styles.itemSubtitle}>{mf.category} • {mf.risk} Risk</Text>
        </View>
        <View style={styles.itemTrend}>
          {mf.change >= 0 ? (
            <ArrowUpRight size={16} color="#10B981" strokeWidth={2} />
          ) : (
            <ArrowDownRight size={16} color="#EF4444" strokeWidth={2} />
          )}
        </View>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemValue}>₹{mf.value.toLocaleString('en-IN')}</Text>
        <Text style={[styles.itemChange, { color: mf.change >= 0 ? '#10B981' : '#EF4444' }]}>
          {mf.change >= 0 ? '+' : ''}₹{mf.change.toFixed(2)} ({mf.changePercent >= 0 ? '+' : ''}{mf.changePercent.toFixed(2)}%)
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderAssetCard = (asset: any) => {
    const gainLoss = asset.currentValue - asset.purchaseValue;
    const gainLossPercent = (gainLoss / asset.purchaseValue) * 100;

    return (
      <TouchableOpacity key={asset.id} style={styles.itemCard} activeOpacity={0.7}>
        <View style={styles.itemHeader}>
          <View style={[styles.itemIcon, { backgroundColor: asset.color }]}>
            {getAssetIcon(asset.type)}
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{asset.name}</Text>
            <Text style={styles.itemSubtitle}>
              {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} • {new Date(asset.acquisitionDate).getFullYear()}
            </Text>
          </View>
          <View style={styles.itemTrend}>
            {gainLoss >= 0 ? (
              <ArrowUpRight size={16} color="#10B981" strokeWidth={2} />
            ) : (
              <ArrowDownRight size={16} color="#EF4444" strokeWidth={2} />
            )}
          </View>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemValue}>₹{asset.currentValue.toLocaleString('en-IN')}</Text>
          <Text style={[styles.itemChange, { color: gainLoss >= 0 ? '#10B981' : '#EF4444' }]}>
            {gainLoss >= 0 ? '+' : ''}₹{Math.abs(gainLoss).toLocaleString('en-IN')} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(1)}%)
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View>
            {renderPortfolioCard()}
            {renderAllocationCard()}
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                  onPress={() => router.push('/add-stock')}>
                  <Plus size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Buy Stock</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                  onPress={() => router.push('/add-mutual-fund')}>
                  <Plus size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Start SIP</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
                  onPress={() => router.push('/add-asset')}>
                  <Building2 size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Add Asset</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
                  onPress={() => router.push('/add-investment')}>
                  <Plus size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Add Investment</Text>
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
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/add-stock')}>
                <Plus size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Total Value: ₹{totalStocksValue.toLocaleString('en-IN')}
            </Text>
            {stockAssets.map(renderAssetCard)}
          </View>
        );
      case 'mutual_funds':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mutual Fund Holdings</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/add-mutual-fund')}>
                <Plus size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Total Value: ₹{totalStocksValue.toLocaleString('en-IN')}
            </Text>
            {stockAssets.map(renderAssetCard)}
          </View>
        );
      case 'assets':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Physical Assetsns</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/add-asset')}>
                <Plus size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Total Value: ₹{totalAssetsValue.toLocaleString('en-IN')}
            </Text>
            {physicalAssets.map(renderAssetCard)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Portfolio</Text>
        <Text style={styles.subtitle}>Investments & Assets</Text>
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
    backgroundColor: '#f8fafc' 
  },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 16 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: 4 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#64748b', 
    fontWeight: '500' 
  },
  tabSelector: { 
    marginHorizontal: 20,
    marginBottom: 16,
    maxHeight: 48,
  },
  tabContent: { 
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  tabButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    elevation: 1 
  },
  tabButtonActive: { 
    backgroundColor: '#3B82F6' 
  },
  tabButtonText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#64748b',
    textAlign: 'center',
  },
  tabButtonTextActive: { 
    color: '#ffffff' 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  portfolioCard: { 
    borderRadius: 20, 
    padding: 24, 
    marginBottom: 16, 
    elevation: 8 
  },
  portfolioHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  portfolioLabel: { 
    fontSize: 16, 
    color: '#ffffff', 
    opacity: 0.8, 
    fontWeight: '500' 
  },
  trendIcon: { 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 12, 
    padding: 8 
  },
  portfolioAmount: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#ffffff', 
    marginBottom: 4 
  },
  portfolioChange: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 2 
  },
  portfolioChangeAmount: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#ffffff', 
    marginRight: 8 
  },
  portfolioChangePercent: { 
    fontSize: 16, 
    color: '#ffffff', 
    opacity: 0.8 
  },
  portfolioSubtext: { 
    fontSize: 14, 
    color: '#ffffff', 
    opacity: 0.7 
  },
  allocationCard: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16, 
    elevation: 2 
  },
  allocationHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  allocationTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginLeft: 12 
  },
  allocationItems: { 
    gap: 12 
  },
  allocationItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  allocationDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginRight: 12 
  },
  allocationLabel: { 
    fontSize: 16, 
    color: '#64748b',
    flex: 1,
  },
  allocationValue: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1e293b' 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1e293b' 
  },
  sectionSubtitle: { 
    fontSize: 16, 
    color: '#64748b', 
    marginBottom: 16, 
    fontWeight: '500' 
  },
  addButton: { 
    backgroundColor: '#f1f5f9', 
    borderRadius: 12, 
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemCard: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    elevation: 2 
  },
  itemHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  itemIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  itemInfo: { 
    flex: 1 
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: 2 
  },
  itemSubtitle: { 
    fontSize: 14, 
    color: '#64748b' 
  },
  itemTrend: { 
    padding: 4 
  },
  itemDetails: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  itemValue: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1e293b' 
  },
  itemChange: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
  quickActions: { 
    marginBottom: 24 
  },
  actionButtons: { 
    flexDirection: 'row', 
    gap: 12,
    marginBottom: 12
  },
  actionButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    borderRadius: 16, 
    elevation: 3 
  },
  actionButtonText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#ffffff', 
    marginLeft: 8 
  },
  spacer: { 
    height: 40 
  },
});