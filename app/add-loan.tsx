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

const loanTypes = [
  { id: 'home', name: 'Home Loan', icon: <Home size={24} color="#ffffff" />, color: '#3B82F6' },
  { id: 'vehicle', name: 'Vehicle Loan', icon: <Car size={24} color="#ffffff" />, color: '#10B981' },
  { id: 'personal', name: 'Personal Loan', icon: <User size={24} color="#ffffff" />, color: '#F59E0B' },
  { id: 'education', name: 'Education Loan', icon: <Building2 size={24} color="#ffffff" />, color: '#8B5CF6' },
  { id: 'other', name: 'Other', icon: <CreditCard size={24} color="#ffffff" />, color: '#64748B' },
];

export default function AddLoanScreen() {
  const router = useRouter();
  const [loanName, setLoanName] = useState('');
  const [loanType, setLoanType] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [duration, setDuration] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!loanName || !loanType || !totalAmount || !interestRate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      `Loan "${loanName}" added successfully!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

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
        <Text style={styles.title}>Add Loan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Loan Name *</Text>
          <View style={styles.inputContainer}>
            <CreditCard size={20} color="#64748b" strokeWidth={2} />
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
                  loanType === type.id && styles.typeNameSelected
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
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
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
            <Percent size={20} color="#64748b" strokeWidth={2} />
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
            <Calendar size={20} color="#64748b" strokeWidth={2} />
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
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
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
            <Calendar size={20} color="#64748b" strokeWidth={2} />
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
          <View style={styles.inputContainer}>
            <FileText size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional details about the loan"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <CreditCard size={24} color="#ffffff" strokeWidth={2} />
            <Text style={styles.saveButtonText}>Add Loan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: '#ffffff', elevation: 2 },
  title: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, elevation: 2 },
  textInput: { flex: 1, fontSize: 16, color: '#1e293b', marginLeft: 12 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: -6 },
  typeButton: { width: '48%', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 6, marginBottom: 12, elevation: 2 },
  typeButtonSelected: { backgroundColor: '#f0f9ff', borderWidth: 2, borderColor: '#3B82F6' },
  typeIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' },
  checkOverlay: { position: 'absolute', top: -4, right: -4, backgroundColor: '#3B82F6', borderRadius: 12, padding: 4, borderWidth: 2, borderColor: '#ffffff' },
  typeName: { fontSize: 14, fontWeight: '600', color: '#64748b', textAlign: 'center' },
  typeNameSelected: { color: '#3B82F6' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, elevation: 4, marginBottom: 40 },
  saveButtonText: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginLeft: 8 },
});