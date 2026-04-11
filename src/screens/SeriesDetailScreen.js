// src/screens/SeriesDetailScreen.js
// 📺 شاشة تفاصيل المسلسل - متوافقة مع التخطيط الأفقي

import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions, Platform 
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import useOrientation from '../hooks/useOrientation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SeriesDetailScreen({ series, onBack, onPlayEpisode }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const { isLandscape } = useOrientation();

  if (!series) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: c.text, textAlign: 'center', marginTop: 20 }}>⚠️ بيانات المسلسل غير متاحة</Text>
      </View>
    );
  }

  const handlePlayEpisode = (episode) => {
    const hasStreamUrl = !!episode?.streamUrl;
    if (!hasStreamUrl) {
      Alert.alert('غير متاح حالياً', 'هذه الحلقة لا تحتوي على رابط تشغيل متاح.', [{ text: 'موافق' }]);
      return;
    }
    onPlayEpisode?.(episode);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.backdropContainer, isLandscape && styles.backdropLandscape]}>
        <Image
          source={{ uri: series.backdrop || series.poster }}
          style={styles.backdropImage}
          resizeMode="cover"
        />
        <View style={styles.backdropGradient} />
        <TouchableOpacity onPress={onBack} style={styles.backBtnAbsolute}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoSection}>
          <View style={[styles.infoRow, isLandscape && styles.infoRowLandscape]}>
            <Image
              source={{ uri: series.poster || 'https://ui-avatars.com/api/?name=Series&background=random' }}
              style={[styles.poster, isLandscape && styles.posterLandscape]}
              resizeMode="cover"
            />
            <View style={styles.textInfo}>
              <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
                {series.title || series.name}
              </Text>
              <View style={styles.metaRow}>
                {series.year && <Text style={[styles.meta, { color: c.primary }]}>📅 {series.year}</Text>}
                {series.rating && <Text style={[styles.meta, { color: '#F59E0B' }]}>⭐ {series.rating}</Text>}
              </View>
              {series.genres && (
                <Text style={[styles.genres, { color: c.textSecondary }]}>
                  🎭 {series.genres.join(' • ')}
                </Text>
              )}
            </View>
          </View>
          
          {series.description && (
            <Text style={[styles.description, { color: c.textSecondary }]} numberOfLines={4}>
              {series.description}
            </Text>
          )}
          
          {series.cast && series.cast.length > 0 && (
            <View style={styles.castSection}>
              <Text style={[styles.sectionLabel, { color: c.text }]}>🎬 طاقم التمثيل:</Text>
              <Text style={[styles.castList, { color: c.textSecondary }]} numberOfLines={2}>
                {series.cast.join(' • ')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.episodesSection}>
          <View style={styles.episodesHeader}>
            <Text style={[styles.sectionTitle, { color: c.text }]}>
              📼 الحلقات ({series.episodes?.length || 0})
            </Text>
            <Text style={[styles.episodesSub, { color: c.textSecondary }]}>
              اضغط على الحلقة للتشغيل المباشر
            </Text>
          </View>
          
          {series.episodes?.map((ep, idx) => {
            const isPlayable = !!ep?.streamUrl;
            return (
              <TouchableOpacity
                key={ep.id || `ep-${idx}`}
                style={[styles.episodeCard, { backgroundColor: 'rgba(255,255,255,0.05)' }, !isPlayable && { opacity: 0.5 }]}
                onPress={() => isPlayable && handlePlayEpisode(ep)}
                activeOpacity={0.7}
                disabled={!isPlayable}
              >
                <View style={[styles.epNumber, { backgroundColor: c.primary }]}>
                  <Text style={styles.epNumberText}>{ep.id || idx + 1}</Text>
                </View>
                <View style={styles.epInfo}>
                  <Text style={[styles.epTitle, { color: c.text }]} numberOfLines={1}>
                    {ep.title || `الحلقة ${idx + 1}`}
                  </Text>
                  <View style={styles.epMetaRow}>
                    <Text style={[styles.epMeta, { color: c.textSecondary }]}>⏱️ {ep.duration || 'غير محدد'}</Text>
                    <Text style={[styles.epMeta, { color: c.textSecondary }]}>• {ep.quality || 'HD'}</Text>
                  </View>
                </View>
                <View style={styles.playIcon}>
                  <Ionicons name={isPlayable ? "play-circle" : "stop-circle"} size={28} color={isPlayable ? c.primary : '#475569'} />
                </View>
              </TouchableOpacity>
            );
          })}
          
          {(!series.episodes || series.episodes.length === 0) && (
            <Text style={[{ color: c.textSecondary, textAlign: 'center', padding: 20 }]}>
              لا توجد حلقات متاحة حالياً
            </Text>
          )}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdropContainer: { height: 220, position: 'relative', backgroundColor: '#1e293b' },
  backdropLandscape: { height: 180 },
  backdropImage: { width: '100%', height: '100%' },
  backdropGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: 'rgba(15, 23, 42, 0.9)' },
  backBtnAbsolute: { position: 'absolute', top: 40, left: 16, zIndex: 10, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  
  scrollContent: { paddingBottom: 20 },
  infoSection: { padding: 16, marginTop: -60 },
  infoRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  infoRowLandscape: { gap: 20 },
  
  poster: { width: 80, height: 120, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  posterLandscape: { width: 100, height: 150 },
  textInfo: { flex: 1, justifyContent: 'center', paddingTop: 4 },
  title: { fontSize: 19, fontWeight: '800', marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  meta: { fontSize: 12, fontWeight: '600' },
  genres: { fontSize: 12, marginTop: 2 },
  description: { fontSize: 13, lineHeight: 19, marginTop: 10 },
  
  castSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  castList: { fontSize: 12, lineHeight: 17 },
  
  episodesSection: { paddingHorizontal: 16, paddingTop: 8 },
  episodesHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  episodesSub: { fontSize: 12, marginTop: 2 },
  
  episodeCard: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  epNumber: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  epNumberText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  epInfo: { flex: 1 },
  epTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  epMetaRow: { flexDirection: 'row', alignItems: 'center' },
  epMeta: { fontSize: 11 },
  playIcon: { padding: 4 }
});