// src/tv/navigation/TVNavigator.js
// ✅ إدارة المسلسلات + تشغيل موحد + تنقل TV محسّن

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

import SidebarRail from '../components/SidebarRail';
import TVHeader from '../components/TVHeader';
import TVHomeScreen from '../screens/TVHomeScreen';
import TVChannelsScreen from '../screens/TVChannelsScreen';
import TVSeriesScreen from '../screens/TVSeriesScreen';
import TVSeriesDetailScreen from '../screens/TVSeriesDetailScreen'; // ✅ مستورد
import TVMoviesScreen from '../screens/TVMoviesScreen';
import TVMoreScreen from '../screens/TVMoreScreen';

import ChannelPlayerScreen from '../../screens/ChannelPlayerScreen';
import NativePlayerScreen from '../../screens/NativePlayerScreen';

import { useRemoteNavigation } from '../hooks/useRemoteNavigation';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function TVNavigator({ onPlayChannel: extPlayChannel, onPlayEpisode, onOpenSeries: extOpenSeries }) {
  const [activeTab, setActiveTab] = useState('home');
  const [focusArea, setFocusArea] = useState('sidebar');
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(null);
  
  const [showChannelPlayer, setShowChannelPlayer] = useState(false);
  const [showEpisodePlayer, setShowEpisodePlayer] = useState(false);
  const [playingChannel, setPlayingChannel] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [scrollKey, setScrollKey] = useState(0);
  
  // ✅ حالة المسلسل المعروض
  const [viewingSeries, setViewingSeries] = useState(null);

  const handlePlayChannel = useCallback((ch) => {
    if (ch?.streamUrl) {
      extPlayChannel?.(ch);
      setPlayingChannel(ch); setShowChannelPlayer(true);
    }
  }, [extPlayChannel]);

  const handlePlayEpisode = useCallback((ep) => {
    if (ep?.streamUrl) {
      onPlayEpisode?.(ep);
      setPlayingEpisode(ep); setShowEpisodePlayer(true);
    }
  }, [onPlayEpisode]);

  const handleOpenSeries = useCallback((series) => {
    setViewingSeries(series);
  }, []);

  const handleBackSeries = useCallback(() => {
    setViewingSeries(null);
  }, []);

  const handleTabPress = useCallback((tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab); setViewingSeries(null); setScrollKey(k => k + 1);
    }
  }, [activeTab]);

  const { triggerNavigation } = useRemoteNavigation({
    enabled: !showChannelPlayer && !showEpisodePlayer && !viewingSeries,
    debounce: 100,
    onNavigate: (dir) => {
      if (dir === 'left' && focusArea === 'content') { setFocusArea('sidebar'); setTimeout(() => document.querySelector('[data-area="sidebar"]')?.focus(), 50); }
      else if (dir === 'right' && focusArea === 'sidebar') { setFocusArea('content'); setTimeout(() => document.querySelector('[data-area="content"]')?.focus(), 50); }
      else if (dir === 'down') { const y = scrollY + 200; scrollRef.current?.scrollTo({ y, animated: true }); setScrollY(y); }
      else if (dir === 'up') { const y = Math.max(0, scrollY - 200); scrollRef.current?.scrollTo({ y, animated: true }); setScrollY(y); }
    },
    onSelect: () => {},
    onBack: () => {
      if (viewingSeries) { handleBackSeries(); return; }
      if (showChannelPlayer || showEpisodePlayer) {
        setShowChannelPlayer(false); setShowEpisodePlayer(false); setPlayingChannel(null); setPlayingEpisode(null);
      } else if (focusArea === 'content') { setFocusArea('sidebar'); setTimeout(() => document.querySelector('[data-area="sidebar"]')?.focus(), 50); }
      else if (activeTab !== 'home') { setActiveTab('home'); setScrollKey(k => k + 1); }
    },
  });

  const renderContent = useMemo(() => {
    if (viewingSeries) {
      return (
        <TVSeriesDetailScreen
          series={viewingSeries}
          onPlayEpisode={handlePlayEpisode}
          onBack={handleBackSeries}
          focusArea={focusArea}
          scrollRef={scrollRef}
        />
      );
    }
    
    const props = { onPlayChannel: handlePlayChannel, onPlayEpisode: handlePlayEpisode, onOpenSeries: handleOpenSeries, scrollKey, focusArea, scrollRef, scrollY, setScrollY };
    switch (activeTab) {
      case 'home': return <TVHomeScreen {...props} />;
      case 'channels': return <TVChannelsScreen {...props} />;
      case 'movies': return <TVMoviesScreen {...props} />;
      case 'series': return <TVSeriesScreen {...props} />;
      case 'more': return <TVMoreScreen {...props} />;
      default: return <TVHomeScreen {...props} />;
    }
  }, [activeTab, scrollKey, focusArea, viewingSeries, handlePlayChannel, handlePlayEpisode, handleOpenSeries, handleBackSeries]);

  if (showChannelPlayer && playingChannel) return <ChannelPlayerScreen channel={playingChannel} onBack={() => { setShowChannelPlayer(false); setPlayingChannel(null); }} />;
  if (showEpisodePlayer && playingEpisode) return <NativePlayerScreen episode={playingEpisode} onBack={() => { setShowEpisodePlayer(false); setPlayingEpisode(null); }} />;

  return (
    <View style={styles.root}>
      <View data-area="sidebar" style={styles.sidebarBox}>
        <SidebarRail activeTab={activeTab} onTabPress={handleTabPress} onFocusArea={() => setFocusArea('sidebar')} />
      </View>
      <View data-area="content" style={styles.contentBox}>
        <TVHeader 
          title={activeTab === 'home' ? 'الرئيسية' : activeTab === 'channels' ? 'القنوات' : activeTab === 'movies' ? 'الأفلام' : activeTab === 'series' ? 'المسلسلات' : 'المزيد'} 
          showBack={activeTab !== 'home' || viewingSeries !== null} 
          onBackPress={() => { if (viewingSeries) handleBackSeries(); else { setActiveTab('home'); setScrollKey(k => k + 1); } }} 
        />
        <View style={styles.screenContainer} key={scrollKey}>{renderContent}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: SCREEN_W, height: SCREEN_H, flexDirection: 'row-reverse', backgroundColor: '#000', overflow: 'hidden' },
  sidebarBox: { width: 280, height: SCREEN_H, overflow: 'hidden' },
  contentBox: { flex: 1, height: SCREEN_H, flexDirection: 'column' },
  screenContainer: { flex: 1, overflow: 'hidden' }
});