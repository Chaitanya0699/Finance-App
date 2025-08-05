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
import { ArrowLeft, Target, Calendar, FileText, DollarSign, Check, Plane, Car, Chrome as Home, GraduationCap, Heart, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const goalCategories = [
  { id: 'emergency', name: 'Emergency Fund', icon: '🚨', color: '#EF4444' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#3B82F6' },
  { id: 'vehicle', name: 'Vehicle', icon: '🚗', color: '#10B981' },
  { id: 'home', name: 'Home', icon: '🏠', color: '#F59E0B' },
  { id: 'education', name: 'Education', icon: '🎓', color: '#8B5CF6' },
  { id: 'wedding', name: 'Wedding', icon: '💒', color: '#EC4899' },
  { id: 'gadgets', name: 'Gadgets', icon: '📱', color: '#06B6D4' },
  { id: 'other', name: 'Other', icon: '🎯', color: '#64748B' },
];

export default function NewGoalScreen() {
  const router = useRouter();
  const [goalName, setGoalName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!goalName || !selectedCategory || !targetAmount || !targetDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;

    if (target <= 0) {
      Alert.alert('Error', 'Target amount must be greater than 0');
      return;
    }

    if (current > target) {
      Alert.alert('Error', 'Current amount cannot be greater than target amount');
      return;
    }

    Alert.alert(
      'Success',
      `Goal "${goalName}" created successfully!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const selectedCategoryData = goalCategories.find(cat => cat.id === selectedCategory);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1e293b" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>New Savings Goal</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Goal Name *</Text>
          <View style={styles.inputContainer}>
            <Target size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={goalName}
              onChangeText={setGoalName}
              placeholder="e.g., Emergency Fund, Dream Vacation"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category *</Text>
          <View style={styles.categoryGrid}>
            {goalCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedCategory(category.id)}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  {selectedCategory === category.id && (
                    <View style={styles.checkOverlay}>
                      <Check size={16} color="#ffffff" strokeWidth={3} />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Target Amount *</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="Goal target amount"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Current Amount</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={currentAmount}
              onChangeText={setCurrentAmount}
              placeholder="Amount already saved (optional)"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Target Date *</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <View style={styles.inputContainer}>
            <FileText size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Why is this goal important to you?"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {targetAmount && currentAmount && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Goal Preview</Text>
            <View style={styles.previewContent}>
              <View style={styles.previewIcon}>
                <Text style={styles.previewEmoji}>
                  {selectedCategoryData?.icon || '🎯'}
                </Text>
              </View>
              <View style={styles.previewDetails}>
                <Text style={styles.previewName}>{goalName || 'Your Goal'}</Text>
                <Text style={styles.previewAmount}>
                  ₹{parseFloat(currentAmount || '0').toLocaleString('en-IN')} / ₹{parseFloat(targetAmount).toLocaleString('en-IN')}
                </Text>
                <View style={styles.previewProgressBar}>
                  <View 
                    style={[
                      styles.previewProgressFill,
                      { 
                        width: `${Math.min((parseFloat(currentAmount || '0') / parseFloat(targetAmount)) * 100, 100)}%`,
                        backgroundColor: selectedCategoryData?.color || '#3B82F6'
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={selectedCategoryData ? [selectedCategoryData.color, selectedCategoryData.color + '80'] : ['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <Target size={24} color="#ffffff" strokeWidth={2} />
            <Text style={styles.saveButtonText}>Create Goal</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20 
  },
  backButton: { 
    padding: 8, 
    borderRadius: 12, 
    backgroundColor: '#ffffff', 
    elevation: 2 
  },
  title: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginBottom: 24 },
  sectionLabel: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1e293b', 
    marginBottom: 12 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    elevation: 2 
  },
  textInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#1e293b', 
    marginLeft: 12 
  },
  textArea: { 
    minHeight: 80, 
    textAlignVertical: 'top' 
  },
  categoryGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginHorizontal: -6 
  },
  categoryButton: { 
    width: '23%', 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 12, 
    alignItems: 'center', 
    marginHorizontal: 6, 
    marginBottom: 12, 
    elevation: 2 
  },
  categoryButtonSelected: { 
    backgroundColor: '#f0f9ff', 
    borderWidth: 2, 
    borderColor: '#3B82F6' 
  },
  categoryIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8, 
    position: 'relative' 
  },
  categoryEmoji: { fontSize: 18 },
  checkOverlay: { 
    position: 'absolute', 
    top: -4, 
    right: -4, 
    backgroundColor: '#3B82F6', 
    borderRadius: 12, 
    padding: 4, 
    borderWidth: 2, 
    borderColor: '#ffffff' 
  },
  categoryName: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#64748b', 
    textAlign: 'center' 
  },
  categoryNameSelected: { color: '#3B82F6' },
  previewCard: {
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
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  previewEmoji: {
    fontSize: 20,
  },
  previewDetails: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  previewAmount: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  previewProgressBar: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  previewProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  saveButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 16, 
    borderRadius: 16, 
    elevation: 4, 
    marginBottom: 40 
  },
  saveButtonText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#ffffff', 
    marginLeft: 8 
  },
});