// src/tv/navigation/TVNavigator.js
// ✅ تخطيط صارم يملأ الشاشة بالكامل + قائمة جانبية ممدودة 100% + إدارة تركيز مركزية

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

import SidebarRail from '../components/SidebarRail';
import TVHeader from '../components/TVHeader';
import TVHomeScreen from '../screens/TVHomeScreen';
import TVChannelsScreen from '../screens/TVChannelsScreen';
import TVSeriesScreen from '../screens/TVSeriesScreen';
import TVMoviesScreen from '../screens/TVMoviesScreen';
import TVMoreScreen from '../screens/TVMoreScreen';

import ChannelPlayerScreen from '../../screens/ChannelPlayerScreen';
import NativePlayerScreen from '../../screens/NativePlayerScreen';

import { useRemoteNavigation } from '../hooks/useRemoteNavigation';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function TVNavigator({ onPlayChannel, onPlayEpisode, onOpenSeries }) {
  const [activeTab, setActiveTab] = useState('home');
  const [focusArea, setFocusArea] = useState('sidebar');
  const [lastSection, setLastSection] = useState('quickCard');
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(null);
  
  const [showChannelPlayer, setShowChannelPlayer] = useState(false);
  const [showEpisodePlayer, setShowEpisodePlayer] = useState(false);
  const [playingChannel, setPlayingChannel] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [scrollKey, setScrollKey] = useState(0);

  const handlePlayChannel = useCallback((ch) => { if (ch?.streamUrl) { setPlayingChannel(ch); setShowChannelPlayer(true); } }, []);
  const handlePlayEpisode = useCallback((ep) => { if (ep?.streamUrl) { setPlayingEpisode(ep); setShowEpisodePlayer(true); } }, []);
  const handleTabPress = useCallback((tab) => { if (tab !== activeTab) { setActiveTab(tab); setScrollKey(k => k + 1); } }, [activeTab]);

  const { triggerNavigation } = useRemoteNavigation({
    enabled: !showChannelPlayer && !showEpisodePlayer,
    debounce: 100,
    onNavigate: (dir) => {
      if (dir === 'left' && focusArea === 'content') {
        setFocusArea('sidebar');
        setTimeout(() => document.querySelector('[data-area="sidebar"]')?.focus(), 50);
      } else if (dir === 'right' && focusArea === 'sidebar') {
        setFocusArea('content');
        setTimeout(() => document.querySelector('[data-area="content"]')?.focus(), 50);
      } else if (dir === 'down') {
        const newY = scrollY + 200;
        scrollRef.current?.scrollTo({ y: newY, animated: true });
        setScrollY(newY);
      } else if (dir === 'up') {
        const newY = Math.max(0, scrollY - 200);
        scrollRef.current?.scrollTo({ y: newY, animated: true });
        setScrollY(newY);
      }
    },
    onSelect: () => {},
    onBack: () => {
      if (showChannelPlayer || showEpisodePlayer) {
        setShowChannelPlayer(false); setShowEpisodePlayer(false);
        setPlayingChannel(null); setPlayingEpisode(null);
      } else if (focusArea === 'content') {
        setFocusArea('sidebar');
        setTimeout(() => document.querySelector('[data-area="sidebar"]')?.focus(), 50);
      } else if (activeTab !== 'home') {
        setActiveTab('home'); setScrollKey(k => k + 1);
      }
    },
  });

  const renderContent = useMemo(() => {
    const props = { onPlayChannel: handlePlayChannel, onPlayEpisode: handlePlayEpisode, onOpenSeries, scrollKey, focusArea, lastSection, setFocusArea, setLastSection, scrollRef, scrollY, setScrollY };
    switch (activeTab) {
      case 'home': return <TVHomeScreen {...props} />;
      case 'channels': return <TVChannelsScreen {...props} />;
      case 'movies': return <TVMoviesScreen {...props} />;
      case 'series': return <TVSeriesScreen {...props} />;
      case 'more': return <TVMoreScreen {...props} />;
      default: return <TVHomeScreen {...props} />;
    }
  }, [activeTab, scrollKey, focusArea, lastSection, handlePlayChannel, handlePlayEpisode, onOpenSeries]);

  if (showChannelPlayer && playingChannel) return <ChannelPlayerScreen channel={playingChannel} onBack={() => { setShowChannelPlayer(false); setPlayingChannel(null); }} />;
  if (showEpisodePlayer && playingEpisode) return <NativePlayerScreen episode={playingEpisode} onBack={() => { setShowEpisodePlayer(false); setPlayingEpisode(null); }} />;

  return (
    // ✅ حاوية جذرية تأخذ أبعاد النافذة الفعلية بالضبط
    <View style={styles.root}>
      <View data-area="sidebar" style={styles.sidebarBox}>
        <SidebarRail activeTab={activeTab} onTabPress={handleTabPress} onFocusArea={() => setFocusArea('sidebar')} />
      </View>
      <View data-area="content" style={styles.contentBox}>
        <TVHeader title={activeTab === 'home' ? 'الرئيسية' : activeTab === 'channels' ? 'القنوات' : activeTab === 'movies' ? 'الأفلام' : activeTab === 'series' ? 'المسلسلات' : 'المزيد'} showBack={activeTab !== 'home'} onBackPress={() => { setActiveTab('home'); setScrollKey(k => k + 1); }} />
        <View style={styles.screenContainer} key={scrollKey}>{renderContent}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: SCREEN_W, height: SCREEN_H, flexDirection: 'row-reverse', backgroundColor: '#000', overflow: 'hidden' },
  sidebarBox: { width: 280, height: SCREEN_H, overflow: 'hidden' }, // ✅ عرض ثابت + ارتفاع كامل النافذة
  contentBox: { flex: 1, height: SCREEN_H, flexDirection: 'column' },
  screenContainer: { flex: 1, overflow: 'hidden' }
});