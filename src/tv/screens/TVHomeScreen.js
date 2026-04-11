// src/tv/screens/TVHomeScreen.js
// ✅ تم إضافة تشغيل قناة عشوائية فوراً عند الضغط على "تصفح القنوات"

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FocusWrapper from '../components/FocusWrapper';
import { fetchAppData } from '../../data/mockData';
import { M3U_CONTENT } from '../../../channels';
import { COUNTRIES_M3U } from '../../../countries';
import { parseM3UWithHeaders } from '../../utils/m3uParser';

export default function TVHomeScreen({ 
  onPlayChannel, onPlayEpisode, scrollKey, 
  focusArea, lastSection, setFocusArea, setLastSection, scrollRef 
}) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentContainerRef = useRef(null);

  useEffect(() => { fetchAppData().then(setAppData).finally(() => setLoading(false)); }, []);

  // 🎲 دمج القنوات من الملفين واختيار عشوائي
  const allChannels = useMemo(() => {
    const ch1 = parseM3UWithHeaders(M3U_CONTENT);
    const ch2 = parseM3UWithHeaders(COUNTRIES_M3U);
    return [...ch1, ...ch2].filter(ch => ch?.streamUrl);
  }, []);

  const handleRandomChannel = useCallback(() => {
    if (allChannels.length > 0) {
      const random = allChannels[Math.floor(Math.random() * allChannels.length)];
      onPlayChannel?.(random);
    }
  }, [allChannels, onPlayChannel]);

  useEffect(() => {
    if (focusArea === 'content' && Platform.OS === 'web') {
      const timer = setTimeout(() => {
        if (contentContainerRef.current) contentContainerRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusArea]);

  const reportFocus = useCallback((sectionId) => {
    setLastSection(sectionId);
    if (focusArea !== 'content') setFocusArea('content');
  }, [setLastSection, setFocusArea, focusArea]);

  if (loading) return <View style={[styles.center, { backgroundColor: c.background }]}><Text style={{ color: c.primary, fontSize: 40 }}>⏳</Text></View>;

  return (
    <ScrollView 
      ref={scrollRef} 
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={styles.scrollContent} 
      showsVerticalScrollIndicator={false}
    >
      <View ref={contentContainerRef} style={styles.contentWrapper} tabIndex={-1}>
        <FocusWrapper 
          onPress={handleRandomChannel} 
          onFocus={() => reportFocus('quickCard')} 
          style={styles.quickCard}
          autoFocus={Platform.OS === 'web'}
        >
          <View style={styles.quickCardInner}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>📺</Text>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>تصفح القنوات</Text>
          </View>
        </FocusWrapper>

        <Text style={[styles.title, { color: c.text }]}>المجموعات المميزة</Text>
        <View style={styles.groupsGrid}>
          {[
            { id: 'mbc', name: 'MBC', logo: 'https://ui-avatars.com/api/?name=MBC&background=E50914&color=fff' },
            { id: 'rotana', name: 'Rotana', logo: 'https://ui-avatars.com/api/?name=Rotana&background=1E90FF&color=fff' },
            { id: 'cbc', name: 'CBC', logo: 'https://ui-avatars.com/api/?name=CBC&background=FF6B00&color=fff' }
          ].map(g => (
            <FocusWrapper key={g.id} onPress={() => {}} onFocus={() => reportFocus('groups')} style={styles.groupItem}>
              <View style={styles.groupBox}>
                <Image source={{ uri: g.logo }} style={styles.groupImg} resizeMode="contain" />
                <Text style={[styles.groupName, { color: c.text }]}>{g.name}</Text>
              </View>
            </FocusWrapper>
          ))}
        </View>

        {appData?.seriesArabic?.length > 0 && (
          <>
            <Text style={[styles.title, { color: c.text }]}>أحدث المسلسلات</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 10 }}>
              {appData.seriesArabic.slice(0, 6).map(s => (
                <FocusWrapper key={s.id} onPress={() => {}} onFocus={() => reportFocus('series')} style={styles.seriesCard}>
                  <View style={styles.seriesCardInner}>
                    <Image source={{ uri: s.poster }} style={styles.seriesImg} />
                    <Text style={[styles.seriesTitle, { color: c.text }]} numberOfLines={1}>{s.title}</Text>
                  </View>
                </FocusWrapper>
              ))}
            </ScrollView>
          </>
        )}

        {appData?.moviesArabic?.length > 0 && (
          <>
            <Text style={[styles.title, { color: c.text }]}>أحدث الأفلام</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 10 }}>
              {appData.moviesArabic.slice(0, 6).map(m => (
                <FocusWrapper key={m.id} onPress={() => onPlayEpisode?.(m)} onFocus={() => reportFocus('movies')} style={styles.movieCard}>
                  <View style={styles.movieCardInner}>
                    <Image source={{ uri: m.poster || m.image }} style={styles.movieImg} />
                    <Text style={[styles.movieTitle, { color: c.text }]} numberOfLines={1}>{m.title || m.name}</Text>
                  </View>
                </FocusWrapper>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginTop: 24, marginBottom: 14, paddingLeft: 4 },
  contentWrapper: { outline: 'none' },
  
  quickCard: { marginBottom: 20, borderRadius: 16 },
  quickCardInner: { height: 140, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: '#B861FF', borderWidth: 0, overflow: 'hidden' },
  
  groupsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  groupItem: { borderRadius: 16 },
  groupBox: { alignItems: 'center', width: 100, padding: 8, backgroundColor: 'transparent' },
  groupImg: { width: 75, height: 75, marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderWidth: 0 },
  groupName: { textAlign: 'center', fontSize: 14, fontWeight: '600' },

  seriesCard: { borderRadius: 16, width: 130 },
  seriesCardInner: { backgroundColor: 'transparent', borderWidth: 0, borderRadius: 12 },
  seriesImg: { width: 130, height: 190, borderRadius: 12, backgroundColor: '#1a1a1a' },
  seriesTitle: { marginTop: 8, textAlign: 'center', fontSize: 13, fontWeight: '500' },

  movieCard: { borderRadius: 16, width: 130 },
  movieCardInner: { backgroundColor: 'transparent', borderWidth: 0, borderRadius: 12 },
  movieImg: { width: 130, height: 190, borderRadius: 12, backgroundColor: '#1a1a1a' },
  movieTitle: { marginTop: 8, textAlign: 'center', fontSize: 13, fontWeight: '500' },
});