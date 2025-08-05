import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Minus, Building2, ChartBar as BarChart3, Target, Calendar } from 'lucide-react-native';

// Mock data
const mockMFDetails = {
  '1': {
    id: '1',
    name: 'Large Cap Growth Fund',
    nav: 4567.00,
    change: 23.00,
    changePercent: 0.51,
    units: 150,
    value: 685050.00,
    category: 'Large Cap',
    risk: 'Medium' as const,
    color: '#3B82F6',
    aum: 15000000000,
    expenseRatio: 1.25,
    exitLoad: 1.0,
    minSip: 500,
    about: 'This fund invests primarily in large-cap equity stocks with focus on growth companies. Suitable for long-term wealth creation.',
    returns: {
      '1Y': 12.5,
      '3Y': 15.2,
      '5Y': 13.8,
    },
    sipHistory: [
      { date: '2025-01-01', amount: 5000, units: 1.095 },
      { date: '2024-12-01', amount: 5000, units: 1.102 },
      { date: '2024-11-01', amount: 5000, units: 1.089 },
    ]
  }
};

export default function MutualFundScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [fund] = useState(mockMFDetails[id as string]);
  const [sipAmount, setSipAmount] = useState('');

  if (!fund) {
    return (
      <View style={styles.container}>
        <Text>Fund not found</Text>
      </View>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'High': return '#EF4444';
      default: return '#64748B';
    }
  };

  const handleStartSIP = () => {
    if (!sipAmount || parseFloat(sipAmount) < fund.minSip) {
      Alert.alert('Error', `Minimum SIP amount is ₹${fund.minSip}`);
      return;
    }

    Alert.alert(
      'Start SIP',
      `Start SIP of ₹${parseFloat(sipAmount).toLocaleString('en-IN')} for ${fund.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            setSipAmount('');
            Alert.alert('Success', 'SIP started successfully!');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1e293b" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Mutual Fund</Text>
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
          colors={[fund.color, fund.color + '80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.navCard}>
          <View style={styles.navHeader}>
            <View style={styles.fundInfo}>
              <Text style={styles.fundName}>{fund.name}</Text>
              <View style={styles.fundMeta}>
                <Text style={styles.fundCategory}>{fund.category}</Text>
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(fund.risk) }]}>
                  <Text style={styles.riskText}>{fund.risk} Risk</Text>
                </View>
              </View>
            </View>
            {fund.change >= 0 ? (
              <TrendingUp size={24} color="#ffffff" strokeWidth={2} />
            ) : (
              <TrendingDown size={24} color="#ffffff" strokeWidth={2} />
            )}
          </View>
          <Text style={styles.navAmount}>
            ₹{fund.nav.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.navChange}>
            {fund.change >= 0 ? '+' : ''}₹{fund.change.toFixed(2)} ({fund.changePercent >= 0 ? '+' : ''}{fund.changePercent.toFixed(2)}%)
          </Text>
          <Text style={styles.navSubtext}>Current NAV</Text>
        </LinearGradient>

        <View style={styles.holdingCard}>
          <Text style={styles.cardTitle}>Your Holdings</Text>
          <View style={styles.holdingDetails}>
            <View style={styles.holdingItem}>
              <Text style={styles.holdingLabel}>Units Owned</Text>
              <Text style={styles.holdingValue}>{fund.units}</Text>
            </View>
            <View style={styles.holdingItem}>
              <Text style={styles.holdingLabel}>Total Value</Text>
              <Text style={styles.holdingValue}>₹{fund.value.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.holdingItem}>
              <Text style={styles.holdingLabel}>Avg. NAV</Text>
              <Text style={styles.holdingValue}>₹{(fund.value / fund.units).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.returnsCard}>
          <Text style={styles.cardTitle}>Returns</Text>
          <View style={styles.returnsGrid}>
            <View style={styles.returnItem}>
              <Text style={styles.returnPeriod}>1 Year</Text>
              <Text style={[styles.returnValue, { color: fund.returns['1Y'] >= 0 ? '#10B981' : '#EF4444' }]}>
                {fund.returns['1Y']}%
              </Text>
            </View>
            <View style={styles.returnItem}>
              <Text style={styles.returnPeriod}>3 Years</Text>
              <Text style={[styles.returnValue, { color: fund.returns['3Y'] >= 0 ? '#10B981' : '#EF4444' }]}>
                {fund.returns['3Y']}%
              </Text>
            </View>
            <View style={styles.returnItem}>
              <Text style={styles.returnPeriod}>5 Years</Text>
              <Text style={[styles.returnValue, { color: fund.returns['5Y'] >= 0 ? '#10B981' : '#EF4444' }]}>
                {fund.returns['5Y']}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sipCard}>
          <Text style={styles.cardTitle}>Start SIP</Text>
          <View style={styles.sipInput}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={sipAmount}
              onChangeText={setSipAmount}
              placeholder={`Min. ${fund.minSip}`}
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <Text style={styles.sipNote}>
            Minimum SIP amount: ₹{fund.minSip.toLocaleString('en-IN')}
          </Text>
          <TouchableOpacity 
            style={styles.sipButton}
            onPress={handleStartSIP}>
            <Target size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.sipButtonText}>Start SIP</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Fund Details</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>AUM</Text>
            <Text style={styles.detailValue}>₹{(fund.aum / 10000000).toFixed(0)} Cr</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Expense Ratio</Text>
            <Text style={styles.detailValue}>{fund.expenseRatio}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Exit Load</Text>
            <Text style={styles.detailValue}>{fund.exitLoad}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Min SIP</Text>
            <Text style={styles.detailValue}>₹{fund.minSip}</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.cardTitle}>About This Fund</Text>
          <Text style={styles.aboutText}>{fund.about}</Text>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>Recent SIP History</Text>
          {fund.sipHistory.map((sip, index) => (
            <View key={index} style={styles.sipHistoryItem}>
              <View style={styles.sipDate}>
                <Calendar size={16} color="#64748b" strokeWidth={2} />
                <Text style={styles.sipDateText}>
                  {new Date(sip.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </Text>
              </View>
              <View style={styles.sipDetails}>
                <Text style={styles.sipAmount}>₹{sip.amount.toLocaleString('en-IN')}</Text>
                <Text style={styles.sipUnits}>{sip.units} units</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={[styles.tradeButton, { backgroundColor: '#10B981' }]}>
            <Plus size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.tradeButtonText}>Invest More</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tradeButton, { backgroundColor: '#EF4444' }]}>
            <Minus size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.tradeButtonText}>Redeem</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
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
  navCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  fundMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fundCategory: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginRight: 12,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  navAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  navChange: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  navSubtext: {
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
  returnsCard: {
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
  returnsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  returnItem: {
    alignItems: 'center',
  },
  returnPeriod: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  returnValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  sipCard: {
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
  sipInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  rupeeSymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  sipNote: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  sipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
  },
  sipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  detailsCard: {
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
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
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
  historyCard: {
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
  sipHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sipDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sipDateText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  sipDetails: {
    alignItems: 'flex-end',
  },
  sipAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  sipUnits: {
    fontSize: 14,
    color: '#64748b',
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