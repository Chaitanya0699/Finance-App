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
import { ArrowLeft, PiggyBank, Target, Coins, Building2, CreditCard, Calendar, FileText, DollarSign, Check, Percent } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSavingsGoals } from '../hooks/useFirebaseData';

const savingsTypes = [
  { id: 'savings', name: 'Savings Account', icon: <Coins size={24} color="#ffffff" />, color: '#10B981' },
  { id: 'fixed_deposit', name: 'Fixed Deposit', icon: <Building2 size={24} color="#ffffff" />, color: '#3B82F6' },
  { id: 'recurring', name: 'Recurring Deposit', icon: <CreditCard size={24} color="#ffffff" />, color: '#8B5CF6' },
  { id: 'goal', name: 'Savings Goal', icon: <Target size={24} color="#ffffff" />, color: '#F59E0B' },
];

export default function AddSavingsScreen() {
  const router = useRouter();
  const { addGoal } = useSavingsGoals();
  const [savingsName, setSavingsName] = useState('');
  const [savingsType, setSavingsType] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!savingsName || !savingsType || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (savingsType === 'goal') {
        if (!targetAmount || !targetDate) {
          Alert.alert('Error', 'Please fill in target amount and date for goals');
          return;
        }
        
        await addGoal({
          name: savingsName,
          targetAmount: parseFloat(targetAmount),
          currentAmount: parseFloat(amount),
          deadline: targetDate,
          category: 'savings',
          description: notes || undefined,
        });
      }
      
      Alert.alert(
        'Success',
        `Savings "${savingsName}" added successfully!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1e293b" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Savings</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Savings Name *</Text>
          <View style={styles.inputContainer}>
            <PiggyBank size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={savingsName}
              onChangeText={setSavingsName}
              placeholder="e.g., Emergency Fund, Vacation Fund"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type *</Text>
          <View style={styles.typeGrid}>
            {savingsTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  savingsType === type.id && styles.typeButtonSelected,
                  { borderColor: type.color } // Use type-specific border color
                ]}
                onPress={() => setSavingsType(type.id)}>
                <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                  {type.icon}
                  {savingsType === type.id && (
                    <View style={styles.checkOverlay}>
                      <Check size={16} color="#ffffff" strokeWidth={3} />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.typeName,
                  savingsType === type.id && { color: type.color } // Use type color for selected text
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Current Amount *</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="Current savings amount"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {savingsType !== 'goal' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Interest Rate (%)</Text>
            <View style={styles.inputContainer}>
              <Percent size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={interestRate}
                onChangeText={setInterestRate}
                placeholder="Annual interest rate"
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        )}

        {savingsType === 'goal' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Target Amount</Text>
              <View style={styles.inputContainer}>
                <Target size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
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
              <Text style={styles.sectionLabel}>Target Date</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={targetDate}
                  onChangeText={setTargetDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes</Text>
          <View style={[styles.inputContainer, styles.notesContainer]}>
            <FileText size={20} color="#64748b" strokeWidth={2} style={[styles.inputIcon, styles.notesIcon]} />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional details about your savings"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <PiggyBank size={20} color="#ffffff" strokeWidth={2.5} style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>Add Savings</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20,
    position: 'relative'
  },
  backButton: { 
    position: 'absolute',
    left: 20,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1e293b',
    textAlign: 'center'
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  scrollContent: {
    paddingBottom: 40
  },
  section: { 
    marginBottom: 24 
  },
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
    paddingHorizontal: 16, 
    paddingVertical: 14,
    elevation: 2 
  },
  inputIcon: {
    marginRight: 12
  },
  textInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#1e293b',
    paddingVertical: 2,
    includeFontPadding: false
  },
  textArea: { 
    minHeight: 100, 
    textAlignVertical: 'top',
    paddingTop: 8
  },
  notesContainer: {
    alignItems: 'flex-start'
  },
  notesIcon: {
    marginTop: 8
  },
  typeGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    gap: 12
  },
  typeButton: { 
    width: '48%', 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 16, 
    alignItems: 'center', 
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  typeButtonSelected: { 
    backgroundColor: '#ECFDF5' // Light green background for selected
  },
  typeIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8, 
    position: 'relative' 
  },
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
  typeName: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#64748b', 
    textAlign: 'center' 
  },
  saveButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 16, 
    borderRadius: 16, 
    elevation: 4, 
    marginTop: 8
  },
  saveIcon: {
    marginRight: 8
  },
  saveButtonText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#ffffff' 
  },
});