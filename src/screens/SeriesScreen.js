import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import { seriesArabic, seriesForeign } from '../data/mockData';

export default function SeriesScreen({ onOpenSeries }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const allSeries = [...seriesArabic, ...seriesForeign];

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Header title="المسلسلات" showSearch={false} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: c.text }]}>جميع المسلسلات</Text>
        <View style={styles.grid}>
          {allSeries.map(s => (
            // ✅ الربط الصحيح لفتح صفحة التفاصيل
            <ContentCard key={s.id} item={s} type="series" onPress={() => onOpenSeries(s)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 80 },
  title: { marginBottom: 16, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }
});