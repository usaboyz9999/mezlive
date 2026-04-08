// src/screens/ChannelsScreen.js
// 📺 شاشة القنوات - تمرير بسيط للقناة للمشغل

import React, { useState, useMemo, memo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, 
  ActivityIndicator, TextInput, Platform 
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import { M3U_CONTENT } from '../../channels';

// ✅ دالة تحليل M3U بسيطة (بدون هيدرز معقدة)
const parseM3USimple = (rawContent) => {
  if (!rawContent || typeof rawContent !== 'string') return [];
  
  const lines = rawContent.split('\n');
  const channels = [];
  let current = {};

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#EXTM3U') || line.startsWith('#EXTVLCOPT')) continue;

    if (line.startsWith('#EXTINF:')) {
      current = {};
      const nameMatch = line.match(/,([^,]+)$/);
      current.name = nameMatch ? nameMatch[1].trim() : 'قناة';
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      if (logoMatch) current.logo = logoMatch[1];
      const groupMatch = line.match(/group-title="([^"]+)"/i);
      if (groupMatch) current.group = groupMatch[1];
      continue;
    }

    if ((line.startsWith('http') || line.startsWith('rtsp')) && current.name) {
      current.streamUrl = line;
      current.id = `ch_${channels.length + 1}`;
      channels.push({ ...current });
      current = {};
    }
  }
  return channels;
};

// ✅ مكون صف القناة
const ChannelRow = memo(({ item, onPress, colors }) => (
  <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.7}>
    <Image source={{ uri: item.logo }} style={styles.rowImg} resizeMode="contain" />
    <View style={styles.rowTextContainer}>
      <Text style={[styles.rowName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
    </View>
  </TouchableOpacity>
));

export default function ChannelsScreen({ onPlayChannel }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ تحليل القنوات (بسيط)
  const allChannels = useMemo(() => {
    try {
      const parsed = parseM3USimple(M3U_CONTENT);
      console.log(`✅ تم تحميل ${parsed.length} قناة`);
      return parsed;
    } catch (e) {
      console.error('❌ Parse error:', e);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ فلترة البحث
  const filteredChannels = useMemo(() => {
    if (!searchQuery.trim()) return allChannels;
    const q = searchQuery.toLowerCase().trim();
    return allChannels.filter(ch => ch.name.toLowerCase().includes(q));
  }, [searchQuery, allChannels]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: c.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={[{ color: c.textSecondary, marginTop: 16 }]}>جاري تحميل القنوات...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Header title="جميع القنوات" showSearch={false} onMenuPress={() => {}} />
      
      <View style={[styles.searchContainer, { backgroundColor: c.surface }]}>
        <Text style={{ fontSize: 18, marginRight: 10 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: c.text }]}
          placeholder="ابحث عن قناة..."
          placeholderTextColor={c.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={{ fontSize: 20, color: c.textSecondary, marginLeft: 5 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredChannels}
        keyExtractor={(item) => item.id}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🔍</Text>
            <Text style={[{ color: c.text, fontSize: 16, fontWeight: '600' }]}>لا توجد نتائج</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ChannelRow 
            item={item} 
            onPress={() => onPlayChannel({
              id: item.id,
              name: item.name,
              streamUrl: item.streamUrl,
              logo: item.logo
            })} 
            colors={c} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    marginHorizontal: 16, marginTop: 12, marginBottom: 8, 
    paddingHorizontal: 14, paddingVertical: 10, 
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 4 },
  listContainer: { padding: 12, paddingBottom: 100 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, marginBottom: 4 },
  rowImg: { width: 70, height: 70, marginRight: 16 },
  rowTextContainer: { flex: 1, justifyContent: 'center' },
  rowName: { fontSize: 16, fontWeight: '600', textAlign: 'left' },
  emptyState: { alignItems: 'center', padding: 40, marginTop: 40 }
});