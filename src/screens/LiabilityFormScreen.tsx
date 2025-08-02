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
import { useFinance, Liability } from '../context/FinanceContext';

interface LiabilityFormScreenProps {
  navigation: any;
  route: any;
}

const liabilityTypes = [
  { id: 'credit_card', name: 'Credit Card', icon: '💳', color: '#EF4444' },
  { id: 'bill', name: 'Bill', icon: '📄', color: '#F59E0B' },
  { id: 'debt', name: 'Personal Debt', icon: '🤝', color: '#8B5CF6' },
  { id: 'other', name: 'Other', icon: '📝', color: '#6B7280' },
];

export default function LiabilityFormScreen({ navigation, route }: LiabilityFormScreenProps) {
  const { addLiability, updateLiability } = useFinance();
  const editingLiability = route.params?.liability as Liability | undefined;
  const isEditing = !!editingLiability;

  const [formData, setFormData] = useState({
    name: editingLiability?.name || '',
    type: editingLiability?.type || 'credit_card',
    amount: editingLiability?.amount?.toString() || '',
    dueDate: editingLiability?.dueDate || new Date().toISOString().split('T')[0],
    status: editingLiability?.status || 'unpaid',
    description: editingLiability?.description || '',
  });

  const handleSave = async () => {
    if (!formData.name || !formData.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const liabilityData = {
        name: formData.name,
        type: formData.type as any,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status as 'paid' | 'unpaid',
        description: formData.description || undefined,
      };

      if (isEditing && editingLiability) {
        await updateLiability({ ...editingLiability, ...liabilityData });
        Alert.alert('Success', 'Liability updated successfully!');
      } else {
        await addLiability(liabilityData);
        Alert.alert('Success', 'Liability added successfully!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save liability');
    }
  };

  const renderTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Liability Type</Text>
      <View style={styles.typeGrid}>
        {liabilityTypes.map((type) => (
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

  const renderStatusSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Status</Text>
      <View style={styles.statusSelector}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            formData.status === 'unpaid' && styles.statusButtonActive,
          ]}
          onPress={() => setFormData({ ...formData, status: 'unpaid' })}>
          <Text
            style={[
              styles.statusButtonText,
              formData.status === 'unpaid' && styles.statusButtonTextActive,
            ]}>
            Unpaid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusButton,
            formData.status === 'paid' && styles.statusButtonActive,
          ]}
          onPress={() => setFormData({ ...formData, status: 'paid' })}>
          <Text
            style={[
              styles.statusButtonText,
              formData.status === 'paid' && styles.statusButtonTextActive,
            ]}>
            Paid
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
    icon?: string,
    multiline?: boolean
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, multiline && styles.inputWrapperMultiline]}>
        {icon && <Icon name={icon} size={20} color="#64748b" />}
        <TextInput
          style={[
            styles.input, 
            icon && styles.inputWithIcon,
            multiline && styles.inputMultiline
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
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
        <Text style={styles.title}>{isEditing ? 'Edit Liability' : 'Add Liability'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {renderInputField(
          'Liability Name',
          formData.name,
          (text) => setFormData({ ...formData, name: text }),
          'Enter liability name',
          'default',
          'file-text'
        )}

        {renderTypeSelector()}

        {renderInputField(
          'Amount (₹)',
          formData.amount,
          (text) => setFormData({ ...formData, amount: text }),
          '0',
          'numeric',
          'dollar-sign'
        )}

        {renderInputField(
          'Due Date',
          formData.dueDate,
          (text) => setFormData({ ...formData, dueDate: text }),
          'YYYY-MM-DD',
          'default',
          'calendar'
        )}

        {renderStatusSelector()}

        {renderInputField(
          'Description (Optional)',
          formData.description,
          (text) => setFormData({ ...formData, description: text }),
          'Add any additional details...',
          'default',
          'edit-3',
          true
        )}

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButtonContainer}
          onPress={handleSave}
          activeOpacity={0.9}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <Icon name="save" size={24} color="#ffffff" />
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Liability' : 'Add Liability'}
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
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#EF4444',
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
    color: '#EF4444',
    fontWeight: '600',
  },
  statusSelector: {
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
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  statusButtonActive: {
    backgroundColor: '#EF4444',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  statusButtonTextActive: {
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
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    paddingTop: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  inputWithIcon: {
    marginLeft: 12,
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
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