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
import { useFinance, Asset } from '../context/FinanceContext';

interface AssetFormScreenProps {
  navigation: any;
  route: any;
}

const assetTypes = [
  { id: 'property', name: 'Property', icon: '🏠', color: '#3B82F6' },
  { id: 'vehicle', name: 'Vehicle', icon: '🚗', color: '#10B981' },
  { id: 'gold', name: 'Gold', icon: '🥇', color: '#F59E0B' },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#8B5CF6' },
  { id: 'other', name: 'Other', icon: '📝', color: '#6B7280' },
];

export default function AssetFormScreen({ navigation, route }: AssetFormScreenProps) {
  const { addAsset, updateAsset } = useFinance();
  const editingAsset = route.params?.asset as Asset | undefined;
  const isEditing = !!editingAsset;

  const [formData, setFormData] = useState({
    name: editingAsset?.name || '',
    type: editingAsset?.type || 'property',
    currentValue: editingAsset?.currentValue?.toString() || '',
    acquisitionDate: editingAsset?.acquisitionDate || new Date().toISOString().split('T')[0],
    notes: editingAsset?.notes || '',
  });

  const handleSave = async () => {
    if (!formData.name || !formData.currentValue) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const assetData = {
        name: formData.name,
        type: formData.type as any,
        currentValue: parseFloat(formData.currentValue),
        acquisitionDate: formData.acquisitionDate,
        notes: formData.notes || undefined,
      };

      if (isEditing && editingAsset) {
        await updateAsset({ ...editingAsset, ...assetData });
        Alert.alert('Success', 'Asset updated successfully!');
      } else {
        await addAsset(assetData);
        Alert.alert('Success', 'Asset added successfully!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save asset');
    }
  };

  const renderTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Asset Type</Text>
      <View style={styles.typeGrid}>
        {assetTypes.map((type) => (
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
        <Text style={styles.title}>{isEditing ? 'Edit Asset' : 'Add Asset'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {renderInputField(
          'Asset Name',
          formData.name,
          (text) => setFormData({ ...formData, name: text }),
          'Enter asset name',
          'default',
          'file-text'
        )}

        {renderTypeSelector()}

        {renderInputField(
          'Current Value (₹)',
          formData.currentValue,
          (text) => setFormData({ ...formData, currentValue: text }),
          '0',
          'numeric',
          'dollar-sign'
        )}

        {renderInputField(
          'Acquisition Date',
          formData.acquisitionDate,
          (text) => setFormData({ ...formData, acquisitionDate: text }),
          'YYYY-MM-DD',
          'default',
          'calendar'
        )}

        {renderInputField(
          'Notes (Optional)',
          formData.notes,
          (text) => setFormData({ ...formData, notes: text }),
          'Add any additional notes...',
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
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <Icon name="save" size={24} color="#ffffff" />
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Asset' : 'Add Asset'}
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
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#10B981',
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
    color: '#10B981',
    fontWeight: '600',
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