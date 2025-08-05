import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  FileText,
  Check,
  Plus,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const categories = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#4ECDC4' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#45B7D1' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#96CEB4' },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#FFEAA7' },
  { id: 'healthcare', name: 'Healthcare', icon: '⚕️', color: '#FD79A8' },
  { id: 'education', name: 'Education', icon: '📚', color: '#A29BFE' },
  { id: 'other', name: 'Other', icon: '📝', color: '#6C5CE7' },
];

const incomeCategories = [
  { id: 'salary', name: 'Salary', icon: '💰', color: '#10B981' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3B82F6' },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#8B5CF6' },
  { id: 'gift', name: 'Gift', icon: '🎁', color: '#F59E0B' },
  { id: 'other', name: 'Other', icon: '📝', color: '#6B7280' },
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const scaleValue = useSharedValue(1);

  const currentCategories = transactionType === 'expense' ? categories : incomeCategories;

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    scaleValue.value = withSpring(0.95, {}, () => {
      scaleValue.value = withSpring(1);
    });
  };

  const handleSave = () => {
    if (!amount || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      `${transactionType === 'expense' ? 'Expense' : 'Income'} of ₹${amount} added successfully!`,
      [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Transaction</Text>
        <Text style={styles.subtitle}>Track your financial activity</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        
        {/* Transaction Type */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, transactionType === 'expense' && styles.typeButtonActive]}
            onPress={() => {
              setTransactionType('expense');
              setSelectedCategory('');
            }}>
            <Text style={[styles.typeButtonText, transactionType === 'expense' && styles.typeButtonTextActive]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, transactionType === 'income' && styles.typeButtonActive]}
            onPress={() => {
              setTransactionType('income');
              setSelectedCategory('');
            }}>
            <Text style={[styles.typeButtonText, transactionType === 'income' && styles.typeButtonTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.sectionLabel}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Category Selector */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoriesGrid}>
            {currentCategories.map((category) => (
              <Animated.View 
                key={category.id} 
                style={[animatedButtonStyle, styles.categoryItemWrapper]}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id && styles.categoryItemSelected,
                  ]}
                  onPress={() => handleCategorySelect(category.id)}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: category.color },
                      selectedCategory === category.id && styles.categoryIconSelected,
                    ]}>
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                    {selectedCategory === category.id && (
                      <View style={styles.checkOverlay}>
                        <Check size={16} color="#ffffff" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.categoryName,
                      selectedCategory === category.id && styles.categoryNameSelected,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {category.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionLabel}>Description</Text>
          <View style={styles.descriptionInputContainer}>
            <FileText size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Add a note (optional)"
              placeholderTextColor="#94a3b8"
              multiline
            />
          </View>
        </View>

        {/* Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.sectionLabel}>Date</Text>
          <View style={styles.dateInputContainer}>
            <Calendar size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.dateInput}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Save Button - Now part of the scrollable content */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.9}>
            <LinearGradient
              colors={transactionType === 'expense' ? ['#EF4444', '#DC2626'] : ['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}>
              <Plus size={24} color="#ffffff" strokeWidth={2} />
              <Text style={styles.saveButtonText}>
                Add {transactionType === 'expense' ? 'Expense' : 'Income'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40, // Reduced padding since button is now inside
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    elevation: 2,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  typeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  amountContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
  },
  rupeeSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
    paddingVertical: 0,
    height: 40,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  categoryItemWrapper: {
    width: '48%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  categoryItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  categoryItemSelected: {
    backgroundColor: '#f0f9ff',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  categoryIconSelected: {
    transform: [{ scale: 1.1 }],
  },
  categoryEmoji: {
    fontSize: 24,
  },
  checkOverlay: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    width: '100%',
  },
  categoryNameSelected: {
    color: '#3B82F6',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
    minHeight: 60,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
    paddingVertical: 0,
    textAlignVertical: 'center',
    maxHeight: 100,
  },
  dateContainer: {
    marginBottom: 24,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  saveButtonContainer: {
    marginTop: 16,
    marginBottom: 40, // Added margin at bottom
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
});