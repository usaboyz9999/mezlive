import React, { useState, useMemo, memo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

// ✅ مكون صف القناة
const ChannelRow = memo(({ item, onPress, colors }) => (
  <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.7}>
    <Image source={{ uri: item.logo }} style={styles.rowImg} resizeMode="contain" />
    <View style={styles.rowTextContainer}>
      <Text style={[styles.rowName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
    </View>
  </TouchableOpacity>
));

export default function GroupChannelsScreen({ group, onBack, onPlayChannel }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Header title={group.name} showSearch={false} onMenuPress={onBack} />
      
      <View style={[{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'rgba(184,97,255,0.1)' }]}>
        <Text style={[{ color: c.textSecondary, fontSize: 14 }]}>
          {group.channels.length} قناة في قائمة {group.name}
        </Text>
      </View>

      <FlatList
        data={group.channels}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ChannelRow item={item} onPress={onPlayChannel} colors={c} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { padding: 12, paddingBottom: 100 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, marginBottom: 4 },
  rowImg: { width: 70, height: 70, marginRight: 16 },
  rowTextContainer: { flex: 1, justifyContent: 'center' },
  rowName: { fontSize: 16, fontWeight: '600', textAlign: 'left' }
});