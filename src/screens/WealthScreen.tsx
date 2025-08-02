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
import { useFinance } from '../context/FinanceContext';

interface WealthScreenProps {
  navigation: any;
}

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    property: '#3B82F6',
    vehicle: '#10B981',
    gold: '#F59E0B',
    investment: '#8B5CF6',
    other: '#6B7280',
  };
  return colors[type] || '#6B7280';
};

const getTypeIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    property: 'home',
    vehicle: 'truck',
    gold: 'award',
    investment: 'trending-up',
    other: 'file-text',
  };
  return icons[type] || 'file-text';
};

export default function WealthScreen({ navigation }: WealthScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'assets'>('overview');
  const scaleValue = useSharedValue(1);
  const { state, deleteAsset } = useFinance();

  const totalAssets = state.assets.reduce((sum, asset) => sum + asset.currentValue, 0);

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
      {(['overview', 'assets'] as const).map((tab) => (
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

  const renderAssetsCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.assetsCard}>
          <View style={styles.assetsHeader}>
            <Text style={styles.assetsLabel}>Total Assets</Text>
            <View style={styles.assetsIcon}>
              <Icon name="trending-up" size={24} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.assetsAmount}>
            ₹{totalAssets.toLocaleString('en-IN')}
          </Text>
          <View style={styles.assetsBreakdown}>
            {Object.entries(
              state.assets.reduce((acc, asset) => {
                acc[asset.type] = (acc[asset.type] || 0) + asset.currentValue;
                return acc;
              }, {} as { [key: string]: number })
            ).map(([type, value]) => (
              <View key={type} style={styles.assetsItem}>
                <Text style={styles.assetsItemLabel}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
                <Text style={styles.assetsItemValue}>
                  ₹{(value / 100000).toFixed(1)}L
                </Text>
              </View>
            ))}
            {state.assets.length === 0 && (
              <View style={styles.assetsItem}>
                <Text style={styles.assetsItemLabel}>No assets yet</Text>
                <Text style={styles.assetsItemValue}>₹0</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const handleEditAsset = (asset: any) => {
    navigation.navigate('AssetForm', { asset });
  };

  const handleDeleteAsset = (assetId: string) => {
    Alert.alert(
      'Delete Asset',
      'Are you sure you want to delete this asset?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteAsset(assetId)
        },
      ]
    );
  };

  const renderAsset = (asset: any) => {
    const color = getTypeColor(asset.type);

    return (
      <TouchableOpacity 
        key={asset.id} 
        style={styles.assetCard}
        onPress={() => handleEditAsset(asset)}
        activeOpacity={0.7}>
        <View style={styles.assetHeader}>
          <View style={[styles.assetIcon, { backgroundColor: color }]}>
            <Icon name={getTypeIcon(asset.type)} size={20} color="#ffffff" />
          </View>
          <View style={styles.assetInfo}>
            <Text style={styles.assetName}>{asset.name}</Text>
            <Text style={styles.assetType}>
              {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
            </Text>
          </View>
          <View style={styles.assetActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteAsset(asset.id)}>
              <Icon name="trash-2" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.assetDetails}>
          <View style={styles.assetValue}>
            <Text style={styles.assetCurrentValue}>
              ₹{asset.currentValue.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.assetMeta}>
            <Text style={styles.assetDate}>
              Added: {new Date(asset.acquisitionDate).toLocaleDateString('en-IN', {
                day: 'numeric',
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="folder" size={48} color="#94a3b8" />
      <Text style={styles.emptyStateTitle}>No Assets Yet</Text>
      <Text style={styles.emptyStateText}>
        Start building your wealth by adding your first asset
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => navigation.navigate('AssetForm')}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyStateButtonGradient}>
          <Icon name="plus" size={20} color="#ffffff" />
          <Text style={styles.emptyStateButtonText}>Add Your First Asset</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View>
            {renderAssetsCard()}
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.quickActionButton, { backgroundColor: '#10B981' }]}
                  onPress={() => navigation.navigate('AssetForm')}>
                  <Icon name="home" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Add Asset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case 'assets':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Assets</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AssetForm')}>
                <Icon name="plus" size={20} color="#10B981" />
              </TouchableOpacity>
            </View>
            {state.assets.length > 0 ? state.assets.map(renderAsset) : renderEmptyState()}
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
        <Text style={styles.subtitle}>Track and manage your assets</Text>
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
  assetsCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  assetsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetsLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  assetsIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  assetsAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
  },
  assetsBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  assetsItem: {
    alignItems: 'center',
    minWidth: '30%',
    marginBottom: 8,
  },
  assetsItemLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
    textAlign: 'center',
  },
  assetsItemValue: {
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
  assetActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
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
  assetMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  quickActions: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
});