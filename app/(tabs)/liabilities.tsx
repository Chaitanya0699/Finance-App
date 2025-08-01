import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert as AlertTriangle, Plus, Calendar, CircleCheck as CheckCircle, Clock, CreditCard, Receipt, Zap, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Liability {
  id: string;
  name: string;
  type: 'credit_card' | 'bill' | 'debt' | 'other';
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  description?: string;
  color: string;
  icon: string;
}

const mockLiabilities: Liability[] = [
  {
    id: '1',
    name: 'HDFC Credit Card',
    type: 'credit_card',
    amount: 45000,
    dueDate: '2025-01-25',
    status: 'unpaid',
    description: 'Monthly credit card bill',
    color: '#EF4444',
    icon: '💳'
  },
  {
    id: '2',
    name: 'Electricity Bill',
    type: 'bill',
    amount: 3500,
    dueDate: '2025-01-20',
    status: 'unpaid',
    description: 'Monthly electricity bill',
    color: '#F59E0B',
    icon: '⚡'
  },
  {
    id: '3',
    name: 'Internet Bill',
    type: 'bill',
    amount: 1200,
    dueDate: '2025-01-15',
    status: 'paid',
    description: 'Broadband internet bill',
    color: '#10B981',
    icon: '🌐'
  },
  {
    id: '4',
    name: 'Personal Debt',
    type: 'debt',
    amount: 25000,
    dueDate: '2025-01-30',
    status: 'unpaid',
    description: 'Money borrowed from friend',
    color: '#8B5CF6',
    icon: '🤝'
  },
  {
    id: '5',
    name: 'Mobile Bill',
    type: 'bill',
    amount: 800,
    dueDate: '2025-01-10',
    status: 'overdue',
    description: 'Monthly mobile bill',
    color: '#EF4444',
    icon: '📱'
  }
];

export default function LiabilitiesScreen() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unpaid' | 'paid' | 'overdue'>('all');
  const scaleValue = useSharedValue(1);

  const filteredLiabilities = selectedStatus === 'all' 
    ? mockLiabilities 
    : mockLiabilities.filter(liability => liability.status === selectedStatus);

  const unpaidLiabilities = mockLiabilities.filter(l => l.status === 'unpaid');
  const overdueLiabilities = mockLiabilities.filter(l => l.status === 'overdue');
  const totalUnpaid = unpaidLiabilities.reduce((sum, l) => sum + l.amount, 0);
  const totalOverdue = overdueLiabilities.reduce((sum, l) => sum + l.amount, 0);
  const totalLiabilities = totalUnpaid + totalOverdue;

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

  const getLiabilityIcon = (type: string) => {
    switch (type) {
      case 'credit_card': return <CreditCard size={20} color="#ffffff" strokeWidth={2} />;
      case 'bill': return <Receipt size={20} color="#ffffff" strokeWidth={2} />;
      case 'debt': return <AlertTriangle size={20} color="#ffffff" strokeWidth={2} />;
      default: return <Zap size={20} color="#ffffff" strokeWidth={2} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'unpaid': return '#F59E0B';
      case 'overdue': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} color="#10B981" strokeWidth={2} />;
      case 'unpaid': return <Clock size={16} color="#F59E0B" strokeWidth={2} />;
      case 'overdue': return <AlertTriangle size={16} color="#EF4444" strokeWidth={2} />;
      default: return <Clock size={16} color="#64748B" strokeWidth={2} />;
    }
  };

  const renderStatusFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}>
      {(['all', 'unpaid', 'overdue', 'paid'] as const).map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.filterButton,
            selectedStatus === status && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedStatus(status)}>
          <Text
            style={[
              styles.filterButtonText,
              selectedStatus === status && styles.filterButtonTextActive,
            ]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && ` (${mockLiabilities.filter(l => l.status === status).length})`}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSummaryCard = () => (
    <Animated.View style={[animatedCardStyle]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>Total Outstanding</Text>
            <View style={styles.summaryIcon}>
              <AlertTriangle size={24} color="#ffffff" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.summaryAmount}>
            ₹{totalLiabilities.toLocaleString('en-IN')}
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Unpaid</Text>
              <Text style={styles.summaryStatValue}>₹{totalUnpaid.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Overdue</Text>
              <Text style={styles.summaryStatValue}>₹{totalOverdue.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderLiabilityCard = (liability: Liability) => {
    const dueDate = new Date(liability.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <TouchableOpacity 
        key={liability.id} 
        style={styles.liabilityCard} 
        activeOpacity={0.7}
        onPress={() => router.push(`/liability-details/${liability.id}`)}>
        <View style={styles.liabilityHeader}>
          <View style={[styles.liabilityIcon, { backgroundColor: liability.color }]}>
            {getLiabilityIcon(liability.type)}
          </View>
          <View style={styles.liabilityInfo}>
            <Text style={styles.liabilityName}>{liability.name}</Text>
            <Text style={styles.liabilityType}>
              {liability.type.replace('_', ' ').charAt(0).toUpperCase() + liability.type.replace('_', ' ').slice(1)}
            </Text>
          </View>
          <View style={styles.liabilityStatus}>
            {getStatusIcon(liability.status)}
            <ArrowRight size={16} color="#94a3b8" strokeWidth={2} />
          </View>
        </View>

        <View style={styles.liabilityDetails}>
          <View style={styles.liabilityAmount}>
            <Text style={styles.liabilityAmountValue}>
              ₹{liability.amount.toLocaleString('en-IN')}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(liability.status) }]}>
              <Text style={styles.statusText}>
                {liability.status.charAt(0).toUpperCase() + liability.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.liabilityMeta}>
            <View style={styles.dueDateContainer}>
              <Calendar size={14} color="#64748b" strokeWidth={2} />
              <Text style={styles.dueDate}>
                Due: {dueDate.toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </Text>
            </View>
            {liability.status !== 'paid' && (
              <Text style={[
                styles.daysUntilDue,
                { color: daysUntilDue < 0 ? '#EF4444' : daysUntilDue <= 3 ? '#F59E0B' : '#64748b' }
              ]}>
                {daysUntilDue < 0 
                  ? `${Math.abs(daysUntilDue)} days overdue`
                  : daysUntilDue === 0 
                    ? 'Due today'
                    : `${daysUntilDue} days left`
                }
              </Text>
            )}
          </View>
        </View>

        {liability.description && (
          <Text style={styles.liabilityDescription} numberOfLines={1}>
            {liability.description}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liabilities</Text>
        <Text style={styles.subtitle}>Track your dues and bills</Text>
      </View>

      {renderStatusFilter()}
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        
        {renderSummaryCard()}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedStatus === 'all' ? 'All Liabilities' : `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Liabilities`}
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add-liability')}>
            <Plus size={20} color="#3B82F6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {filteredLiabilities.length > 0 ? (
          filteredLiabilities.map(renderLiabilityCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {selectedStatus === 'all' ? '' : selectedStatus} liabilities found
            </Text>
            <TouchableOpacity 
              style={styles.addLiabilityButton}
              onPress={() => router.push('/add-liability')}>
              <Plus size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.addLiabilityButtonText}>Add Your First Liability</Text>
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
    fontWeight: '500',
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
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  summaryStatValue: {
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
  liabilityCard: {
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
  liabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  liabilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  liabilityInfo: {
    flex: 1,
  },
  liabilityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  liabilityType: {
    fontSize: 14,
    color: '#64748b',
  },
  liabilityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liabilityDetails: {
    marginBottom: 12,
  },
  liabilityAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liabilityAmountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EF4444',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  liabilityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  daysUntilDue: {
    fontSize: 14,
    fontWeight: '600',
  },
  liabilityDescription: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  addLiabilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addLiabilityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
});