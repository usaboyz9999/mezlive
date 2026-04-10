// src/components/ContentCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function ContentCard({ item, type = 'movie', onPress }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const r = currentTheme.radius;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<Text key={i} style={{ color: i < rating ? c.starColor : 'rgba(255,215,0,0.2)', fontSize: 12, marginRight: 2 }}>★</Text>);
    }
    return stars;
  };

  const isSeries = type === 'series';
  const borderColor = isSeries ? '#FFA502' : 'transparent';

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: c.cardBg, borderRadius: r.lg, borderColor, borderWidth: isSeries ? 2 : 0 }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.imageContainer, { borderRadius: r.lg }]}>
        {/* ✅ التغيير هنا: resizeMode="contain" لعرض الصورة كاملة */}
        <Image 
          source={{ uri: item.image || item.poster }} 
          style={styles.image} 
          resizeMode="cover" 
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{item.name || item.title}</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]} numberOfLines={1}>{item.year || item.category}</Text>
        <View style={styles.stars}>{renderStars(item.rating || 4)}</View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 150, marginRight: 14, overflow: 'hidden' },
  // ✅ زيادة الطول قليلاً لضمان ظهور الصورة الطويلة بالكامل
  imageContainer: { width: '100%', height: 220, backgroundColor: '#000' }, 
  image: { width: '100%', height: '100%' },
  info: { padding: 10 },
  title: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 11, marginBottom: 6 },
  stars: { flexDirection: 'row' }
});