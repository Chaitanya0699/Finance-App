import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useFinance, Loan } from '../context/FinanceContext';

interface LoanFormScreenProps {
  navigation: any;
  route: any;
}

const loanTypes = [
  { id: 'personal', name: 'Personal Loan', icon: '👤', color: '#3B82F6' },
  { id: 'home', name: 'Home Loan', icon: '🏠', color: '#10B981' },
  { id: 'vehicle', name: 'Vehicle Loan', icon: '🚗', color: '#F59E0B' },
  { id: 'education', name: 'Education Loan', icon: '🎓', color: '#8B5CF6' },
  { id: 'other', name: 'Other', icon: '📝', color: '#6B7280' },
];

export default function LoanFormScreen({ navigation, route }: LoanFormScreenProps) {
  const { addLoan, updateLoan } = useFinance();
  const editingLoan = route.params?.loan as Loan | undefined;
  const isEditing = !!editingLoan;

  const [formData, setFormData] = useState({
    name: editingLoan?.name || '',
    type: editingLoan?.type || 'personal',
    totalAmount: editingLoan?.totalAmount?.toString() || '',
    interestRate: editingLoan?.interestRate?.toString() || '',
    startDate: editingLoan?.startDate || new Date().toISOString().split('T')[0],
    repaymentMode: editingLoan?.repaymentMode || 'emi',
    emiAmount: editingLoan?.emiAmount?.toString() || '',
    duration: editingLoan?.duration?.toString() || '',
    monthsPaid: editingLoan?.monthsPaid?.toString() || '0',
    status: editingLoan?.status || 'active',
  });

  const handleSave = async () => {
    if (!formData.name || !formData.totalAmount || !formData.interestRate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.repaymentMode === 'emi' && (!formData.emiAmount || !formData.duration)) {
      Alert.alert('Error', 'Please fill in EMI amount and duration for EMI mode');
      return;
    }

    try {
      const loanData = {
        name: formData.name,
        type: formData.type as any,
        totalAmount: parseFloat(formData.totalAmount),
        interestRate: parseFloat(formData.interestRate),
        startDate: formData.startDate,
        repaymentMode: formData.repaymentMode as 'emi' | 'full',
        emiAmount: formData.repaymentMode === 'emi' ? parseFloat(formData.emiAmount) : undefined,
        duration: formData.repaymentMode === 'emi' ? parseInt(formData.duration) : undefined,
        monthsPaid: parseInt(formData.monthsPaid),
        status: formData.status as 'active' | 'closed',
      };

      if (isEditing && editingLoan) {
        await updateLoan({ ...editingLoan, ...loanData });
        Alert.alert('Success', 'Loan updated successfully!');
      } else {
        await addLoan(loanData);
        Alert.alert('Success', 'Loan added successfully!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save loan');
    }
  };

  const renderTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Loan Type</Text>
      <View style={styles.typeGrid}>
        {loanTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeItem,
              formData.type === type.id && styles.typeItemSelected,
            ]}
            onPress={() => setFormData({ ...formData, type: type.id as any })}>
            <View
              style={[
                styles.typeIcon,
                { backgroundColor: type.color },
                formData.type === type.id && styles.typeIconSelected,
              ]}>
              <Text style={styles.typeEmoji}>{type.icon}</Text>
            </View>
            <Text
              style={[
                styles.typeName,
                formData.type === type.id && styles.typeNameSelected,
              ]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRepaymentModeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Repayment Mode</Text>
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            formData.repaymentMode === 'emi' && styles.modeButtonActive,
          ]}
          onPress={() => setFormData({ ...formData, repaymentMode: 'emi' })}>
          <Text
            style={[
              styles.modeButtonText,
              formData.repaymentMode === 'emi' && styles.modeButtonTextActive,
            ]}>
            EMI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            formData.repaymentMode === 'full' && styles.modeButtonActive,
          ]}
          onPress={() => setFormData({ ...formData, repaymentMode: 'full' })}>
          <Text
            style={[
              styles.modeButtonText,
              formData.repaymentMode === 'full' && styles.modeButtonTextActive,
            ]}>
            Full Payment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: 'default' | 'numeric' | 'email-address' = 'default',
    icon?: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon && <Icon name={icon} size={20} color="#64748b" />}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>{isEditing ? 'Edit Loan' : 'Add Loan'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {renderInputField(
          'Loan Name',
          formData.name,
          (text) => setFormData({ ...formData, name: text }),
          'Enter loan name',
          'default',
          'file-text'
        )}

        {renderTypeSelector()}

        {renderInputField(
          'Total Amount (₹)',
          formData.totalAmount,
          (text) => setFormData({ ...formData, totalAmount: text }),
          '0',
          'numeric',
          'dollar-sign'
        )}

        {renderInputField(
          'Interest Rate (%)',
          formData.interestRate,
          (text) => setFormData({ ...formData, interestRate: text }),
          '0.0',
          'numeric',
          'percent'
        )}

        {renderInputField(
          'Start Date',
          formData.startDate,
          (text) => setFormData({ ...formData, startDate: text }),
          'YYYY-MM-DD',
          'default',
          'calendar'
        )}

        {renderRepaymentModeSelector()}

        {formData.repaymentMode === 'emi' && (
          <>
            {renderInputField(
              'EMI Amount (₹)',
              formData.emiAmount,
              (text) => setFormData({ ...formData, emiAmount: text }),
              '0',
              'numeric',
              'credit-card'
            )}

            {renderInputField(
              'Duration (Months)',
              formData.duration,
              (text) => setFormData({ ...formData, duration: text }),
              '0',
              'numeric',
              'clock'
            )}

            {renderInputField(
              'Months Paid',
              formData.monthsPaid,
              (text) => setFormData({ ...formData, monthsPaid: text }),
              '0',
              'numeric',
              'check-circle'
            )}
          </>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButtonContainer}
          onPress={handleSave}
          activeOpacity={0.9}>
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <Icon name="save" size={24} color="#ffffff" />
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Loan' : 'Add Loan'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  typeItemSelected: {
    backgroundColor: '#f0f9ff',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeIconSelected: {
    transform: [{ scale: 1.1 }],
  },
  typeEmoji: {
    fontSize: 20,
  },
  typeName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },
  typeNameSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  inputWithIcon: {
    marginLeft: 12,
  },
  spacer: {
    height: 100,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  saveButtonContainer: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
});