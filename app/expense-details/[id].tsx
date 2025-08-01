import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CreditCard as Edit3, Trash2, Calendar, Tag, FileText, TrendingUp, TrendingDown } from 'lucide-react-native';

// Mock data - in real app, this would come from your data store
const mockExpenseDetails = {
  '1': {
    id: '1',
    category: 'Food & Dining',
    amount: 324.50,
    description: 'Dinner at Italian restaurant with family',
    date: '2025-01-15',
    type: 'expense' as const,
    icon: '🍽️',
    location: 'Olive Garden, Mumbai',
    paymentMethod: 'Credit Card',
    tags: ['family', 'dinner', 'weekend'],
    receipt: true,
  }
};

export default function ExpenseDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [expense] = useState(mockExpenseDetails[id as string]);

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text>Expense not found</Text>
      </View>
    );
  }

  const handleEdit = () => {
    // Navigate to edit screen
    Alert.alert('Edit', 'Navigate to edit expense screen');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Delete expense logic
            router.back();
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
        <Text style={styles.title}>Expense Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Edit3 size={20} color="#3B82F6" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Trash2 size={20} color="#EF4444" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={expense.type === 'expense' ? ['#EF4444', '#DC2626'] : ['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.amountCard}>
          <View style={styles.amountHeader}>
            <Text style={styles.amountLabel}>
              {expense.type === 'expense' ? 'Expense Amount' : 'Income Amount'}
            </Text>
            {expense.type === 'expense' ? (
              <TrendingDown size={24} color="#ffffff" strokeWidth={2} />
            ) : (
              <TrendingUp size={24} color="#ffffff" strokeWidth={2} />
            )}
          </View>
          <Text style={styles.amountValue}>
            {expense.type === 'expense' ? '-' : '+'}₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        </LinearGradient>

        <View style={styles.detailsCard}>
          <View style={styles.categorySection}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryEmoji}>{expense.icon}</Text>
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{expense.category}</Text>
              <Text style={styles.categoryType}>
                {expense.type === 'expense' ? 'Expense' : 'Income'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Calendar size={20} color="#64748b" strokeWidth={2} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {new Date(expense.date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>

          {expense.description && (
            <View style={styles.detailItem}>
              <FileText size={20} color="#64748b" strokeWidth={2} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{expense.description}</Text>
              </View>
            </View>
          )}

          {expense.location && (
            <View style={styles.detailItem}>
              <Tag size={20} color="#64748b" strokeWidth={2} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{expense.location}</Text>
              </View>
            </View>
          )}

          {expense.paymentMethod && (
            <View style={styles.detailItem}>
              <Tag size={20} color="#64748b" strokeWidth={2} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <Text style={styles.detailValue}>{expense.paymentMethod}</Text>
              </View>
            </View>
          )}

          {expense.tags && expense.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.tagsLabel}>Tags</Text>
              <View style={styles.tagsContainer}>
                {expense.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {expense.receipt && (
          <TouchableOpacity style={styles.receiptCard}>
            <Text style={styles.receiptText}>📄 View Receipt</Text>
          </TouchableOpacity>
        )}
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
  amountCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
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
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  categoryType: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailContent: {
    flex: 1,
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  tagsSection: {
    marginTop: 8,
  },
  tagsLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  receiptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  receiptText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
});