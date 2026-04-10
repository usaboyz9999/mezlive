// src/tv/screens/TVMoreScreen.js
// ⋯ شاشة "المزيد" للتلفاز - نسخة مبسطة جداً

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import tvTheme from '../theme/tvTheme';

export default function TVMoreScreen() {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: c.text }]}>المزيد</Text>
        <Text style={[styles.desc, { color: c.textSecondary }]}>
          إصدار التطبيق: {currentTheme.version || '1.0.7'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: tvTheme.spacing.lg },
  title: { fontSize: tvTheme.font.xl, fontWeight: '800', marginBottom: tvTheme.spacing.lg },
  desc: { fontSize: tvTheme.font.md },
});