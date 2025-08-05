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
import { ArrowLeft, Briefcase, Search, DollarSign, Hash, Calendar, FileText, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const popularFunds = [
  { name: 'Large Cap Growth Fund', nav: 45.67, category: 'Large Cap', risk: 'Medium' },
  { name: 'Mid Cap Value Fund', nav: 32.18, category: 'Mid Cap', risk: 'High' },
  { name: 'Bond Index Fund', nav: 28.95, category: 'Debt', risk: 'Low' },
  { name: 'International Equity', nav: 38.42, category: 'International', risk: 'High' },
];

const riskLevels = [
  { id: 'low', name: 'Low Risk', color: '#10B981' },
  { id: 'medium', name: 'Medium Risk', color: '#F59E0B' },
  { id: 'high', name: 'High Risk', color: '#EF4444' },
];

export default function AddMutualFundScreen() {
  const router = useRouter();
  const [fundName, setFundName] = useState('');
  const [category, setCategory] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [nav, setNav] = useState('');
  const [units, setUnits] = useState('');
  const [investmentDate, setInvestmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [sipAmount, setSipAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleFundSelect = (fund: any) => {
    setFundName(fund.name);
    setCategory(fund.category);
    setRiskLevel(fund.risk.toLowerCase());
    setNav(fund.nav.toString());
  };

  const handleSave = () => {
    if (!fundName || !category || !nav || !units) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      `Mutual Fund "${fundName}" added successfully!`,
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
        <Text style={styles.title}>Add Mutual Fund</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Popular Funds</Text>
          <View style={styles.fundsList}>
            {popularFunds.map((fund, index) => (
              <TouchableOpacity
                key={index}
                style={styles.fundChip}
                onPress={() => handleFundSelect(fund)}>
                <Text style={styles.fundName}>{fund.name}</Text>
                <Text style={styles.fundDetails}>{fund.category} • NAV: ₹{fund.nav}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Fund Name *</Text>
          <View style={styles.inputContainer}>
            <Search size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={fundName}
              onChangeText={setFundName}
              placeholder="e.g., HDFC Top 100 Fund"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category *</Text>
          <View style={styles.inputContainer}>
            <Briefcase size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={category}
              onChangeText={setCategory}
              placeholder="e.g., Large Cap, Mid Cap, Debt"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Risk Level</Text>
          <View style={styles.riskGrid}>
            {riskLevels.map((risk) => (
              <TouchableOpacity
                key={risk.id}
                style={[
                  styles.riskButton,
                  riskLevel === risk.id && styles.riskButtonSelected,
                ]}
                onPress={() => setRiskLevel(risk.id)}>
                <View style={[
                  styles.riskIndicator,
                  { backgroundColor: risk.color },
                  riskLevel === risk.id && styles.riskIndicatorSelected
                ]}>
                  {riskLevel === risk.id && (
                    <Check size={16} color="#ffffff" strokeWidth={3} />
                  )}
                </View>
                <Text style={[
                  styles.riskName,
                  riskLevel === risk.id && styles.riskNameSelected
                ]}>
                  {risk.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Current NAV *</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={nav}
              onChangeText={setNav}
              placeholder="Net Asset Value"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Units Owned *</Text>
          <View style={styles.inputContainer}>
            <Hash size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={units}
              onChangeText={setUnits}
              placeholder="Number of units"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SIP Amount (Optional)</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={sipAmount}
              onChangeText={setSipAmount}
              placeholder="Monthly SIP amount"
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
              placeholder="Additional notes about this investment"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <Briefcase size={24} color="#ffffff" strokeWidth={2} />
            <Text style={styles.saveButtonText}>Add Mutual Fund</Text>
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