import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function ChannelCard({ item, onPress }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const r = currentTheme.radius;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={{ color: i < rating ? c.starColor : 'rgba(255,215,0,0.2)', fontSize: 10 }}>★</Text>
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.imageContainer, { borderRadius: r.lg }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {item.isLive && (
          <View style={[styles.liveBadge, { backgroundColor: c.liveBadge, borderRadius: r.sm }]}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        <View style={[styles.ratingContainer, { backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: r.sm }]}>
          {renderStars(item.rating || 4)}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 110, marginRight: 12 },
  imageContainer: { width: '100%', height: 70, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%' },
  liveBadge: { position: 'absolute', top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 2 },
  liveText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  ratingContainer: { position: 'absolute', bottom: 6, left: 6, flexDirection: 'row', paddingHorizontal: 4, paddingVertical: 2 }
});