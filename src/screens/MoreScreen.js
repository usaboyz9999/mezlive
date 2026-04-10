import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

export default function MoreScreen() {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Header title="المزيد" showSearch={false} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: c.surface }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>الإعدادات</Text>
          <Text style={[styles.cardText, { color: c.textSecondary }]}>تخصيص التطبيق والمفضلة</Text>
        </View>
        <View style={[styles.card, { backgroundColor: c.surface }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>حول التطبيق</Text>
          <Text style={[styles.cardText, { color: c.textSecondary }]}>الإصدار 1.0.0 • mezlive</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 80 },
  card: { padding: 20, borderRadius: 12, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardText: { fontSize: 14 }
});