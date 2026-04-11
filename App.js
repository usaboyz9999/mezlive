// App.js
// 🎬 التطبيق الرئيسي - بوابة ذكية + فرض أبعاد الشاشة 100% + إزالة فراغات المتصفح

import React, { useState, useMemo, useEffect } from 'react';
import { StatusBar, View, Alert, Platform, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';

import HomeScreen from './src/screens/HomeScreen';
import ChannelsScreen from './src/screens/ChannelsScreen';
import SeriesDetailScreen from './src/screens/SeriesDetailScreen';
import NativePlayerScreen from './src/screens/NativePlayerScreen';
import ChannelPlayerScreen from './src/screens/ChannelPlayerScreen';
import BottomNav from './src/components/BottomNav';
import MoviesScreen from './src/screens/MoviesScreen';
import SeriesScreen from './src/screens/SeriesScreen';
import MoreScreen from './src/screens/MoreScreen';

import TVNavigator from './src/tv/navigation/TVNavigator';

const isTVEnvironment = () => {
  if (Platform.isTV || Platform.isTVOS) return true;
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.search.includes('tv=true')) return true;
    const width = Dimensions.get('window').width;
    if (width >= 960) return true;
  }
  if (typeof window !== 'undefined') {
    const { width, height } = Dimensions.get('window');
    if (width / height >= 1.7) return true;
  }
  return false;
};

export default function App() {
  const isTV = useMemo(() => isTVEnvironment(), []);
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('home');
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [showEpisodePlayer, setShowEpisodePlayer] = useState(false);
  const [playingChannel, setPlayingChannel] = useState(null);
  const [showChannelPlayer, setShowChannelPlayer] = useState(false);

  // 🔥 فرض أبعاد الشاشة الكاملة + إزالة التظليل الداخلي نهائياً
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
        html, body, #root, div[style*="position: absolute"], .expo-root { 
          margin: 0 !important; 
          padding: 0 !important; 
          width: 100vw !important; 
          height: 100vh !important; 
          overflow: hidden !important; 
          background-color: #000 !important;
          display: flex !important;
          align-items: stretch !important;
        }
        *:focus, *:focus-visible, *:focus-within, *:active {
          outline: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }
  }, []);

  const openDetails = (series) => { setSelectedSeries(series); setCurrentView('details'); };
  const openEpisodePlayer = (episode) => {
    if (!episode?.streamUrl) return Alert.alert('غير متاح', 'لا يوجد رابط تشغيل', [{ text: 'موافق' }]);
    setPlayingEpisode(episode); setShowEpisodePlayer(true);
  };
  const openChannelPlayer = (channel) => {
    if (!channel?.streamUrl) return Alert.alert('غير متاح', 'لا يوجد رابط تشغيل', [{ text: 'موافق' }]);
    setPlayingChannel(channel); setShowChannelPlayer(true);
  };
  const closeEpisodePlayer = () => { setShowEpisodePlayer(false); setPlayingEpisode(null); };
  const closeChannelPlayer = () => { setShowChannelPlayer(false); setPlayingChannel(null); };
  const backToHome = () => { setCurrentView('home'); setSelectedSeries(null); };
  const handleTabChange = (tab) => { setActiveTab(tab); setCurrentView('home'); setSelectedSeries(null); };

  if (isTV) {
    return (
      <ThemeProvider>
        <StatusBar style="light" />
        <TVNavigator onPlayChannel={openChannelPlayer} onPlayEpisode={openEpisodePlayer} onOpenSeries={openDetails} onBackToHome={backToHome} />
      </ThemeProvider>
    );
  }

  if (showEpisodePlayer && playingEpisode) {
    return <ThemeProvider><StatusBar style="light" /><NativePlayerScreen episode={playingEpisode} onBack={closeEpisodePlayer} /></ThemeProvider>;
  }
  if (showChannelPlayer && playingChannel) {
    return <ThemeProvider><StatusBar style="light" /><ChannelPlayerScreen channel={playingChannel} onBack={closeChannelPlayer} /></ThemeProvider>;
  }
  if (currentView === 'details' && selectedSeries) {
    return <ThemeProvider><StatusBar style="light" /><SeriesDetailScreen series={selectedSeries} onBack={backToHome} onPlayEpisode={openEpisodePlayer} /></ThemeProvider>;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="light" />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {activeTab === 'home' && <HomeScreen onOpenSeries={openDetails} onPlayChannel={openChannelPlayer} />}
            {activeTab === 'channels' && <ChannelsScreen onPlayChannel={openChannelPlayer} />}
            {activeTab === 'movies' && <MoviesScreen onPlay={openEpisodePlayer} />}
            {activeTab === 'series' && <SeriesScreen onOpenSeries={openDetails} />}
            {activeTab === 'more' && <MoreScreen />}
          </View>
          <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'transparent' }}>
            <BottomNav activeTab={activeTab} onTabPress={handleTabChange} />
          </SafeAreaView>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}