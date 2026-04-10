// src/screens/ChannelPlayerScreen.js
// 📺 مشغل قنوات احترافي + قائمة جانبية متطابقة مع التصميم + تركيز نقي + استجابة فورية

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  StyleSheet, Pressable, ActivityIndicator, StatusBar, 
  BackHandler, FlatList, Image, Text, Platform, Animated 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useTheme } from '../contexts/ThemeContext';
import { M3U_CONTENT } from '../../channels';
import { COUNTRIES_M3U } from '../../countries';
import { parseM3UWithHeaders } from '../utils/m3uParser';

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
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const flatListRef = useRef(null);
  
  // 🎬 أنيميشن القائمة
  const slideAnim = useRef(new Animated.Value(-380)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 📡 تحميل القنوات
  const allChannels = useMemo(() => {
    const ch1 = parseM3UWithHeaders(M3U_CONTENT);
    const ch2 = parseM3UWithHeaders(COUNTRIES_M3U);
    return [...ch1, ...ch2].filter(ch => ch?.streamUrl);
  }, []);

  // 🔍 فهرس القناة المشغلة حالياً
  const activeIndex = useMemo(() => 
    allChannels.findIndex(c => c.id === currentChannel?.id), 
  [allChannels, currentChannel]);

  // 🔄 مزامنة الأنيميشن
  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: showSidebar ? 0 : -380, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: showSidebar ? 1 : 0, duration: 200, useNativeDriver: true })
    ]).start();
  }, [showSidebar, slideAnim, fadeAnim]);

  // 🎯 ضبط التركيز والتمرير عند فتح القائمة
  useEffect(() => {
    if (showSidebar && flatListRef.current) {
      // 1. تعيين التركيز على القناة المشغلة
      setFocusedChannelId(currentChannel?.id);
      
      // 2. تمرير فوري للقناة المشغلة (بدون نزول عشوائي)
      if (activeIndex >= 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ 
            index: activeIndex, 
            viewPosition: 0.5, // توسيط العنصر عمودياً
            animated: false    // فوري بدون حركة
          });
        }, 80);
      }
    }
  }, [showSidebar, currentChannel, activeIndex]);

  // 🔙 زر الرجوع الفيزيائي
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showSidebar) { setShowSidebar(false); return true; }
      onBack?.();
      return true;
    });
    return () => backHandler.remove();
  }, [showSidebar, onBack]);

  // ⚡ ضمان استجابة فورية لـ X/OK/Left من أول لحظة
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      containerRef.current?.focus?.();
      containerRef.current?.requestFocus?.();
    }, 100); // تأخير قصير جداً لضمان تركيز الجذر قبل أي مكون داخلي
    return () => clearTimeout(focusTimer);
  }, [streamUrl]);

  // 🎮 معالج الأحداث (سهم يسار + X + OK + Enter)
  const handleKey = useCallback((e) => {
    const code = e.keyCode || e.nativeEvent?.keyCode;
    if (code === 21 || code === 23 || code === 99 || code === 66) {
      e.preventDefault?.();
      e.stopPropagation?.();
      setShowSidebar(prev => !prev);
      return true;
    }
    return false;
  }, []);

  const toggleSidebar = useCallback(() => setShowSidebar(prev => !prev), []);

  // 🚀 ضمان التشغيل التلقائي
  useEffect(() => {
    if (streamUrl && videoRef.current) {
      setIsLoading(true);
      setError(null);
      setIsPlaying(true);
      const timer = setTimeout(async () => {
        try { await videoRef.current.playAsync(); } catch {}
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [streamUrl]);

  const handleVideoError = useCallback((err) => {
    setError('خطأ في البث، تحقق من الاتصال');
    setIsPlaying(false); setIsLoading(false);
  }, []);

  const handleChannelSelect = useCallback((ch) => {
    if (ch?.streamUrl) {
      setStreamUrl(ch.streamUrl);
      setCurrentChannel(ch);
      setFocusedChannelId(ch.id); // تحديث التركيز على القناة الجديدة
    }
  }, []);

  if (!streamUrl) return <View style={styles.center}><ActivityIndicator size="large" color="#B861FF" /></View>;

  return (
    // 🟢 جذر التطبيق: قابل للتركيز + يستقبل أحداث اليد/الريموت فورياً
    <Pressable
      ref={containerRef}
      style={styles.container}
      onPress={toggleSidebar}
      onKeyDown={handleKey}
      onKeyUp={handleKey}
      onFocus={() => containerRef.current?.requestFocus?.()}
      focusable={true}
      tabIndex={0}
      collapsable={false}
      importantForAccessibility="yes"
      hasTVPreferredFocus={true}
    >
      <StatusBar barStyle="light-content" />

      {/* 📺 فيديو الخلفية (معزول عن التركيز) */}
      <View style={styles.videoContainer} focusable={false} accessible={false} importantForAccessibility="no-hide-descendants">
        <Video
          key={streamUrl}
          ref={videoRef}
          style={styles.video}
          source={{ uri: streamUrl }}
          useNativeControls={true}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          shouldPlay={true}
          onError={handleVideoError}
          onLoad={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
        />
        {isLoading && <View style={styles.overlay}><ActivityIndicator size="large" color="#B861FF" /></View>}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* 🌑 تعتيم الخلفية */}
      {showSidebar && <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} onPress={toggleSidebar} />}

      {/* 📂 القائمة الجانبية */}
      {showSidebar && (
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: c.primary }]}>📺 القنوات المباشرة</Text>
            <Pressable onPress={toggleSidebar} style={styles.closeBtn}>
              <Text style={{ color: '#fff', fontSize: 22 }}>✕</Text>
            </Pressable>
          </View>

          <FlatList
            ref={flatListRef}
            data={allChannels}
            keyExtractor={(item, idx) => item?.id || `ch-${idx}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialScrollIndex={activeIndex >= 0 ? activeIndex : 0}
            getItemLayout={(data, index) => ({ length: 85, offset: 85 * index, index })}
            renderItem={({ item }) => {
              const isActive = item.id === currentChannel?.id;
              const isFocused = item.id === focusedChannelId;
              
              return (
                <Pressable
                  onFocus={() => setFocusedChannelId(item.id)}
                  onBlur={() => { if (!isActive) setFocusedChannelId(null); }}
                  onPress={() => handleChannelSelect(item)}
                  style={[
                    styles.channelRow,
                    isActive && styles.channelRowActive,
                    isFocused && !isActive && styles.channelRowFocused
                  ]}
                >
                  <Image source={{ uri: item.logo || 'https://ui-avatars.com/api/?name=TV&background=333&color=fff' }} style={styles.channelImg} resizeMode="contain" />
                  <Text style={[styles.channelName, { color: isActive ? c.primary : '#fff', fontWeight: isActive ? '700' : '400' }]} numberOfLines={1}>
                    {item.name}
                  </Text>
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

import { View } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { flex: 1, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  errorText: { position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', color: '#ff6b6b', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },

  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 900 },
  sidebar: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 380,
    backgroundColor: '#0f0f1a', zIndex: 1000,
    borderRightWidth: 1, borderRightColor: 'rgba(184, 97, 255, 0.3)',
    shadowColor: '#000', shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 20,
  },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', backgroundColor: '#0f0f1a' },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  closeBtn: { padding: 8 },
  
  listContent: { padding: 10, paddingBottom: 40 },
  
  // 🎨 أنماط القنوات (إطار خارجي نقي بدون تظليل داخلي)
  channelRow: {
    flexDirection: 'row-reverse', alignItems: 'center', padding: 16, marginBottom: 8, borderRadius: 16,
    backgroundColor: 'transparent', borderWidth: 2, borderColor: 'transparent',
  },
  channelRowActive: {
    borderColor: '#B861FF', backgroundColor: 'rgba(184, 97, 255, 0.15)',
  },
  channelRowFocused: {
    borderColor: '#B861FF', backgroundColor: 'rgba(184, 97, 255, 0.05)',
  },
  
  channelImg: { width: 55, height: 55, marginLeft: 15 },
  channelName: { flex: 1, fontSize: 18, textAlign: 'right' },
  playIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#B861FF', marginRight: 10 }
});