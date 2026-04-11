// src/components/BottomNav.js
// 🧭 شريط تنقل متجاوب - يدعم الريموت والشاشات الكبيرة

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import useOrientation from '../hooks/useOrientation';
import useScreenScale from '../hooks/useScreenScale';
import TVFocusable from './TVFocusable';

const TABS = [
  { id: 'home', label: 'الرئيسية', iconActive: 'home', iconInactive: 'home-outline' },
  { id: 'channels', label: 'القنوات', iconActive: 'tv', iconInactive: 'tv-outline' },
  { id: 'movies', label: 'الأفلام', iconActive: 'film', iconInactive: 'film-outline' },
  { id: 'series', label: 'المسلسلات', iconActive: 'videocam', iconInactive: 'videocam-outline' },
  { id: 'more', label: 'المزيد', iconActive: 'ellipsis-horizontal', iconInactive: 'ellipsis-horizontal-outline' },
];

export default function BottomNav({ activeTab, onTabPress }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const { isLandscape } = useOrientation();
  const { s, fs, isTV } = useScreenScale();

  if (isLandscape) {
    return (
      <View style={[styles.horizontalContainer, { backgroundColor: c.bottomNavBg, borderLeftColor: c.border }]}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TVFocusable 
              key={tab.id} 
              style={[styles.horizontalTab, isActive && { backgroundColor: 'rgba(255,255,255,0.1)' }]} 
              onPress={() => onTabPress(tab.id)} 
            >
              <Ionicons 
                name={isActive ? tab.iconActive : tab.iconInactive} 
                size={s(26)} 
                color={isActive ? c.primary : c.textSecondary} 
              />
              {isTV && <Text style={[styles.horizontalLabel, { color: isActive ? c.primary : c.textSecondary, fontSize: fs(10) }]}>{tab.label}</Text>}
              {isActive && <View style={[styles.horizontalIndicator, { backgroundColor: c.primary }]} />}
            </TVFocusable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.verticalContainer, { backgroundColor: c.bottomNavBg, borderTopColor: c.border }]}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <TVFocusable key={tab.id} style={styles.verticalTab} onPress={() => onTabPress(tab.id)}>
            <Ionicons name={isActive ? tab.iconActive : tab.iconInactive} size={fs(22)} color={isActive ? c.primary : c.textSecondary} />
            <Text style={[styles.verticalLabel, { color: isActive ? c.primary : c.textSecondary, fontSize: fs(10), fontWeight: isActive ? '700' : '500' }]}>
              {tab.label}
            </Text>
          </TVFocusable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, gap: 14 },
  horizontalTab: { width: '85%', paddingVertical: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  horizontalLabel: { marginTop: 6, textAlign: 'center' },
  horizontalIndicator: { position: 'absolute', left: -3, width: 4, height: '40%', borderRadius: 2 },
  verticalContainer: { flexDirection: 'row', paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 20, paddingHorizontal: 8, height: 80, justifyContent: 'space-around', alignItems: 'center' },
  verticalTab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  verticalLabel: { fontWeight: '500' }
});