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
import { ArrowLeft, Target, Plus, Minus, Calendar, TrendingUp, CreditCard as Edit3 } from 'lucide-react-native';

// Mock data
const mockGoalDetails = {
  '1': {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 500000,
    currentAmount: 325000,
    deadline: '2025-12-31',
    category: 'Emergency',
    color: '#EF4444',
    icon: '🚨',
    monthlyTarget: 14583,
    contributions: [
      { date: '2025-01-15', amount: 25000, type: 'deposit' },
      { date: '2025-01-01', amount: 50000, type: 'deposit' },
      { date: '2024-12-15', amount: 30000, type: 'deposit' },
    ]
  }
};

export default function SavingsGoalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [goal] = useState(mockGoalDetails[id as string]);
  const [contributionAmount, setContributionAmount] = useState('');

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text>Goal not found</Text>
      </View>
    );
  }

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleAddContribution = () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    Alert.alert(
      'Add Contribution',
      `Add ₹${parseFloat(contributionAmount).toLocaleString('en-IN')} to ${goal.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => {
            // Add contribution logic
            setContributionAmount('');
            Alert.alert('Success', 'Contribution added successfully!');
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
        <Text style={styles.title}>Savings Goal</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit3 size={20} color="#3B82F6" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[goal.color, goal.color + '80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalIconContainer}>
              <Text style={styles.goalIcon}>{goal.icon}</Text>
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalName}>{goal.name}</Text>
              <Text style={styles.goalCategory}>{goal.category}</Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          </View>

          <Text style={styles.currentAmount}>
            ₹{goal.currentAmount.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.targetAmount}>
            of ₹{goal.targetAmount.toLocaleString('en-IN')}
          </Text>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(progress, 100)}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.goalStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹{remaining.toLocaleString('en-IN')}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{daysLeft}</Text>
              <Text style={styles.statLabel}>Days Left</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.addContributionCard}>
          <Text style={styles.cardTitle}>Add Contribution</Text>
          <View style={styles.contributionInput}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={contributionAmount}
              onChangeText={setContributionAmount}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddContribution}>
            <Plus size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.addButtonText}>Add Contribution</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.insightsCard}>
          <Text style={styles.cardTitle}>Goal Insights</Text>
          <View style={styles.insightItem}>
            <Target size={20} color="#3B82F6" strokeWidth={2} />
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Monthly Target</Text>
              <Text style={styles.insightValue}>
                ₹{goal.monthlyTarget.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
          <View style={styles.insightItem}>
            <Calendar size={20} color="#10B981" strokeWidth={2} />
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Target Date</Text>
              <Text style={styles.insightValue}>
                {new Date(goal.deadline).toLocaleDateString('en-IN')}
              </Text>
            </View>
          </View>
          <View style={styles.insightItem}>
            <TrendingUp size={20} color="#F59E0B" strokeWidth={2} />
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Progress Rate</Text>
              <Text style={styles.insightValue}>On Track</Text>
            </View>
          </View>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>Recent Contributions</Text>
          {goal.contributions.map((contribution, index) => (
            <View key={index} style={styles.contributionItem}>
              <View style={styles.contributionDate}>
                <Text style={styles.contributionDateText}>
                  {new Date(contribution.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </Text>
              </View>
              <View style={styles.contributionDetails}>
                <Text style={styles.contributionType}>
                  {contribution.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </Text>
                <Text style={[
                  styles.contributionAmount,
                  { color: contribution.type === 'deposit' ? '#10B981' : '#EF4444' }
                ]}>
                  {contribution.type === 'deposit' ? '+' : '-'}₹{contribution.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          ))}
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
  editButton: {
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
  goalCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalIcon: {
    fontSize: 24,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  goalCategory: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  currentAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  targetAmount: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 20,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  goalStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
  },
  addContributionCard: {
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
  contributionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  insightsCard: {
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
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightContent: {
    flex: 1,
    marginLeft: 16,
  },
  insightLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  contributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contributionDate: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
  },
  contributionDateText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  contributionDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contributionType: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  contributionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});