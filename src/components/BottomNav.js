import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const TABS = [
  { id: 'home', icon: '🏠', label: 'الرئيسية' },
  { id: 'channels', icon: '📺', label: 'القناة' },
  { id: 'movies', icon: '🎬', label: 'الأفلام' },
  { id: 'series', icon: '🎭', label: 'المسلسلات' },
  { id: 'more', icon: '⋯', label: 'المود' },
];

export default function BottomNav({ activeTab, onTabPress }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const f = currentTheme.font;

  return (
    <View style={[styles.container, { backgroundColor: c.bottomNavBg, borderTopColor: c.border }]}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => onTabPress(tab.id)} activeOpacity={0.7}>
            <Text style={{ fontSize: 22, marginBottom: 4 }}>{tab.icon}</Text>
            <Text style={[styles.label, { color: isActive ? c.primary : c.textSecondary, fontSize: f.xs, fontWeight: isActive ? '700' : '500' }]}>
              {tab.label}
            </Text>
            {isActive && <View style={[styles.activeIndicator, { backgroundColor: c.primary }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    borderTopWidth: 0.5, 
    paddingTop: 12, 
    paddingBottom: 28,
    paddingHorizontal: 10,
    height: 80, 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  label: { fontWeight: '500' },
  activeIndicator: { position: 'absolute', bottom: -8, width: 4, height: 4, borderRadius: 2 }
});