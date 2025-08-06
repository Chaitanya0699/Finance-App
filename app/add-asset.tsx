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
import { ArrowLeft, Building2, Car, Coins, Chrome as Home, Calendar, FileText, DollarSign, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const assetTypes = [
  { id: 'property', name: 'Property', icon: <Home size={24} color="#ffffff" />, color: '#3B82F6' },
  { id: 'vehicle', name: 'Vehicle', icon: <Car size={24} color="#ffffff" />, color: '#10B981' },
  { id: 'gold', name: 'Gold/Jewelry', icon: <Coins size={24} color="#ffffff" />, color: '#F59E0B' },
  { id: 'other', name: 'Other', icon: <Building2 size={24} color="#ffffff" />, color: '#8B5CF6' },
];

export default function AddAssetScreen() {
  const router = useRouter();
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [purchaseValue, setPurchaseValue] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!assetName || !assetType || !currentValue || !purchaseValue) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      `Asset "${assetName}" added successfully!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
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
        <Text style={styles.title}>Add Asset</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Asset Name *</Text>
          <View style={styles.inputContainer}>
            <Building2 size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={assetName}
              onChangeText={setAssetName}
              placeholder="e.g., Mumbai Apartment, Honda City"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Asset Type *</Text>
          <View style={styles.typeGrid}>
            {assetTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  assetType === type.id && styles.typeButtonSelected,
                ]}
                onPress={() => setAssetType(type.id)}>
                <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                  {type.icon}
                  {assetType === type.id && (
                    <View style={styles.checkOverlay}>
                      <Check size={16} color="#ffffff" strokeWidth={3} />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.typeName,
                  assetType === type.id && styles.typeNameSelected
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
            <DollarSign size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
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
          <Text style={styles.sectionLabel}>Purchase Value *</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={purchaseValue}
              onChangeText={setPurchaseValue}
              placeholder="Original purchase price"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Acquisition Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#64748b" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={acquisitionDate}
              onChangeText={setAcquisitionDate}
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
              placeholder="Additional details about the asset"
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
            <Building2 size={20} color="#ffffff" strokeWidth={2.5} style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>Add Asset</Text>
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
    elevation: 2 
  },
  typeButtonSelected: { 
    backgroundColor: '#f0f9ff', 
    borderWidth: 2, 
    borderColor: '#3B82F6' 
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
  typeNameSelected: { 
    color: '#3B82F6' 
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