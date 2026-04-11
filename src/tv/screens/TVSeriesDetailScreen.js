// src/tv/screens/TVSeriesDetailScreen.js
// 🎬 تفاصيل المسلسل للتلفاز - متطابقة مع الهاتف + مواسم ديناميكية + تشغيل فوري

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, View, FlatList, Image, Text, 
  TouchableOpacity, StatusBar, Platform, ScrollView, Animated 
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function TVSeriesDetailScreen({ 
  series, // ✅ استلام مباشر بدلاً من route.params
  onPlayEpisode,
  onBack,
  focusArea,
  scrollRef,
}) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  
  const [focusedEpId, setFocusedEpId] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [fadeAnim]);

  // ✅ تجميع الحلقات حسب الموسم
  const seasons = useMemo(() => {
    if (!series?.episodes?.length) return [{ seasonNum: 1, episodes: [] }];
    
    const grouped = {};
    series.episodes.forEach(ep => {
      const s = ep.season || ep.seasonNum || ep.Season || 1;
      if (!grouped[s]) grouped[s] = [];
      grouped[s].push({
        id: ep.id || `ep-${Math.random()}`,
        name: ep.name || ep.title || `حلقة ${ep.episode || ep.episodeNum || '?'}`,
        streamUrl: ep.streamUrl || ep.url || ep.link,
        episodeNum: ep.episode || ep.episodeNum || ep.Episode,
        description: ep.description || ep.synopsis || '',
        poster: ep.poster || ep.image || series.poster
      });
    });

    return Object.entries(grouped)
      .map(([num, eps]) => ({
        seasonNum: parseInt(num),
        episodes: eps.sort((a, b) => (a.episodeNum || 0) - (b.episodeNum || 0))
      }))
      .sort((a, b) => a.seasonNum - b.seasonNum);
  }, [series]);

  const currentEps = useMemo(() => 
    seasons.find(s => s.seasonNum === selectedSeason)?.episodes || [],
  [seasons, selectedSeason]);

  const handlePlay = useCallback((ep) => {
    if (ep?.streamUrl && onPlayEpisode) {
      onPlayEpisode({ ...ep, seriesName: series?.name, seriesPoster: series?.poster });
    }
  }, [onPlayEpisode, series]);

  const renderSeason = useCallback(({ item: s }) => (
    <TouchableOpacity
      style={[styles.seasonTab, { 
        backgroundColor: selectedSeason === s.seasonNum ? c.primary : c.surface || 'rgba(255,255,255,0.05)',
        borderColor: selectedSeason === s.seasonNum ? c.primary : 'transparent'
      }]}
      onPress={() => setSelectedSeason(s.seasonNum)}
      activeOpacity={0.7}
    >
      <Text style={[styles.seasonText, { color: selectedSeason === s.seasonNum ? '#000' : c.text }]}>
        موسم {s.seasonNum}
      </Text>
    </TouchableOpacity>
  ), [selectedSeason, c]);

  const renderEpisode = useCallback(({ item: ep }) => {
    const isFocused = ep.id === focusedEpId;
    return (
      <TouchableOpacity
        style={[styles.epRow, { 
          backgroundColor: c.surface || 'rgba(255,255,255,0.03)',
          borderColor: isFocused ? c.primary : 'transparent'
        }]}
        onPress={() => handlePlay(ep)}
        onFocus={() => setFocusedEpId(ep.id)}
        onBlur={() => setFocusedEpId(null)}
        activeOpacity={0.8}
      >
        <View style={styles.epNumBox}>
          <Text style={[styles.epNum, { color: c.primary }]}>{ep.episodeNum || '•'}</Text>
        </View>
        <View style={styles.epInfo}>
          <Text style={[styles.epName, { color: c.text }]} numberOfLines={2}>{ep.name}</Text>
          {ep.description && <Text style={[styles.epDesc, { color: c.textSecondary }]} numberOfLines={1}>{ep.description}</Text>}
        </View>
        <Text style={{ color: c.primary, fontSize: 22, marginLeft: 10 }}>▶</Text>
      </TouchableOpacity>
    );
  }, [c, focusedEpId, handlePlay]);

  if (!series) return <View style={[styles.center, { backgroundColor: c.background }]}><Text style={{ color: c.textSecondary }}>جاري التحميل...</Text></View>;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { borderBottomColor: c.border || 'rgba(255,255,255,0.1)' }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={{ color: c.text, fontSize: 26 }}>←</Text></TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, { color: c.primary, opacity: fadeAnim }]} numberOfLines={1}>{series.name}</Animated.Text>
        <Text style={[styles.headerCount, { color: c.textSecondary }]}>{series.episodes?.length || 0} حلقة</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryBox}>
          <Image source={{ uri: series.poster }} style={styles.summaryImg} resizeMode="cover" />
          <View style={styles.summaryInfo}>
            <Text style={[styles.summaryName, { color: c.text }]}>{series.name}</Text>
            {(series.year || series.genre) && <Text style={[styles.summaryMeta, { color: c.textSecondary }]}>{series.year} {series.year && series.genre ? '•' : ''} {series.genre}</Text>}
            {series.description && <Text style={[styles.summaryDesc, { color: c.textSecondary }]} numberOfLines={3}>{series.description}</Text>}
          </View>
        </View>

        {seasons.length > 1 && (
          <View style={styles.seasonsWrap}>
            <FlatList data={seasons} renderItem={renderSeason} keyExtractor={s => `s-${s.seasonNum}`} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.seasonsList} />
          </View>
        )}

        <View style={styles.epsWrap}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>حلقات موسم {selectedSeason}</Text>
          <FlatList
            data={currentEps}
            renderItem={renderEpisode}
            keyExtractor={ep => ep.id}
            contentContainerStyle={styles.epsList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            windowSize={4}
            removeClippedSubviews={Platform.OS === 'android'}
            focusable={focusArea === 'content'}
            hasTVPreferredFocus={focusArea === 'content' && currentEps.length > 0}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, backgroundColor: 'transparent' },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 20, fontWeight: '800', flex: 1, textAlign: 'center' },
  headerCount: { fontSize: 14, width: 50, textAlign: 'right' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  summaryBox: { flexDirection: 'row-reverse', padding: 20, gap: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  summaryImg: { width: 120, height: 180, borderRadius: 12 },
  summaryInfo: { flex: 1, justifyContent: 'center' },
  summaryName: { fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'right' },
  summaryMeta: { fontSize: 14, marginBottom: 10, textAlign: 'right' },
  summaryDesc: { fontSize: 14, lineHeight: 20, textAlign: 'right' },
  seasonsWrap: { padding: 16 },
  seasonsList: { gap: 10 },
  seasonTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1, minWidth: 100, alignItems: 'center' },
  seasonText: { fontSize: 15, fontWeight: '600' },
  epsWrap: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, textAlign: 'right' },
  epsList: { gap: 10 },
  epRow: { flexDirection: 'row-reverse', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, gap: 12 },
  epNumBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  epNum: { fontSize: 18, fontWeight: '700' },
  epInfo: { flex: 1 },
  epName: { fontSize: 16, fontWeight: '600', marginBottom: 4, textAlign: 'right' },
  epDesc: { fontSize: 13 }
});