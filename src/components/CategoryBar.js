import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const CATEGORIES = [
  { id: 'home', label: 'الرئيسية', icon: '🏠' },
  { id: 'channels', label: 'قوائم القنوات', icon: '📡' },
  { id: 'movies', label: 'أفلام', icon: '🎬' },
  { id: 'series', label: 'مسلسلات', icon: '📺' },
];

export default function CategoryBar({ onSelect, activeCategory }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const r = currentTheme.radius;
  const [internalSelected, setInternalSelected] = useState('home');

  const selected = activeCategory !== undefined ? activeCategory : internalSelected;

  const handleSelect = (id) => {
    setInternalSelected(id);
    onSelect?.(id);
  };

  useEffect(() => {
    if (activeCategory !== undefined) setInternalSelected(activeCategory);
  }, [activeCategory]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === selected;
          return (
            <TouchableOpacity 
              key={cat.id} 
              style={[
                styles.chip,
                { 
                  backgroundColor: isActive ? c.chipActiveBg : c.chipBg,
                  borderColor: isActive ? c.chipActiveBorder : c.chipBorder,
                  borderWidth: isActive ? 2 : 1,
                  borderRadius: r.round,
                  shadowColor: isActive ? c.primary : 'transparent',
                  shadowOpacity: isActive ? 0.5 : 0,
                  shadowRadius: 10,
                  elevation: isActive ? 5 : 0
                }
              ]}
              onPress={() => handleSelect(cat.id)}
            >
              <Text style={{ fontSize: 16, marginLeft: 6 }}>{cat.icon}</Text>
              <Text style={[styles.chipText, { color: isActive ? '#fff' : c.textSecondary }]}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12, marginBottom: 8 },
  scroll: { paddingHorizontal: 20, gap: 12 },
  chip: { paddingHorizontal: 18, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  chipText: { fontSize: 14, fontWeight: '600' }
});