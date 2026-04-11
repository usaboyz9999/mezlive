import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DURATION_MS = 3 * 60 * 60 * 1000; // 3 ساعات

export default function DynamicLinkResolver({ episodeUrl, onResolved, onError, userAgent, forceRefresh = false }) {
  const [resolved, setResolved] = useState(false);

  const resolveLink = useCallback(async () => {
    const cacheKey = `link_${episodeUrl}`;
    
    if (!forceRefresh) {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const { url, expires } = JSON.parse(cached);
          if (Date.now() < expires) {
            console.log('⚡ استخدام الرابط من الكاش');
            onResolved(url);
            setResolved(true);
            return;
          } else {
            await AsyncStorage.removeItem(cacheKey); // مسح كاش منتهي
          }
        }
      } catch (e) {}
    } else {
      await AsyncStorage.removeItem(cacheKey); // مسح إجباري
    }
  }, [episodeUrl, onResolved, forceRefresh]);

  useEffect(() => { resolveLink(); }, []);
  if (resolved) return null;

  return (
    <View style={styles.hiddenContainer}>
      <WebView
        source={{ uri: episodeUrl }}
        userAgent={userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        mixedContentMode="always"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        cacheMode="LOAD_NO_CACHE" // ✅ يمنع كاش WebView الداخلي
        
        onShouldStartLoadWithRequest={(request) => {
          if (request.url.includes('.m3u8') || request.url.includes('.ts') || request.url.includes('manifest')) {
            handleFoundUrl(request.url);
            return false;
          }
          return true;
        }}
        
        injectedJavaScript={`
          (function() {
            let foundUrl = null;
            const checkInterval = setInterval(() => {
              // 1. عنصر الفيديو المباشر
              const video = document.querySelector('video');
              if (video?.src?.includes('.m3u8')) foundUrl = video.src;
              else if (video?.currentSrc?.includes('.m3u8')) foundUrl = video.currentSrc;

              // 2. مشغلات شائعة (Video.js, Plyr, HLS.js)
              if (!foundUrl) {
                if (window.player?.src && typeof window.player.src === 'function') {
                  const s = window.player.src();
                  if (s?.includes('.m3u8')) foundUrl = s;
                }
                if (window.videojs?.players) {
                  const p = Object.values(window.videojs.players)[0];
                  if (p?.src?.()?.includes('.m3u8')) foundUrl = p.src();
                }
              }

              // 3. بيانات Viu المحددة (Nuxt/Next/Data Layer)
              if (!foundUrl) {
                try {
                  if (window.__NUXT__?.data?.[0]?.video?.src) foundUrl = window.__NUXT__.data[0].video.src;
                  else if (window.__NEXT_DATA__?.props?.pageProps?.vod?.playUrl) foundUrl = window.__NEXT_DATA__.props.pageProps.vod.playUrl;
                  else if (window.vodData?.streamUrl) foundUrl = window.vodData.streamUrl;
                } catch(e) {}
              }

              if (foundUrl) {
                clearInterval(checkInterval);
                clearTimeout(window._resolverTimeout);
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dom_url', url: foundUrl }));
              }
            }, 600);

            window._resolverTimeout = setTimeout(() => {
              clearInterval(checkInterval);
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'timeout' }));
            }, 18000); // 18 ثانية
          })();
          true;
        `}
        
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'dom_url') handleFoundUrl(data.url);
            if (data.type === 'timeout') onError('انتهت المهلة. الصفحة قد تكون محمية أو بطيئة.');
          } catch (e) {}
        }}
        onError={() => onError('فشل تحميل الصفحة. تحقق من الاتصال أو صحة الرابط.')}
        style={{ flex: 1 }}
      />
    </View>
  );

  function handleFoundUrl(url) {
    if (resolved) return;
    setResolved(true);
    console.log('✅ تم استخراج الرابط:', url.slice(0, 60));
    
    AsyncStorage.setItem(`link_${episodeUrl}`, JSON.stringify({
      url,
      expires: Date.now() + CACHE_DURATION_MS
    })).catch(() => {});
    
    onResolved(url);
  }
}

const styles = StyleSheet.create({
  hiddenContainer: { width: 1, height: 1, opacity: 0, position: 'absolute', top: -9999 }
});