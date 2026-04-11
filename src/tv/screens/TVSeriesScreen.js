// src/tv/screens/TVSeriesScreen.js
// 🎬 صفحة المسلسلات للتلفاز - استيراد صحيح لـ seriesArabic + معالجة هيكل متوافق

import React, { useMemo, useCallback, useState, useRef } from 'react';
import { 
  StyleSheet, View, FlatList, Image, Text, 
  TouchableOpacity, StatusBar, Platform, Animated 
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

// ✅ استيراد التصدير المسمى الصحيح من mockData.js
import { seriesArabic } from '../../data/mockData'; 

export default function TVSeriesScreen({ 
  onPlayEpisode, 
  onOpenSeries,
  focusArea,
  scrollRef,
  scrollY,
  setScrollY,
}) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  
  const [focusedId, setFocusedId] = useState(null);
  const pressAnim = useRef(new Animated.Value(1)).current;

  // ✅ تطبيع بيانات seriesArabic لتتوافق مع متطلبات التلفاز
  const normalizedSeries = useMemo(() => {
    if (!Array.isArray(seriesArabic) || seriesArabic.length === 0) {
      console.warn('📺 seriesArabic فارغ في mockData.js');
      return [];
    }

    return seriesArabic.map(s => ({
      id: s.id?.toString() || `series-${Math.random().toString(36).substr(2, 9)}`,
      name: s.title || s.name || 'مسلسل بدون عنوان',
      poster: s.poster || s.poster_url || s.image || s.logo || s.thumbnail || 'https://ui-avatars.com/api/?name=🎬&background=6366f1&color=fff&size=200',
      backdrop: s.backdrop || s.poster,
      year: s.year || s.release_year || s.releaseYear || '',
      genre: s.genre || s.category || s.type || (Array.isArray(s.genres) ? s.genres.join(' • ') : ''),
      description: s.description || s.synopsis || s.overview || '',
      rating: s.rating,
      episodes: Array.isArray(s.episodes) ? s.episodes.map(ep => ({
        id: ep.id?.toString() || `ep-${Math.random()}`,
        name: ep.title || ep.name || `حلقة ${ep.episodeNum || ep.episode || '?'}`,
        streamUrl: ep.streamUrl || ep.url || ep.link,
        episodeNum: ep.episodeNum || ep.episode,
        seasonNum: ep.seasonNum || ep.season || 1,
        duration: ep.duration,
        quality: ep.quality,
        description: ep.description || ep.synopsis,
        poster: ep.poster || s.poster
      })) : []
    })).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, []);

  // ✅ فتح تفاصيل المسلسل
  const handleOpen = useCallback((series) => {
    if (!onOpenSeries) {
      console.warn('⚠️ onOpenSeries غير ممررة من TVNavigator');
      return;
    }
    Animated.sequence([
      Animated.timing(pressAnim, { toValue: 0.7, duration: 120, useNativeDriver: true }),
      Animated.timing(pressAnim, { toValue: 1, duration: 120, useNativeDriver: true })
    ]).start();
    onOpenSeries(series);
  }, [onOpenSeries, pressAnim]);

  const renderItem = useCallback(({ item }) => {
    const isFocused = item.id === focusedId;
    return (
      <Animated.View style={[styles.card, { 
        backgroundColor: c.surface || 'rgba(255,255,255,0.03)',
        borderColor: isFocused ? c.primary : 'transparent',
        transform: [{ scale: isFocused ? 1.03 : 1 }],
        opacity: pressAnim 
      }]}>
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={() => handleOpen(item)}
          onFocus={() => setFocusedId(item.id)}
          onBlur={() => setFocusedId(null)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
          <View style={styles.info}>
            <Text style={[styles.name, { color: c.text }]} numberOfLines={2}>{item.name}</Text>
            {(item.year || item.genre) && (
              <Text style={[styles.meta, { color: c.textSecondary }]} numberOfLines={1}>
                {item.year} {item.year && item.genre ? '•' : ''} {item.genre}
              </Text>
            )}
            <Text style={[styles.epCount, { color: c.primary }]}>🎬 {item.episodes.length} حلقة</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [c, focusedId, handleOpen, pressAnim]);

  if (normalizedSeries.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textSecondary, fontSize: 16 }}>لا توجد مسلسلات عربية حالياً</Text>
        <Text style={{ color: c.textSecondary, fontSize: 12, marginTop: 8, textAlign: 'center', opacity: 0.7 }}>
          تأكد من أن seriesArabic في mockData.js يحتوي على بيانات
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { borderBottomColor: c.border || 'rgba(255,255,255,0.1)' }]}>
        <Text style={[styles.headerTitle, { color: c.primary }]}>🎬 المسلسلات</Text>
        <Text style={[styles.headerCount, { color: c.textSecondary }]}>{normalizedSeries.length} مسلسل</Text>
      </View>

      <FlatList
        ref={scrollRef}
        data={normalizedSeries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        windowSize={4}
        removeClippedSubviews={Platform.OS === 'android'}
        onScroll={(e) => setScrollY?.(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        focusable={focusArea === 'content'}
        hasTVPreferredFocus={focusArea === 'content'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, backgroundColor: 'transparent' },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerCount: { fontSize: 14, fontWeight: '500' },
  list: { padding: 16, paddingBottom: 60 },
  row: { gap: 16, justifyContent: 'space-between' },
  card: { flex: 1, borderRadius: 20, overflow: 'hidden', borderWidth: 2, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  cardContent: { flexDirection: 'row-reverse' },
  poster: { width: 100, height: 150 },
  info: { flex: 1, padding: 14, justifyContent: 'center', alignItems: 'flex-end' },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 6, textAlign: 'right' },
  meta: { fontSize: 13, marginBottom: 8, textAlign: 'right' },
  epCount: { fontSize: 14, fontWeight: '600', textAlign: 'right' }
});