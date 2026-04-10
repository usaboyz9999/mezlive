// src/tv/screens/TVChannelsScreen.js
// ✅ شاشة القنوات - قائمة عمودية سريعة - صورة واسم بجانب بعض

import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FocusWrapper from '../components/FocusWrapper';
import { M3U_CONTENT } from '../../../channels';
import { parseM3UWithHeaders, groupChannelsByCategory } from '../../utils/m3uParser';

export default function TVChannelsScreen({ onPlayChannel, scrollKey = 0 }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;

  const parsedChannels = useMemo(() => parseM3UWithHeaders(M3U_CONTENT), []);
  const groupedChannels = useMemo(() => groupChannelsByCategory(parsedChannels), [parsedChannels]);

  const handlePlayChannel = useCallback((ch) => onPlayChannel?.(ch), [onPlayChannel]);

  const renderChannel = useCallback(({ item }) => (
    <FocusWrapper onPress={() => handlePlayChannel(item)} style={styles.channelRow}>
      <View style={styles.rowInner}>
        <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{item.name}</Text>
      </View>
    </FocusWrapper>
  ), [handlePlayChannel, c.text]);

  const renderSection = useCallback(({ item: group }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: c.primary }]}>{group.name}</Text>
      <FlatList
        data={group.channels}
        keyExtractor={(ch, idx) => `${ch.id || idx}`}
        renderItem={renderChannel}
        removeClippedSubviews={true}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={3}
      />
    </View>
  ), [c.primary, renderChannel]);

  if (parsedChannels.length === 0) {
    return <View style={[styles.center, { backgroundColor: c.background }]}><Text style={{color:c.primary, fontSize:40}}>📡</Text></View>;
  }

  return (
    <FlatList
      key={scrollKey}
      data={groupedChannels}
      renderItem={renderSection}
      keyExtractor={g => g.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: { padding: 16, paddingBottom: 30, flexGrow: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12, paddingLeft: 4, borderLeftWidth: 3, borderLeftColor: '#B861FF' },
  channelRow: { borderRadius: 16, overflow: 'hidden', marginBottom: 6 },
  rowInner: { flexDirection: 'row-reverse', alignItems: 'center', padding: 14, backgroundColor: 'transparent' },
  logo: { width: 50, height: 50, marginRight: 12 },
  name: { flex: 1, fontSize: 17, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});