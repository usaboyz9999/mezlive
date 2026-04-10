// src/tv/components/TVContentCard.js
// ✅ بطاقة محتوى - حاوية داخلية شفافة

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FocusWrapper from './FocusWrapper';

export default function TVContentCard({ item, type = 'movie', onPress, style }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) stars.push(<Text key={i} style={{ color: i < (rating||4) ? '#FFD700' : 'rgba(255,215,0,0.2)', fontSize: 12, marginRight: 2 }}>★</Text>);
    return stars;
  };

  const isSeries = type === 'series';

  return (
    <FocusWrapper onPress={onPress} style={[styles.cardWrapper, style]}>
      <View style={styles.cardInner}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image || item.poster }} style={styles.image} resizeMode="cover" />
          {isSeries && <View style={styles.seriesBadge}><Text style={styles.seriesBadgeText}>مسلسل</Text></View>}
        </View>
        <View style={styles.info}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{item.name || item.title}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]} numberOfLines={1}>{item.year || item.category}</Text>
          <View style={styles.stars}>{renderStars(item.rating || 4)}</View>
        </View>
      </View>
    </FocusWrapper>
  );
}

const styles = StyleSheet.create({
  cardWrapper: { borderRadius: 16, overflow: 'hidden', width: 150 },
  cardInner: { backgroundColor: 'transparent', borderWidth: 0 },
  imageContainer: { width: '100%', height: 220, backgroundColor: '#111', position: 'relative', borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  seriesBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#FFA502', borderRadius: 8 },
  seriesBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  info: { padding: 8, paddingTop: 6 },
  title: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  subtitle: { fontSize: 11, marginBottom: 4 },
  stars: { flexDirection: 'row' },
});