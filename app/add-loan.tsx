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
import { ArrowLeft, CreditCard, Chrome as Home, Car, User, Building2, Calendar, FileText, DollarSign, Check, Percent } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLoans } from '../hooks/useFirebaseData';

const loanTypes = [
  { id: 'home', name: 'Home Loan', icon: <Home size={24} color="#ffffff" />, color: '#3B82F6' },
  { id: 'vehicle', name: 'Vehicle Loan', icon: <Car size={24} color="#ffffff" />, color: '#10B981' },
  { id: 'personal', name: 'Personal Loan', icon: <User size={24} color="#ffffff" />, color: '#F59E0B' },
  { id: 'education', name: 'Education Loan', icon: <Building2 size={24} color="#ffffff" />, color: '#8B5CF6' },
  { id: 'other', name: 'Other', icon: <CreditCard size={24} color="#ffffff" />, color: '#64748B' },
];

export default function AddLoanScreen() {
  const router = useRouter();
  const { addLoan } = useLoans();
  const [loanName, setLoanName] = useState('');
  const [loanType, setLoanType] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [duration, setDuration] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!loanName || !loanType || !totalAmount || !interestRate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await addLoan({
        name: loanName,
        type: loanType as any,
        totalAmount: parseFloat(totalAmount),
        interestRate: parseFloat(interestRate),
        duration: duration ? parseInt(duration) : undefined,
        emiAmount: emiAmount ? parseFloat(emiAmount) : undefined,
        monthsPaid: 0,
        startDate,
        status: 'active',
        notes: notes || undefined,
      });
      
      Alert.alert(
        'Success',
        `Loan "${loanName}" added successfully!`,
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
        <Text style={styles.title}>Add Loan</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Loan Name *</Text>
          <View style={styles.inputContainer}>
            <CreditCard size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={loanName}
              onChangeText={setLoanName}
              placeholder="e.g., HDFC Home Loan, SBI Car Loan"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Loan Type *</Text>
          <View style={styles.typeGrid}>
            {loanTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  loanType === type.id && styles.typeButtonSelected,
                  { borderColor: type.color } // Use type-specific border color
                ]}
                onPress={() => setLoanType(type.id)}>
                <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                  {type.icon}
                  {loanType === type.id && (
                    <View style={styles.checkOverlay}>
                      <Check size={16} color="#ffffff" strokeWidth={3} />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.typeName,
                  loanType === type.id && { color: type.color } // Use type color for selected text
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Total Loan Amount *</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={totalAmount}
              onChangeText={setTotalAmount}
              placeholder="Total loan amount"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Interest Rate (%) *</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Duration (Months)</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={duration}
              onChangeText={setDuration}
              placeholder="Loan duration in months"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>EMI Amount</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={emiAmount}
              onChangeText={setEmiAmount}
              placeholder="Monthly EMI amount"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Start Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes</Text>
          <View style={[styles.inputContainer, styles.notesContainer]}>
            <FileText size={20} color="#64748b" strokeWidth={2} style={[styles.inputIcon, styles.notesIcon]} />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional details about the loan"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#3B82F6', '#2563EB']} // Blue gradient for loans
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <CreditCard size={20} color="#ffffff" strokeWidth={2.5} style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>Add Loan</Text>
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
    backgroundColor: '#EFF6FF' // Light blue background for selected
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