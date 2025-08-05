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
  Chrome as Home,
  Car,
  Coins,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type AssetType = 'property' | 'vehicle' | 'gold' | 'investment' | 'other';

interface Asset {
  id: string;
  name: string;
  type: AssetType;
  currentValue: number;
  purchaseValue: number;
  acquisitionDate: string;
  lastUpdated: string;
  notes?: string;
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
    color: '#3B82F6',
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
    color: '#10B981',
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
    color: '#F59E0B',
  },
  {
    id: '4',
    name: 'Mutual Fund Portfolio',
    type: 'investment',
    currentValue: 1250000,
    purchaseValue: 950000,
    acquisitionDate: '2019-06-01',
    lastUpdated: '2025-01-15',
    notes: 'Diversified equity and debt funds',
    color: '#8B5CF6',
  },
];

export default function AssetsScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AssetType | 'all'>('all');
  const scaleValue = useSharedValue(1);

  const filteredAssets = selectedType === 'all'
    ? mockAssets
    : mockAssets.filter(asset => asset.type === selectedType);

  const totalCurrentValue = mockAssets.reduce(
    (sum, asset) => sum + asset.currentValue,
    0
  );
  const totalPurchaseValue = mockAssets.reduce(
    (sum, asset) => sum + asset.purchaseValue,
    0
  );
  const totalGainLoss = totalCurrentValue - totalPurchaseValue;
  const gainLossPercent = (totalGainLoss / totalPurchaseValue) * 100;

  const assetsByType = mockAssets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + asset.currentValue;
    return acc;
  }, {} as Record<AssetType, number>);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handleCardPress = () => {
    scaleValue.value = withSpring(0.95, { duration: 100 }, () => {
      scaleValue.value = withSpring(1);
    });
  };

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'property':
        return <Home size={20} color="#ffffff" strokeWidth={2} />;
      case 'vehicle':
        return <Car size={20} color="#ffffff" strokeWidth={2} />;
      case 'gold':
        return <Coins size={20} color="#ffffff" strokeWidth={2} />;
      case 'investment':
        return <TrendingUp size={20} color="#ffffff" strokeWidth={2} />;
      default:
        return <Briefcase size={20} color="#ffffff" strokeWidth={2} />;
    }
  };

  const getTypeColor = (type: AssetType): string => {
    switch (type) {
      case 'property':
        return '#3B82F6';
      case 'vehicle':
        return '#10B981';
      case 'gold':
        return '#F59E0B';
      case 'investment':
        return '#8B5CF6';
      default:
        return '#64748B';
    }
  };

  const renderAssetCard = (asset: Asset) => {
    const gainLoss = asset.currentValue - asset.purchaseValue;
    const gainLossPercent = (gainLoss / asset.purchaseValue) * 100;

    return (
      <TouchableOpacity
        key={asset.id}
        style={styles.assetCard}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: '/(tabs)/asset-details/[id]',
            params: { id: asset.id },
          })
        }>
        <View style={styles.assetHeader}>
          <View style={[styles.assetIcon, { backgroundColor: asset.color }]}>
            {getAssetIcon(asset.type)}
          </View>
          <View style={styles.assetInfo}>
            <Text style={styles.assetName} numberOfLines={1} ellipsizeMode="tail">
              {asset.name}
            </Text>
            <Text style={styles.assetType}>
              {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
            </Text>
          </View>
          <View style={styles.assetTrend}>
            {gainLoss >= 0 ? (
              <ArrowUpRight size={16} color="#10B981" strokeWidth={2} />
            ) : (
              <ArrowDownRight size={16} color="#EF4444" strokeWidth={2} />
            )}
          </View>
        </View>

        <View style={styles.assetDetails}>
          <View style={styles.assetValue}>
            <Text style={styles.assetCurrentValue}>
              ₹{asset.currentValue.toLocaleString('en-IN')}
            </Text>
            <Text
              style={[
                styles.assetGainLoss,
                { color: gainLoss >= 0 ? '#10B981' : '#EF4444' },
              ]}>
              {gainLoss >= 0 ? '+' : ''}₹
              {Math.abs(gainLoss).toLocaleString('en-IN')} (
              {gainLossPercent >= 0 ? '+' : ''}
              {gainLossPercent.toFixed(1)}%)
            </Text>
          </View>
          <View style={styles.assetMeta}>
            <Text style={styles.assetPurchaseValue}>
              Purchase: ₹{asset.purchaseValue.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.assetDate}>
              {new Date(asset.acquisitionDate).toLocaleDateString('en-IN', {
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {asset.notes && (
          <Text style={styles.assetNotes} numberOfLines={2} ellipsizeMode="tail">
            {asset.notes}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assets</Text>
        <Text style={styles.subtitle}>Track your wealth portfolio</Text>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}>
          {(['all', 'property', 'vehicle', 'gold', 'investment', 'other'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                selectedType === type && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedType(type)}>
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === type && styles.filterButtonTextActive,
                ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[animatedCardStyle]}>
          <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
            <LinearGradient
              colors={
                totalGainLoss >= 0
                  ? ['#10B981', '#059669']
                  : ['#EF4444', '#DC2626']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>Total Asset Value</Text>
                <View style={styles.summaryIcon}>
                  <TrendingUp size={24} color="#ffffff" strokeWidth={2} />
                </View>
              </View>
              <Text style={styles.summaryAmount}>
                ₹{totalCurrentValue.toLocaleString('en-IN')}
              </Text>
              <View style={styles.summaryChange}>
                <Text style={styles.summaryChangeAmount}>
                  {totalGainLoss >= 0 ? '+' : ''}₹
                  {Math.abs(totalGainLoss).toLocaleString('en-IN')}
                </Text>
                <Text style={styles.summaryChangePercent}>
                  ({gainLossPercent >= 0 ? '+' : ''}
                  {gainLossPercent.toFixed(1)}%)
                </Text>
              </View>
              <Text style={styles.summarySubtext}>
                {totalGainLoss >= 0
                  ? 'Total Appreciation'
                  : 'Total Depreciation'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Asset Breakdown</Text>
          <View style={styles.breakdownItems}>
            {Object.entries(assetsByType).map(([type, value]) => (
              <View key={type} style={styles.breakdownItem}>
                <View style={styles.breakdownItemLeft}>
                  <View
                    style={[
                      styles.breakdownDot,
                      { backgroundColor: getTypeColor(type as AssetType) },
                    ]}
                  />
                  <Text style={styles.breakdownLabel}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </View>
                <Text style={styles.breakdownValue}>
                  ₹{value.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedType === 'all'
              ? 'All Assets'
              : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Assets`}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-asset')}>
            <Plus size={20} color="#3B82F6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {filteredAssets.length > 0 ? (
          filteredAssets.map(renderAssetCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {selectedType === 'all' ? '' : selectedType} assets found
            </Text>
            <TouchableOpacity
              style={styles.addAssetButton}
              onPress={() => router.push('/add-asset')}>
              <Plus size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.addAssetButtonText}>Add Your First Asset</Text>
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
  filterWrapper: {
    paddingBottom: 8,
  },
  filterContainer: { 
    paddingHorizontal: 20, 
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterButtonActive: { 
    backgroundColor: '#3B82F6' 
  },
  filterButtonText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#64748b' 
  },
  filterButtonTextActive: { 
    color: '#ffffff' 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20 
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
    fontWeight: '500' 
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
    marginBottom: 8 
  },
  summaryChange: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  summaryChangeAmount: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#ffffff', 
    marginRight: 8 
  },
  summaryChangePercent: { 
    fontSize: 16, 
    color: '#ffffff', 
    opacity: 0.8 
  },
  summarySubtext: { 
    fontSize: 14, 
    color: '#ffffff', 
    opacity: 0.7 
  },
  breakdownCard: {
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
  breakdownTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: 16 
  },
  breakdownItems: { 
    gap: 12 
  },
  breakdownItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  breakdownItemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
  },
  breakdownDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginRight: 12 
  },
  breakdownLabel: { 
    fontSize: 16, 
    color: '#64748b',
    flexShrink: 1,
  },
  breakdownValue: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1e293b',
    marginLeft: 8,
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1e293b' 
  },
  addButton: { 
    backgroundColor: '#f1f5f9', 
    borderRadius: 12, 
    padding: 8 
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
    shadowRadius: 3 
  },
  assetHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  assetIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  assetInfo: { 
    flex: 1,
    marginRight: 8,
  },
  assetName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: 4 
  },
  assetType: { 
    fontSize: 14, 
    color: '#64748b' 
  },
  assetTrend: { 
    padding: 8 
  },
  assetDetails: { 
    marginBottom: 12 
  },
  assetValue: { 
    marginBottom: 8 
  },
  assetCurrentValue: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: 4 
  },
  assetGainLoss: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  assetMeta: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  assetPurchaseValue: { 
    fontSize: 14, 
    color: '#64748b' 
  },
  assetDate: { 
    fontSize: 14, 
    color: '#64748b' 
  },
  assetNotes: { 
    fontSize: 14, 
    color: '#64748b', 
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyState: { 
    alignItems: 'center', 
    paddingVertical: 60 
  },
  emptyStateText: { 
    fontSize: 16, 
    color: '#64748b', 
    marginBottom: 20 
  },
  addAssetButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#3B82F6', 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 12 
  },
  addAssetButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#ffffff', 
    marginLeft: 8 
  },
  spacer: { 
    height: 40 
  },
});