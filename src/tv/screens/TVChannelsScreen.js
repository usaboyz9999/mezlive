// src/tv/screens/TVChannelsScreen.js
// 📺 صفحة القنوات التلفاز - قنوات فقط + خلفية الثيم + استخدام onPlayChannel الممررة

import React, { useMemo, useCallback } from 'react';
import { 
  StyleSheet, View, FlatList, Image, Text, 
  TouchableOpacity, StatusBar, Platform 
} from 'react-native';

// ✅ مسارات مصححة 100% حسب هيكل مشروعك
import { useTheme } from '../../contexts/ThemeContext';
import { M3U_CONTENT } from '../../../channels';
import { COUNTRIES_M3U } from '../../../countries';
import { parseM3UWithHeaders } from '../../utils/m3uParser';

export default function TVChannelsScreen({ 
  onPlayChannel,  // ✅ الدالة الممررة من TVNavigator
  focusArea,
  scrollRef,
  scrollY,
  setScrollY,
}) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;

  // ✅ قنوات صافية فقط (بدون عناوين مجموعات)
  const channels = useMemo(() => {
    const ch1 = parseM3UWithHeaders(M3U_CONTENT);
    const ch2 = parseM3UWithHeaders(COUNTRIES_M3U);
    return [...ch1, ...ch2].filter(ch => ch?.streamUrl && ch?.name && !ch.isGroupHeader);
  }, []);

  // ✅ استخدام الدالة الممررة مباشرة (بدون navigation.navigate)
  const handleChannelPress = useCallback((ch) => {
    if (ch?.streamUrl && onPlayChannel) {
      onPlayChannel(ch); // ✅ هذا هو السطر الذي يفتح المشغل فعلياً
    }
  }, [onPlayChannel]);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity 
      style={[styles.channelRow, { backgroundColor: c.surface || 'rgba(255,255,255,0.03)' }]} 
      onPress={() => handleChannelPress(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.logo || 'https://ui-avatars.com/api/?name=TV&background=333&color=fff&size=100' }} 
        style={styles.channelImg} 
        resizeMode="contain" 
      />
      <Text style={[styles.channelName, { color: c.text }]} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.arrowIcon}>
        <Text style={{ color: c.textSecondary, fontSize: 16 }}>‹</Text>
      </View>
    </TouchableOpacity>
  ), [c, handleChannelPress]);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.header, { borderBottomColor: c.border || 'rgba(255,255,255,0.1)' }]}>
        <Text style={[styles.headerTitle, { color: c.primary }]}>📺 القنوات المباشرة</Text>
        <Text style={[styles.headerCount, { color: c.textSecondary }]}>{channels.length} قناة</Text>
      </View>

      <FlatList
        data={channels}
        keyExtractor={(item) => item?.id || item?.name || `ch-${item.streamUrl}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
        // ✅ دعم التمرير عبر الريموت إذا لزم
        onScroll={(e) => setScrollY?.(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', 
    padding: 18, borderBottomWidth: 1, backgroundColor: 'transparent' 
  },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerCount: { fontSize: 14, fontWeight: '500' },
  listContent: { padding: 12, paddingBottom: 50 },
  
  channelRow: {
    flexDirection: 'row-reverse', alignItems: 'center', padding: 14, marginBottom: 8,
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  channelImg: { width: 48, height: 48, marginLeft: 14 },
  channelName: { flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right' },
  arrowIcon: { padding: 4 }
});