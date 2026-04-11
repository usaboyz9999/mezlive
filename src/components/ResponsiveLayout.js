// src/components/ResponsiveLayout.js
// 📱 تخطيط ذكي - يرفع القائمة فوق شريط النظام دون تغطية المحتوى

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useOrientation from '../hooks/useOrientation';
import BottomNav from './BottomNav';

export default function ResponsiveLayout({ children, activeTab, onTabPress }) {
  const { isLandscape } = useOrientation();
  const insets = useSafeAreaInsets();
  
  // ارتفاع القائمة السفلية الثابت
  const NAV_HEIGHT = 80;

  // 📺 الوضع الأفقي - نفس الكود الأصلي بدون تعديل
  if (isLandscape) {
    return (
      <View style={styles.landscapeContainer}>
        <View style={styles.landscapeContent}>
          {children}
        </View>
        <View style={styles.landscapeSidebar}>
          <BottomNav activeTab={activeTab} onTabPress={onTabPress} />
        </View>
      </View>
    );
  }

  // 📱 الوضع الرأسي - الحل الجذري
  return (
    <View style={styles.portraitContainer}>
      {/* المحتوى: يُدفع للأعلى بمقدار ارتفاع القائمة + شريط النظام */}
      <View style={[styles.portraitContent, { paddingBottom: NAV_HEIGHT + insets.bottom }]}>
        {children}
      </View>
      
      {/* القائمة: تجلس في الأسفل فوق شريط النظام مباشرة */}
      <View style={[styles.portraitNav, { paddingBottom: insets.bottom }]}>
        <BottomNav activeTab={activeTab} onTabPress={onTabPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  landscapeContainer: { flex: 1, flexDirection: 'row' },
  landscapeContent: { flex: 1 },
  landscapeSidebar: { 
    width: 80, 
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: '#1a1a2e'
  },
  portraitContainer: { flex: 1, backgroundColor: '#0f0f1a' },
  portraitContent: { flex: 1 },
  portraitNav: { 
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  }
});