// src/tv/screens/TVSeriesScreen.js
// 🎭 شاشة المسلسلات للتلفاز - نسخة مبسطة قابلة للتطوير
// ✅ تعرض شبكة مسلسلات مع دعم التركيز والتنقل ثنائي الاتجاه

import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import TVContentCard from '../components/TVContentCard';
import tvTheme from '../theme/tvTheme';

// 📦 استيراد البيانات الأصلية
import { seriesArabic, seriesForeign } from '../../data/mockData';

/**
 * 🎭 TVSeriesScreen: شاشة المسلسلات للتلفاز
 * @param {Object} props
 * @param {Function} props.onOpenSeries - دالة فتح تفاصيل المسلسل
 * @param {number} props.scrollKey - مفتاح لإعادة ضبط التمرير
 */
export default function TVSeriesScreen({ onOpenSeries, scrollKey = 0 }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;

  // 🔄 دمج جميع المسلسلات (نفس المنطق الأصلي)
  const allSeries = useMemo(() => {
    return [...seriesArabic, ...seriesForeign];
  }, []);

  // 🎬 دالة فتح التفاصيل (متوافقة مع الأصل)
  const handleOpenSeries = useCallback((series) => {
    onOpenSeries?.(series);
  }, [onOpenSeries]);

  // ⏳ حالة فارغة بسيطة
  if (allSeries.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: c.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: c.primary, fontSize: tvTheme.font.xxxl }}>🎭</Text>
        <Text style={{ color: c.textSecondary, fontSize: tvTheme.font.lg, marginTop: tvTheme.spacing.lg }}>لا توجد مسلسلات متاحة</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]} key={scrollKey}>
      
      {/* 📋 شبكة المسلسلات */}
      <FlatList
        data={allSeries}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={tvTheme.grid.columns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TVContentCard
            item={item}
            type="series"
            onPress={() => handleOpenSeries(item)}
            style={styles.cardItem}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: tvTheme.font.xxxl, marginBottom: tvTheme.spacing.lg }}>🎬</Text>
            <Text style={[{ color: c.text, fontSize: tvTheme.font.lg }]}>لا توجد مسلسلات</Text>
          </View>
        }
      />
    </View>
  );
}

// 🎨 الأنماط المخصصة للتلفاز
const styles = StyleSheet.create({
  container: { flex: 1 },
  gridContainer: { 
    padding: tvTheme.spacing.lg,
    paddingBottom: tvTheme.spacing.xl * 3,
  },
  columnWrapper: {
    gap: tvTheme.grid.gap,
    marginBottom: tvTheme.grid.gap,
  },
  cardItem: {
    // العرض يُحسب تلقائياً حسب عدد الأعمدة
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: tvTheme.spacing.xl * 2,
  },
});