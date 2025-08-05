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
import { ArrowLeft, TrendingUp, Building2, Briefcase, Coins, Globe, Calendar, FileText, DollarSign, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const investmentTypes = [
  { id: 'stocks', name: 'Stocks', icon: <Building2 size={24} color="#ffffff" />, color: '#3B82F6' },
  { id: 'mutual_funds', name: 'Mutual Funds', icon: <Briefcase size={24} color="#ffffff" />, color: '#10B981' },
  { id: 'bonds', name: 'Bonds', icon: <Coins size={24} color="#ffffff" />, color: '#F59E0B' },
  { id: 'etf', name: 'ETF', icon: <Globe size={24} color="#ffffff" />, color: '#8B5CF6' },
  { id: 'crypto', name: 'Cryptocurrency', icon: <TrendingUp size={24} color="#ffffff" />, color: '#EF4444' },
  { id: 'other', name: 'Other', icon: <TrendingUp size={24} color="#ffffff" />, color: '#64748B' },
];

export default function AddInvestmentScreen() {
  const router = useRouter();
  const [investmentName, setInvestmentName] = useState('');
  const [investmentType, setInvestmentType] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');
  const [investmentDate, setInvestmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!investmentName || !investmentType || !currentValue || !investedAmount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      `Investment "${investmentName}" added successfully!`,
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
        <Text style={styles.title}>Add Investment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Investment Name *</Text>
          <View style={styles.inputContainer}>
            <TrendingUp size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={investmentName}
              onChangeText={setInvestmentName}
              placeholder="e.g., Apple Stock, Bitcoin, Gold ETF"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Investment Type *</Text>
          <View style={styles.typeGrid}>
            {investmentTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  investmentType === type.id && styles.typeButtonSelected,
                ]}
                onPress={() => setInvestmentType(type.id)}>
                <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                  {type.icon}
                  {investmentType === type.id && (
                    <View style={styles.checkOverlay}>
                      <Check size={16} color="#ffffff" strokeWidth={3} />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.typeName,
                  investmentType === type.id && styles.typeNameSelected
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Current Value *</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={currentValue}
              onChangeText={setCurrentValue}
              placeholder="Current market value"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Invested Amount *</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={investedAmount}
              onChangeText={setInvestedAmount}
              placeholder="Amount originally invested"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Investment Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={investmentDate}
              onChangeText={setInvestmentDate}
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
              placeholder="Additional details about this investment"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <TrendingUp size={24} color="#ffffff" strokeWidth={2} />
            <Text style={styles.saveButtonText}>Add Investment</Text>
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
  fundsList: { gap: 12 },
  fundChip: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, elevation: 2 },
  fundName: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  fundDetails: { fontSize: 14, color: '#64748b' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, elevation: 2 },
  textInput: { flex: 1, fontSize: 16, color: '#1e293b', marginLeft: 12 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: -6 },
  typeButton: { width: '31%', backgroundColor: '#ffffff', borderRadius: 16, padding: 12, alignItems: 'center', marginHorizontal: 6, marginBottom: 12, elevation: 2 },
  typeButtonSelected: { backgroundColor: '#f0f9ff', borderWidth: 2, borderColor: '#3B82F6' },
  typeIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' },
  checkOverlay: { position: 'absolute', top: -4, right: -4, backgroundColor: '#3B82F6', borderRadius: 12, padding: 4, borderWidth: 2, borderColor: '#ffffff' },
  typeName: { fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'center' },
  typeNameSelected: { color: '#3B82F6' },
  riskGrid: { flexDirection: 'row', gap: 12 },
  riskButton: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, alignItems: 'center', elevation: 2 },
  riskButtonSelected: { backgroundColor: '#f0f9ff', borderWidth: 2, borderColor: '#3B82F6' },
  riskIndicator: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  riskIndicatorSelected: { transform: [{ scale: 1.1 }] },
  riskName: { fontSize: 14, fontWeight: '600', color: '#64748b', textAlign: 'center' },
  riskNameSelected: { color: '#3B82F6' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, elevation: 4, marginBottom: 40 },
  saveButtonText: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginLeft: 8 },
});