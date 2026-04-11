// src/tv/components/TVHeader.js
// 🔝 هيدر محسّن - عنوان لا يتداخل، متجاوب مع جميع الشاشات

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FocusWrapper from './FocusWrapper';

export default function TVHeader({ title = 'mezlive', showBack = false, onBackPress }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;

  return (
    <View style={[styles.container, { backgroundColor: c.headerBg }]}>
      {showBack && (
        <FocusWrapper onPress={onBackPress} style={styles.backBtn}>
          <Text style={{ fontSize: 28, color: c.primary }}>←</Text>
        </FocusWrapper>
      )}
      
      <View style={styles.titleContainer}>
        <Text 
          style={[styles.title, { color: c.primary }]} 
          numberOfLines={1} 
          adjustsFontSizeToFit
        >
          {title}
        </Text>
      </View>
      
      {!showBack && <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '3%',
    paddingBottom: '2%',
    paddingHorizontal: '3%',
    minHeight: 80,
  },
  backBtn: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },
  titleContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: 1, textAlign: 'center', flexShrink: 1 },
  placeholder: { width: 60 },
});