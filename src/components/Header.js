import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ title = 'mezlive', onSearchPress }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const f = currentTheme.font;

  return (
    <View style={[styles.container, { backgroundColor: c.headerBg }]}>
      <View style={styles.left} />
      <Text style={[styles.title, { color: c.primary, fontSize: f.xl, fontWeight: '700' }]}>{title}</Text>
      <TouchableOpacity onPress={onSearchPress} style={styles.searchBtn}>
        <Text style={{ fontSize: 22 }}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 55, paddingBottom: 16, paddingHorizontal: 20 },
  left: { width: 40 },
  title: { letterSpacing: 1 },
  searchBtn: { padding: 8 }
});