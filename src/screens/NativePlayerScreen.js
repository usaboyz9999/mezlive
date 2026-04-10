// src/screens/NativePlayerScreen.js
// 🎬 مشغل مستقل للمسلسلات والأفلام - بدون أي ارتباط بمشغل القنوات

import React, { useRef, useState, useEffect } from 'react';
import { 
  View, StyleSheet, ActivityIndicator, StatusBar, 
  BackHandler, Alert, TouchableOpacity, Text 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function NativePlayerScreen({ episode, onBack }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const videoRef = useRef(null);

  const [streamUrl, setStreamUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 التعامل مع زر الرجوع (أندرويد)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack?.();
      return true;
    });
    return () => backHandler.remove();
  }, [onBack]);

  // 🎬 تهيئة المشغل عند استلام الحلقة
  useEffect(() => {
    if (episode?.streamUrl) {
      setStreamUrl(episode.streamUrl);
      setIsLoading(true);
      setError(null);
      setIsPlaying(true);
      console.log('🎬 [NativePlayer] تحميل الحلقة:', episode.title);
    }
  }, [episode]);

  // ❌ معالجة أخطاء التشغيل
  const handleVideoError = (err) => {
    console.error('Video playback error:', err);
    setError('حدث خطأ أثناء تشغيل الفيديو');
    setIsPlaying(false);
    setIsLoading(false);
    
    Alert.alert(
      'تعذر التشغيل',
      'لا يمكن تشغيل هذه الحلقة. جرب حلقة أخرى.',
      [{ text: 'موافق', onPress: onBack }]
    );
  };

  // 🛡️ حماية من البيانات الفارغة
  if (!episode?.streamUrl) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>مشغل الأفلام</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>❌ لا توجد بيانات للحلقة</Text>
          <TouchableOpacity style={styles.btn} onPress={onBack}>
            <Text style={styles.btnText}>العودة</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar barStyle="light-content" />
      
      {/* الهيدر البسيط */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{episode.title || 'مشغل الفيديو'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* مشغل الفيديو */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: streamUrl }}
          useNativeControls={true}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          shouldPlay={true}
          onError={handleVideoError}
          onLoad={() => {
            setIsLoading(false);
            console.log('✅ فيديو محمل:', streamUrl);
          }}
          onLoadStart={() => setIsLoading(true)}
          usePoster={true}
        />
        
        {/* ⏳ مؤشر التحميل */}
        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={c.primary} />
            <Text style={styles.overlayText}>جاري تحميل الفيديو...</Text>
          </View>
        )}
        
        {/* ❌ رسالة الخطأ */}
        {error && !isLoading && (
          <View style={styles.overlay}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity style={styles.btn} onPress={onBack}>
              <Text style={styles.btnText}>رجوع للقائمة</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.9)', borderBottomWidth: 1, borderBottomColor: '#333'
  },
  backBtn: { padding: 8 },
  title: { color: '#fff', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  
  videoContainer: { flex: 1, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)', padding: 24
  },
  overlayText: { color: '#fff', marginTop: 10, fontSize: 14 },
  
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#ff6b6b', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  
  btn: {
    paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: '#3B82F6', borderRadius: 12
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' }
});