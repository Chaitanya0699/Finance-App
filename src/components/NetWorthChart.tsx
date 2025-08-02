import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface NetWorthChartProps {
  totalAssets: number;
  totalLiabilities: number;
  totalLoans: number;
}

const NetWorthChart: React.FC<NetWorthChartProps> = ({
  totalAssets,
  totalLiabilities,
  totalLoans,
}) => {
  const total = totalAssets + totalLiabilities + totalLoans;
  
  if (total === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data to display</Text>
      </View>
    );
  }

  const data = [
    {
      name: 'Assets',
      value: totalAssets,
      color: '#10B981',
      legendFontColor: '#1e293b',
      legendFontSize: 14,
    },
    {
      name: 'Liabilities',
      value: totalLiabilities,
      color: '#EF4444',
      legendFontColor: '#1e293b',
      legendFontSize: 14,
    },
    {
      name: 'Loans',
      value: totalLoans,
      color: '#F59E0B',
      legendFontColor: '#1e293b',
      legendFontSize: 14,
    },
  ].filter(item => item.value > 0);

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Net Worth Breakdown</Text>
      <PieChart
        data={data}
        width={width - 80}
        height={200}
        chartConfig={chartConfig}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name}: ₹{item.value.toLocaleString('en-IN')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    marginHorizontal: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  legend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
});

export default NetWorthChart;