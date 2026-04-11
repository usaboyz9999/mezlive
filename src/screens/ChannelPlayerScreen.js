// src/screens/ChannelPlayerScreen.js
// 📺 مشغل قنوات احترافي + شريط معلومات يظهر تلقائياً عند أول تشغيل

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  StyleSheet, Pressable, ActivityIndicator, StatusBar, 
  BackHandler, FlatList, Image, Text, Animated, View, Platform 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useTheme } from '../contexts/ThemeContext';
import { M3U_CONTENT } from '../../channels';
import { COUNTRIES_M3U } from '../../countries';
import { parseM3UWithHeaders } from '../utils/m3uParser';

const ITEM_HEIGHT = 95; 

export default function ChannelPlayerScreen({ channel, onBack }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  
  const [streamUrl, setStreamUrl] = useState(channel?.streamUrl || '');
  const [currentChannel, setCurrentChannel] = useState(channel);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [focusedChannelId, setFocusedChannelId] = useState(null);
  
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [nextProgram, setNextProgram] = useState('');
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const flatListRef = useRef(null);
  const initialInfoShownRef = useRef(false); // 🔑 لمنع التكرار عند إعادة التشغيل
  
  const allChannelsRef = useRef([]);
  const currentChannelRef = useRef(currentChannel);
  
  useEffect(() => { allChannelsRef.current = allChannels; }, [allChannels]);
  useEffect(() => { currentChannelRef.current = currentChannel; }, [currentChannel]);

  const slideAnim = useRef(new Animated.Value(-380)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const infoSlideAnim = useRef(new Animated.Value(80)).current;

  const allChannels = useMemo(() => {
    const ch1 = parseM3UWithHeaders(M3U_CONTENT);
    const ch2 = parseM3UWithHeaders(COUNTRIES_M3U);
    return [...ch1, ...ch2].filter(ch => ch?.streamUrl);
  }, []);

  const activeIndex = useMemo(() => 
    allChannels.findIndex(c => c.id === currentChannel?.id), 
  [allChannels, currentChannel]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: showSidebar ? 0 : -380, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: showSidebar ? 1 : 0, duration: 200, useNativeDriver: true })
    ]).start();
  }, [showSidebar, slideAnim, fadeAnim]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showSidebar) { setShowSidebar(false); return true; }
      onBack?.();
      return true;
    });
    return () => backHandler.remove();
  }, [showSidebar, onBack]);

  useEffect(() => {
    if (showSidebar && flatListRef.current) {
      const timer = setTimeout(() => {
        flatListRef.current.focus?.();
        try {
          flatListRef.current.scrollToIndex({ index: activeIndex >= 0 ? activeIndex : 0, viewPosition: 0.5, animated: false });
          setFocusedChannelId(currentChannel?.id);
        } catch {}
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [showSidebar, activeIndex, currentChannel?.id]);

  useEffect(() => {
    const timer = setTimeout(() => containerRef.current?.requestFocus?.(), 300);
    return () => clearTimeout(timer);
  }, [streamUrl]);

  // ✅ إظهار شريط المعلومات عند تشغيل القناة لأول مرة
  useEffect(() => {
    if (currentChannel?.streamUrl && !initialInfoShownRef.current) {
      initialInfoShownRef.current = true;
      const timer = setTimeout(() => {
        showInfoBar(currentChannel);
      }, 1200); // يظهر بعد 1.2 ثانية لضمان اكتمال تهيئة الفيديو
      return () => clearTimeout(timer);
    }
  }, [currentChannel?.streamUrl, showInfoBar]);

  const showInfoBar = useCallback((ch) => {
    const programs = ['برنامج أخبار', 'مسلسل درامي', 'فيلم أكشن', 'عرض ترفيهي', 'وثائقي'];
    setNextProgram(programs[Math.floor(Math.random() * programs.length)]);
    setShowChannelInfo(true);
    Animated.timing(infoSlideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(infoSlideAnim, { toValue: 80, duration: 150, useNativeDriver: true })
        .start(() => setShowChannelInfo(false));
    }, 4000);
  }, [infoSlideAnim]);

  const changeChannel = useCallback((direction) => {
    const channels = allChannelsRef.current;
    const current = currentChannelRef.current;
    if (!channels.length || !current?.id) return;
    
    const idx = channels.findIndex(ch => ch.id === current.id);
    if (idx === -1) return;
    
    const nextIdx = direction === 'up'
      ? (idx === 0 ? channels.length - 1 : idx - 1)
      : (idx === channels.length - 1 ? 0 : idx + 1);
    
    const next = channels[nextIdx];
    if (next?.streamUrl) {
      setStreamUrl(next.streamUrl);
      setCurrentChannel(next);
      setFocusedChannelId(next.id);
      showInfoBar(next);
    }
  }, [showInfoBar]);

  const handleAppLevelKey = useCallback((e) => {
    if (showSidebar) return false;
    const code = e.keyCode || e.nativeEvent?.keyCode;
    const key = e.key || e.nativeEvent?.key;
    e.preventDefault?.();
    e.stopPropagation?.();

    if (code === 20 || code === 40 || key === 'ArrowDown') { setShowSidebar(true); return true; }
    if (code === 19 || code === 38 || key === 'ArrowUp') { changeChannel('up'); return true; }
    if (code === 21 || code === 23 || code === 99 || code === 66 || key === 'ArrowLeft' || key === 'Enter') { setShowSidebar(prev => !prev); return true; }
    return false;
  }, [showSidebar, changeChannel]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handleWebKey = (e) => { if (handleAppLevelKey(e)) { e.preventDefault(); e.stopImmediatePropagation(); } };
    window.addEventListener('keydown', handleWebKey, true);
    return () => window.removeEventListener('keydown', handleWebKey, true);
  }, [handleAppLevelKey]);

  const toggleSidebar = useCallback(() => setShowSidebar(prev => !prev), []);

  useEffect(() => {
    if (streamUrl && videoRef.current) {
      setIsLoading(true); setError(null); setIsPlaying(true);
      const t = setTimeout(async () => { try { await videoRef.current.playAsync(); } catch {} }, 200);
      return () => clearTimeout(t);
    }
  }, [streamUrl]);

  const handleVideoError = useCallback((err) => {
    setError('خطأ في البث'); setIsPlaying(false); setIsLoading(false);
  }, []);

  const handleChannelSelect = useCallback((ch) => {
    if (ch?.streamUrl) {
      setStreamUrl(ch.streamUrl);
      setCurrentChannel(ch);
      setFocusedChannelId(ch.id);
      showInfoBar(ch);
    }
  }, [showInfoBar]);

  if (!streamUrl) return <View style={styles.center}><ActivityIndicator size="large" color="#B861FF" /></View>;

  return (
    <Pressable
      ref={containerRef}
      style={styles.container}
      onPress={toggleSidebar}
      onKeyDown={handleAppLevelKey}
      onKeyUp={handleAppLevelKey}
      onKeyPress={handleAppLevelKey}
      hasTVPreferredFocus={true}
      focusable={true}
      tabIndex={0}
      collapsable={false}
      importantForAccessibility="yes"
      accessible={true}
      onFocus={() => containerRef.current?.requestFocus?.()}
      onTouchStart={() => containerRef.current?.requestFocus?.()}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.videoContainer} focusable={false} accessible={false} importantForAccessibility="no-hide-descendants" pointerEvents="box-none">
        <Video key={streamUrl} ref={videoRef} style={styles.video} source={{ uri: streamUrl }} useNativeControls={true} resizeMode={ResizeMode.CONTAIN} isLooping={false} shouldPlay={true} onError={handleVideoError} onLoad={() => setIsLoading(false)} onLoadStart={() => setIsLoading(true)} />
        {isLoading && <View style={styles.overlay}><ActivityIndicator size="large" color="#B861FF" /></View>}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {showSidebar && <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} onPress={toggleSidebar} />}

      {/* 📊 شريط معلومات القناة (مصحح بدقة: صورة على اليمين ملاصقة للاسم والجدول) */}
      {showChannelInfo && (
        <Animated.View style={[styles.infoBar, { transform: [{ translateY: infoSlideAnim }] }]}>
          <View style={styles.infoBarLayout}>
            <View style={styles.infoBarText}>
              <Text style={styles.infoBarChannelName} numberOfLines={1}>{currentChannel?.name || 'قناة غير معروفة'}</Text>
              <Text style={styles.infoBarSchedule}>📅 التالي: {nextProgram}</Text>
            </View>
            <Image 
              source={{ uri: currentChannel?.logo || 'https://ui-avatars.com/api/?name=TV&background=B861FF&color=fff&size=100' }} 
              style={styles.infoBarLogo} 
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>
        </Animated.View>
      )}

      {showSidebar && (
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: c.primary }]}>📺 القنوات المباشرة</Text>
            <Pressable onPress={toggleSidebar} style={styles.closeBtn}><Text style={{ color: '#fff', fontSize: 22 }}>✕</Text></Pressable>
          </View>

          <FlatList
            ref={flatListRef}
            data={allChannels}
            keyExtractor={(item) => item?.id || item?.name || `ch-${item.streamUrl}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialNumToRender={15}
            windowSize={3}
            removeClippedSubviews={Platform.OS === 'android'}
            getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index + 10, index })}
            onScrollToIndexFailed={() => {}}
            renderItem={({ item }) => {
              const isActive = item.id === currentChannel?.id;
              const isFocused = item.id === focusedChannelId;
              return (
                <Pressable
                  onFocus={() => setFocusedChannelId(item.id)}
                  onPress={() => handleChannelSelect(item)}
                  style={[styles.channelRow, isActive && styles.channelRowActive, isFocused && !isActive && styles.channelRowFocused]}
                  accessible={true}
                  accessibleRole="button"
                  hasTVPreferredFocus={isFocused}
                >
                  <Image source={{ uri: item.logo || 'https://ui-avatars.com/api/?name=TV&background=333&color=fff' }} style={styles.channelImg} resizeMode="contain" />
                  <Text style={[styles.channelName, { color: isActive ? c.primary : '#fff', fontWeight: isActive ? '700' : '400' }]} numberOfLines={1}>{item.name}</Text>
                  {isActive && <View style={styles.playIndicator} />}
                </Pressable>
              );
            }}
          />
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { flex: 1, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  errorText: { position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', color: '#ff6b6b', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 900 },
  sidebar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 380, backgroundColor: '#0f0f1a', zIndex: 1000, borderRightWidth: 1, borderRightColor: 'rgba(184, 97, 255, 0.3)', shadowColor: '#000', shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 20 },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', backgroundColor: '#0f0f1a' },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  closeBtn: { padding: 8 },
  listContent: { padding: 10, paddingBottom: 40 },
  
  channelRow: { flexDirection: 'row-reverse', alignItems: 'center', padding: 16, marginBottom: 8, borderRadius: 16, backgroundColor: 'transparent', borderWidth: 2, borderColor: 'transparent' },
  channelRowActive: { borderColor: '#B861FF', backgroundColor: 'rgba(184, 97, 255, 0.15)' },
  channelRowFocused: { borderColor: '#B861FF', backgroundColor: 'rgba(184, 97, 255, 0.05)' },
  channelImg: { width: 55, height: 55, marginLeft: 15 },
  channelName: { flex: 1, fontSize: 18, textAlign: 'right' },
  playIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#B861FF', marginRight: 10 },

  // 📊 شريط معلومات ممدود + تخطيط دقيق للصورة على اليمين
  infoBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(15, 15, 26, 0.98)', paddingVertical: 14, paddingHorizontal: 20, zIndex: 800, borderTopWidth: 1, borderTopColor: 'rgba(184, 97, 255, 0.4)', paddingBottom: Platform.OS === 'android' ? 40 : 14 },
  infoBarLayout: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 10, width: '100%' },
  infoBarText: { flex: 1, alignItems: 'flex-end', marginRight: 10 },
  infoBarLogo: { width: 46, height: 46, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', flexShrink: 0 },
  infoBarChannelName: { color: '#fff', fontSize: 17, fontWeight: '800', textAlign: 'right' },
  infoBarSchedule: { color: '#B861FF', fontSize: 14, textAlign: 'right', marginTop: 3, fontWeight: '500' }
});