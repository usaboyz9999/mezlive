// src/tv/screens/TVMoviesScreen.js
// 🎬 شاشة الأفلام للتلفاز - نسخة مبسطة قابلة للتطوير
// ✅ تعرض شبكة أفلام مع دعم التركيز والبحث المبسط

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FocusWrapper from '../components/FocusWrapper';
import TVContentCard from '../components/TVContentCard';
import tvTheme from '../theme/tvTheme';

// 📦 استيراد البيانات الأصلية
import { moviesArabic, moviesForeign } from '../../data/mockData';

/**
 * 🎬 TVMoviesScreen: شاشة الأفلام للتلفاز
 * @param {Object} props
 * @param {Function} props.onPlay - دالة تشغيل الفيلم
 * @param {number} props.scrollKey - مفتاح لإعادة ضبط التمرير
 */
export default function TVMoviesScreen({ onPlay, scrollKey = 0 }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const [searchQuery, setSearchQuery] = useState('');

  // 🔄 دمج وتطبيع جميع الأفلام (نفس المنطق الأصلي)
  const allMovies = useMemo(() => {
    const combined = [...moviesArabic, ...moviesForeign];
    return combined.map(movie => ({
      id: movie.id,
      title: movie.title || movie.name,
      streamUrl: movie.streamUrl || movie.videoUrl,
      poster: movie.poster || movie.image,
      year: movie.year,
      rating: movie.rating,
      description: movie.description,
      genres: movie.genres
    }));
  }, []);

  // 🔍 فلترة البحث البسيطة
  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return allMovies;
    const q = searchQuery.toLowerCase().trim();
    return allMovies.filter(movie => 
      movie.title?.toLowerCase().includes(q) || 
      movie.description?.toLowerCase().includes(q) ||
      movie.genres?.some(g => g?.toLowerCase().includes(q))
    );
  }, [searchQuery, allMovies]);

  // 🎬 دالة التشغيل (متوافقة مع الأصل)
  const handlePlayMovie = useCallback((movie) => {
    if (!movie?.streamUrl) {
      console.warn('❌ لا يوجد رابط تشغيل');
      return;
    }
    onPlay?.({
      id: movie.id,
      title: movie.title,
      streamUrl: movie.streamUrl,
      poster: movie.poster
    });
  }, [onPlay]);

  // ⏳ حالة فارغة بسيطة
  if (allMovies.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: c.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: c.primary, fontSize: tvTheme.font.xxxl }}>🎬</Text>
        <Text style={{ color: c.textSecondary, fontSize: tvTheme.font.lg, marginTop: tvTheme.spacing.lg }}>لا توجد أفلام متاحة</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]} key={scrollKey}>
      
      {/* 🔍 شريط بحث مبسط (قابل للتركيز) */}
      <View style={[styles.searchContainer, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={{ fontSize: tvTheme.font.lg, marginRight: tvTheme.spacing.md }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: c.text, fontSize: tvTheme.font.md }]}
          placeholder="ابحث عن فيلم..."
          placeholderTextColor={c.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable={false} // 🎮 معطل مؤقتاً للريموت (مستقبلي: نفعّله مع لوحة مفاتيح افتراضية)
        />
        {searchQuery.length > 0 && (
          <FocusWrapper onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={{ fontSize: tvTheme.font.lg, color: c.textSecondary }}>✕</Text>
          </FocusWrapper>
        )}
      </View>

      {/* 📋 شبكة الأفلام */}
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={tvTheme.grid.columns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TVContentCard
            item={item}
            type="movie"
            onPress={() => handlePlayMovie(item)}
            style={styles.cardItem}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: tvTheme.font.xxxl, marginBottom: tvTheme.spacing.lg }}>🔍</Text>
            <Text style={[{ color: c.text, fontSize: tvTheme.font.lg }]}>
              {searchQuery.trim() ? 'لا توجد نتائج' : 'لا توجد أفلام'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

// 🎨 الأنماط المخصصة للتلفاز
const styles = StyleSheet.create({
  container: { flex: 1 },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: tvTheme.spacing.lg,
    marginTop: tvTheme.spacing.md,
    marginBottom: tvTheme.spacing.lg,
    paddingHorizontal: tvTheme.spacing.lg,
    paddingVertical: tvTheme.spacing.md,
    borderRadius: tvTheme.radius.lg,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
  },
  clearBtn: {
    padding: tvTheme.spacing.sm,
  },
  
  gridContainer: { 
    padding: tvTheme.spacing.lg,
    paddingTop: 0,
    paddingBottom: tvTheme.spacing.xl * 3,
  },
  columnWrapper: {
    gap: tvTheme.grid.gap,
    marginBottom: tvTheme.grid.gap,
  },
  cardItem: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: tvTheme.spacing.xl * 2,
  },
});