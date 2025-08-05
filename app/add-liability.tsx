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
import { ArrowLeft, TriangleAlert as AlertTriangle, CreditCard, Receipt, Zap, Calendar, FileText, DollarSign, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const liabilityTypes = [
  { id: 'credit_card', name: 'Credit Card', icon: <CreditCard size={24} color="#ffffff" />, color: '#EF4444' },
  { id: 'bill', name: 'Utility Bill', icon: <Zap size={24} color="#ffffff" />, color: '#F59E0B' },
  { id: 'debt', name: 'Personal Debt', icon: <AlertTriangle size={24} color="#ffffff" />, color: '#8B5CF6' },
  { id: 'other', name: 'Other', icon: <Receipt size={24} color="#ffffff" />, color: '#64748B' },
];

export default function AddLiabilityScreen() {
  const router = useRouter();
  const [liabilityName, setLiabilityName] = useState('');
  const [liabilityType, setLiabilityType] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!liabilityName || !liabilityType || !amount || !dueDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      `Liability "${liabilityName}" added successfully!`,
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
        <Text style={styles.title}>Add Liability</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Liability Name *</Text>
          <View style={styles.inputContainer}>
            <Receipt size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={liabilityName}
              onChangeText={setLiabilityName}
              placeholder="e.g., HDFC Credit Card, Electricity Bill"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type *</Text>
          <View style={styles.typeGrid}>
            {liabilityTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  liabilityType === type.id && styles.typeButtonSelected,
                ]}
                onPress={() => setLiabilityType(type.id)}>
                <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                  {type.icon}
                  {liabilityType === type.id && (
                    <View style={styles.checkOverlay}>
                      <Check size={16} color="#ffffff" strokeWidth={3} />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.typeName,
                  liabilityType === type.id && styles.typeNameSelected
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Amount *</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="Amount due"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Due Date *</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={dueDate}
              onChangeText={setDueDate}
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
              placeholder="Additional details about the liability"
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
            <AlertTriangle size={24} color="#ffffff" strokeWidth={2} />
            <Text style={styles.saveButtonText}>Add Liability</Text>
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