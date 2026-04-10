// src/tv/components/SidebarRail.js
// ✅ يملأ الحاوية الأب بالكامل (100% عرض وارتفاع) + تناسق تام مع الشاشة

import React, { useState, useCallback, useEffect, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FocusWrapper from './FocusWrapper';

const TV_TABS = [
  { id: 'home', icon: '🏠', label: 'الرئيسية' },
  { id: 'channels', icon: '📺', label: 'القنوات' },
  { id: 'movies', icon: '🎬', label: 'الأفلام' },
  { id: 'series', icon: '🎭', label: 'المسلسلات' },
  { id: 'more', icon: '⋯', label: 'المزيد' },
];

const SidebarRail = memo(({ activeTab, onTabPress, onFocusArea }) => {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const idx = TV_TABS.findIndex(t => t.id === activeTab);
    if (idx !== -1) setFocusedIndex(idx);
  }, [activeTab]);

  return (
    <View style={[styles.container, { backgroundColor: c.bottomNavBg }]} onFocus={onFocusArea}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: c.primary }]} numberOfLines={1} adjustsFontSizeToFit>mezlive</Text>
      </View>

      <View style={styles.tabsContainer}>
        {TV_TABS.map((tab, index) => {
          const isActive = tab.id === activeTab;
          return (
            <FocusWrapper 
              key={tab.id} 
              onPress={() => onTabPress?.(tab.id)} 
              onFocus={() => { setFocusedIndex(index); onFocusArea?.(); }} 
              style={styles.tabWrapper}
            >
              <View style={styles.tabInner}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, { color: isActive ? c.primary : c.textSecondary, fontWeight: isActive ? '700' : '500' }]} numberOfLines={1}>{tab.label}</Text>
                {isActive && <View style={[styles.activeIndicator, { backgroundColor: c.primary }]} />}
              </View>
            </FocusWrapper>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: c.textSecondary }]}>v{currentTheme.version || '1.0.7'}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%', paddingTop: 20, paddingBottom: 20, paddingHorizontal: 16, flexDirection: 'column', justifyContent: 'space-between' },
  header: { paddingVertical: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  logo: { fontSize: 24, fontWeight: '900', letterSpacing: 2, textAlign: 'center' },
  tabsContainer: { flex: 1, justifyContent: 'center', gap: 12 },
  tabWrapper: { borderRadius: 16, overflow: 'hidden', height: 56 },
  tabInner: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 12, gap: 10, backgroundColor: 'transparent' },
  tabIcon: { fontSize: 22 },
  tabLabel: { flex: 1, textAlign: 'right', fontSize: 15 },
  activeIndicator: { position: 'absolute', right: 12, width: 4, height: '60%', borderRadius: 2 },
  footer: { paddingVertical: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  footerText: { fontSize: 12, fontWeight: '500' },
});

export default SidebarRail;