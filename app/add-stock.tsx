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
import { ArrowLeft, Building2, Search, DollarSign, Hash, Calendar, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 185.25 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 156.75 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 485.20 },
];

export default function AddStockScreen() {
  const router = useRouter();
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockName, setStockName] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleStockSelect = (stock: any) => {
    setStockSymbol(stock.symbol);
    setStockName(stock.name);
    setPurchasePrice(stock.price.toString());
  };

  const handleSave = () => {
    if (!stockSymbol || !stockName || !shares || !purchasePrice) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      `Stock "${stockSymbol}" added successfully!`,
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
        <Text style={styles.title}>Add Stock</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Popular Stocks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.stocksList}>
              {popularStocks.map((stock) => (
                <TouchableOpacity
                  key={stock.symbol}
                  style={styles.stockChip}
                  onPress={() => handleStockSelect(stock)}>
                  <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                  <Text style={styles.stockPrice}>₹{stock.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Stock Symbol *</Text>
          <View style={styles.inputContainer}>
            <Search size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={stockSymbol}
              onChangeText={setStockSymbol}
              placeholder="e.g., AAPL, GOOGL, MSFT"
              placeholderTextColor="#94a3b8"
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Company Name *</Text>
          <View style={styles.inputContainer}>
            <Building2 size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={stockName}
              onChangeText={setStockName}
              placeholder="e.g., Apple Inc., Microsoft Corp."
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Number of Shares *</Text>
          <View style={styles.inputContainer}>
            <Hash size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={shares}
              onChangeText={setShares}
              placeholder="Number of shares purchased"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Purchase Price per Share *</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="Price per share"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Purchase Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={purchaseDate}
              onChangeText={setPurchaseDate}
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
            colors={['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}>
            <Building2 size={24} color="#ffffff" strokeWidth={2} />
            <Text style={styles.saveButtonText}>Add Stock</Text>
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
  stocksList: { flexDirection: 'row', gap: 12 },
  stockChip: { backgroundColor: '#ffffff', borderRadius: 12, padding: 12, alignItems: 'center', elevation: 2, minWidth: 80 },
  stockSymbol: { fontSize: 14, fontWeight: '700', color: '#3B82F6', marginBottom: 2 },
  stockPrice: { fontSize: 12, color: '#64748b' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, elevation: 2 },
  textInput: { flex: 1, fontSize: 16, color: '#1e293b', marginLeft: 12 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, elevation: 4, marginBottom: 40 },
  saveButtonText: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginLeft: 8 },
});