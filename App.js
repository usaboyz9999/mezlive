// App.js
// 🎬 التطبيق الرئيسي - مشغلات منفصلة: قنوات ↔ مسلسلات/أفلام

import React, { useState } from 'react';
import { StatusBar, View, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';

// 📺 استيراد الشاشات
import HomeScreen from './src/screens/HomeScreen';
import ChannelsScreen from './src/screens/ChannelsScreen';
import SeriesDetailScreen from './src/screens/SeriesDetailScreen';
import NativePlayerScreen from './src/screens/NativePlayerScreen'; // للمسلسلات/الأفلام
import ChannelPlayerScreen from './src/screens/ChannelPlayerScreen'; // للقنوات فقط
import BottomNav from './src/components/BottomNav';
import MoviesScreen from './src/screens/MoviesScreen';
import SeriesScreen from './src/screens/SeriesScreen';
import MoreScreen from './src/screens/MoreScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('home');
  const [selectedSeries, setSelectedSeries] = useState(null);
  
  // 🎬 حالة المشغل للمسلسلات/الأفلام
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [showEpisodePlayer, setShowEpisodePlayer] = useState(false);
  
  // 📺 حالة المشغل للقنوات
  const [playingChannel, setPlayingChannel] = useState(null);
  const [showChannelPlayer, setShowChannelPlayer] = useState(false);

  // فتح تفاصيل المسلسل
  const openDetails = (series) => {
    setSelectedSeries(series);
    setCurrentView('details');
  };

  // 🎬 فتح مشغل الحلقة (للمسلسلات/الأفلام فقط)
  const openEpisodePlayer = (episode) => {
    console.log('🎬 [App] فتح حلقة:', episode?.title);
    
    if (!episode?.streamUrl) {
      Alert.alert('غير متاح', 'لا يوجد رابط تشغيل لهذه الحلقة', [{ text: 'موافق' }]);
      return;
    }
    
    setPlayingEpisode(episode);
    setShowEpisodePlayer(true);
  };

  // 📺 فتح مشغل القناة (للقنوات فقط)
  const openChannelPlayer = (channel) => {
    console.log('📺 [App] فتح قناة:', channel?.name);
    
    if (!channel?.streamUrl) {
      Alert.alert('غير متاح', 'لا يوجد رابط تشغيل لهذه القناة', [{ text: 'موافق' }]);
      return;
    }
    
    setPlayingChannel(channel);
    setShowChannelPlayer(true);
  };

  // العودة من مشغل الحلقة
  const closeEpisodePlayer = () => {
    setShowEpisodePlayer(false);
    setPlayingEpisode(null);
  };

  // العودة من مشغل القناة
  const closeChannelPlayer = () => {
    setShowChannelPlayer(false);
    setPlayingChannel(null);
  };

  // العودة للرئيسية
  const backToHome = () => {
    setCurrentView('home');
    setSelectedSeries(null);
  };

  // تغيير التبويبات
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentView('home');
    setSelectedSeries(null);
    // لا نغلق المشغلات هنا ليكمل المستخدم المشاهدة
  };

  // 🎬 عرض مشغل الحلقة (مسلسلات/أفلام) - مستقل تماماً
  if (showEpisodePlayer && playingEpisode) {
    return (
      <ThemeProvider>
        <StatusBar style="light" />
        <NativePlayerScreen 
          episode={playingEpisode} 
          onBack={closeEpisodePlayer} 
        />
      </ThemeProvider>
    );
  }

  // 📺 عرض مشغل القناة - مستقل تماماً
  if (showChannelPlayer && playingChannel) {
    return (
      <ThemeProvider>
        <StatusBar style="light" />
        <ChannelPlayerScreen 
          channel={playingChannel} 
          onBack={closeChannelPlayer} 
        />
      </ThemeProvider>
    );
  }

  // 📖 عرض تفاصيل المسلسل
  if (currentView === 'details' && selectedSeries) {
    return (
      <ThemeProvider>
        <StatusBar style="light" />
        <SeriesDetailScreen 
          series={selectedSeries} 
          onBack={backToHome} 
          onPlayEpisode={openEpisodePlayer} // ← يمرر لمشغل الحلقات فقط
        />
      </ThemeProvider>
    );
  }

  // 📱 التطبيق الرئيسي (التبويبات)
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="light" />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {activeTab === 'home' && (
              <HomeScreen 
                onOpenSeries={openDetails} 
                onPlayChannel={openChannelPlayer} // ← للقنوات فقط
              />
            )}
            {activeTab === 'channels' && (
              <ChannelsScreen 
                onPlayChannel={openChannelPlayer} // ← للقنوات فقط
              />
            )}
            {activeTab === 'movies' && (
              <MoviesScreen 
                onPlay={openEpisodePlayer} // ← للأفلام فقط
              />
            )}
            {activeTab === 'series' && (
              <SeriesScreen 
                onOpenSeries={openDetails} 
              />
            )}
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