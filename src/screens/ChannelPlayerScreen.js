// src/screens/ChannelPlayerScreen.js
// 📺 مشغل قنوات بسيط - نفس منطق المعاينة الذي يعمل 100%
// ✅ بدون هيدرز معقدة | بدون تعديلات | فيديو مباشر فقط

import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  StatusBar, 
  BackHandler,
  Alert
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useTheme } from '../contexts/ThemeContext';

export default function ChannelPlayerScreen({ channel, onBack }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  
  const [streamUrl, setStreamUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // 🔄 التعامل مع زر الرجوع (أندرويد)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack?.();
      return true;
    });
    return () => backHandler.remove();
  }, [onBack]);

  // 🎬 تهيئة المشغل عند استلام القناة - نفس منطق المعاينة
  useEffect(() => {
    if (channel?.streamUrl) {
      setStreamUrl(channel.streamUrl);
      setIsLoading(true);
      setError(null);
      setIsPlaying(true);
    }
  }, [channel]);

  // ❌ معالجة أخطاء التشغيل - نفس منطق المعاينة
  const handleVideoError = (err) => {
    console.error('Video playback error:', err);
    setError('حدث خطأ أثناء تشغيل البث، قد يكون الرابط غير مدعوم أو غير متاح');
    setIsPlaying(false);
    setIsLoading(false);
  };

  // 🛡️ حماية من البيانات الفارغة
  if (!channel?.streamUrl) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <StatusBar barStyle="light-content" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar barStyle="light-content" />
      
      {/* مشغل الفيديو - نفس الكود الذي يعمل في المعاينة */}
      {isPlaying && (
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
              console.log('✅ Video loaded:', streamUrl);
            }}
            onLoadStart={() => setIsLoading(true)}
            usePoster={true}
          />
          
          {/* ⏳ مؤشر التحميل */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={c.primary} />
            </View>
          )}
          
          {/* ❌ رسالة الخطأ */}
          {error && (
            <View style={styles.errorOverlay}>
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
                <View style={styles.errorButtons}>
                  <TouchableOpacity 
                    style={[styles.errorBtn, { backgroundColor: '#10B981' }]} 
                    onPress={() => {
                      setIsLoading(true);
                      setError(null);
                      setIsPlaying(true);
                    }}
                  >
                    <Text style={styles.errorBtnText}>🔄 إعادة المحاولة</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.errorBtn, { backgroundColor: '#374151' }]} 
                    onPress={onBack}
                  >
                    <Text style={styles.errorBtnText}>رجوع</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 24,
  },
  errorBox: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: '90%',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  errorBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  errorBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});