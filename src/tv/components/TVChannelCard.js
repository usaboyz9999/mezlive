// src/tv/components/TVChannelCard.js
// ✅ بطاقة قناة - حاوية داخلية شفافة

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FocusWrapper from './FocusWrapper';

export default function TVChannelCard({ item, onPress, style }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;

  return (
    <FocusWrapper onPress={onPress} style={[styles.cardWrapper, style]}>
      <View style={styles.cardInner}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.logo || item.image }} style={styles.image} resizeMode="contain" />
          {item.isLive && <View style={styles.liveBadge}><Text style={styles.liveText}>LIVE</Text></View>}
        </View>
        <Text style={[styles.channelName, { color: c.text }]} numberOfLines={1}>{item.name}</Text>
      </View>
    </FocusWrapper>
  );
}

const styles = StyleSheet.create({
  cardWrapper: { borderRadius: 16, overflow: 'hidden', width: 110 },
  cardInner: { backgroundColor: 'transparent', borderWidth: 0, alignItems: 'center' },
  imageContainer: { width: '100%', height: 70, overflow: 'hidden', position: 'relative', backgroundColor: 'transparent', borderRadius: 16 },
  image: { width: '100%', height: '100%' },
  liveBadge: { position: 'absolute', top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#FF4444', borderRadius: 8 },
  liveText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  channelName: { marginTop: 6, fontWeight: '600', fontSize: 13, textAlign: 'center' },
});