// src/screens/HomeScreen.js
// 🏠 الشاشة الرئيسية - تحميل فوري بدون شاشة بيضاء، مع حفظ الحالة عند التنقل

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Platform, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import CategoryBar from '../components/CategoryBar';
import ContentCard from '../components/ContentCard';
import { fetchAppData } from '../data/mockData';
import { M3U_CONTENT } from '../../channels';
import { COUNTRIES_M3U } from '../../countries';
import { parseM3UWithHeaders, groupChannelsByCategory, groupChannelsByCountry } from '../utils/m3uParser';

// ✅ قناة SBC (1080p) - مثال ثابت
const SBC_CHANNEL = {
  id: 'sbc_1080p',
  name: 'SBC (1080p)',
  logo: 'https://i.imgur.com/9JSQglj.png',
  streamUrl: 'https://shd-gcp-live.edgenextcdn.net/live/bitmovin-sbc/90e09c0c28db26435799b4a14892a167/index.m3u8'
};

// ✅ قنوات MBC مضافة يدوياً لضمان الظهور (مطابقة للتطبيق)
const MBC_CHANNELS = [
  { id: 'mbc_1', name: 'MBC 1', logo: 'https://ui-avatars.com/api/?name=MBC1&background=E50914&color=fff&size=150', streamUrl: 'https://example.com/mbc1.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'MBC' },
  { id: 'mbc_2', name: 'MBC 2', logo: 'https://ui-avatars.com/api/?name=MBC2&background=E50914&color=fff&size=150', streamUrl: 'https://example.com/mbc2.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'MBC' },
  { id: 'mbc_action', name: 'MBC Action', logo: 'https://ui-avatars.com/api/?name=MBCAction&background=E50914&color=fff&size=150', streamUrl: 'https://example.com/mbc-action.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'MBC' },
  { id: 'mbc_drama', name: 'MBC Drama', logo: 'https://ui-avatars.com/api/?name=MBCDrama&background=E50914&color=fff&size=150', streamUrl: 'https://example.com/mbc-drama.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'MBC' },
  { id: 'mbc_max', name: 'MBC Max', logo: 'https://ui-avatars.com/api/?name=MBCMax&background=E50914&color=fff&size=150', streamUrl: 'https://example.com/mbc-max.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'MBC' },
  { id: 'mbc_bollywood', name: 'MBC Bollywood', logo: 'https://ui-avatars.com/api/?name=MBCBollywood&background=E50914&color=fff&size=150', streamUrl: 'https://example.com/mbc-bollywood.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'MBC' },
];

// ✅ قنوات Rotana مضافة يدوياً لضمان الظهور (مطابقة للتطبيق)
const ROTANA_CHANNELS = [
  { id: 'rotana_cinema', name: 'Rotana Cinema', logo: 'https://ui-avatars.com/api/?name=RC&background=1E90FF&color=fff&size=150', streamUrl: 'https://example.com/rotana-cinema.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'Rotana' },
  { id: 'rotana_classic', name: 'Rotana Classic', logo: 'https://ui-avatars.com/api/?name=RClassic&background=1E90FF&color=fff&size=150', streamUrl: 'https://example.com/rotana-classic.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'Rotana' },
  { id: 'rotana_drama', name: 'Rotana Drama', logo: 'https://ui-avatars.com/api/?name=RDrama&background=1E90FF&color=fff&size=150', streamUrl: 'https://example.com/rotana-drama.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'Rotana' },
  { id: 'rotana_khalijia', name: 'Rotana Khalijia', logo: 'https://ui-avatars.com/api/?name=RKhalijia&background=1E90FF&color=fff&size=150', streamUrl: 'https://example.com/rotana-khalijia.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'Rotana' },
  { id: 'rotana_music', name: 'Rotana Music', logo: 'https://ui-avatars.com/api/?name=RMusic&background=1E90FF&color=fff&size=150', streamUrl: 'https://example.com/rotana-music.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'Rotana' },
  { id: 'rotana_clip', name: 'Rotana Clip', logo: 'https://ui-avatars.com/api/?name=RClip&background=1E90FF&color=fff&size=150', streamUrl: 'https://example.com/rotana-clip.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'Rotana' },
];

// ✅ قنوات CBC مضافة يدوياً لضمان الظهور (مطابقة للتطبيق)
const CBC_CHANNELS = [
  { id: 'cbc', name: 'CBC', logo: 'https://ui-avatars.com/api/?name=CBC&background=FF6B00&color=fff&size=150', streamUrl: 'https://example.com/cbc.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'CBC' },
  { id: 'cbc_drama', name: 'CBC Drama', logo: 'https://ui-avatars.com/api/?name=CBCDrama&background=FF6B00&color=fff&size=150', streamUrl: 'https://example.com/cbc-drama.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'CBC' },
  { id: 'cbc_sofra', name: 'CBC Sofra', logo: 'https://ui-avatars.com/api/?name=CBCSofra&background=FF6B00&color=fff&size=150', streamUrl: 'https://example.com/cbc-sofra.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'CBC' },
  { id: 'cbc_extra', name: 'CBC Extra', logo: 'https://ui-avatars.com/api/?name=CBCExtra&background=FF6B00&color=fff&size=150', streamUrl: 'https://example.com/cbc-extra.m3u8', headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://', 'Accept': '*/*' }, group: 'CBC' },
];

export default function HomeScreen({ onOpenSeries, onPlayChannel }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const r = currentTheme.radius;
  
  const [activeCategory, setActiveCategory] = useState('home');
  const [subCategory, setSubCategory] = useState('main');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // ✅ منع إعادة التحميل عند العودة للتبويب (حل الشاشة البيضاء)
  const dataLoadedRef = useRef(false);

  // ✅ تحليل القنوات من channels.js مع الهيدرز (مرة واحدة فقط)
  const parsedChannels = useMemo(() => {
    try {
      return parseM3UWithHeaders(M3U_CONTENT);
    } catch (e) {
      console.error('❌ خطأ في تحليل channels.js:', e);
      return [];
    }
  }, []);

  // ✅ تحليل قنوات الدول من countries.js مع الهيدرز (مرة واحدة فقط)
  const countryChannels = useMemo(() => {
    try {
      const parsed = parseM3UWithHeaders(COUNTRIES_M3U);
      return groupChannelsByCountry(parsed);
    } catch (e) {
      console.error('❌ خطأ في تحليل countries.js:', e);
      return [];
    }
  }, []);

  // ✅ تجميع القنوات حسب المجموعة (لشاشة المجموعات)
  const groupedChannels = useMemo(() => {
    return groupChannelsByCategory(parsedChannels);
  }, [parsedChannels]);

  // ✅ استخراج قنوات المجموعات الرئيسية (MBC, Rotana, CBC)
  const groupsData = useMemo(() => {
    const findGroup = (name) => groupedChannels.find(g => g.name.toLowerCase().includes(name.toLowerCase()));
    return [
      { id: 'mbc', name: 'MBC', logo: 'https://ui-avatars.com/api/?name=MBC&background=E50914&color=fff&size=150', channels: [...(findGroup('mbc')?.channels || []), ...MBC_CHANNELS] },
      { id: 'rotana', name: 'Rotana', logo: 'https://ui-avatars.com/api/?name=Rotana&background=1E90FF&color=fff&size=150', channels: [...(findGroup('rotana')?.channels || []), ...ROTANA_CHANNELS] },
      { id: 'cbc', name: 'CBC', logo: 'https://ui-avatars.com/api/?name=CBC&background=FF6B00&color=fff&size=150', channels: [...(findGroup('cbc')?.channels || []), ...CBC_CHANNELS] }
    ];
  }, [groupedChannels]);

  // ✅ استخراج قنوات حسب الفئة
  const filterChannelsByKeywords = (channels, keywords) => {
    const kw = keywords.map(k => k.toLowerCase());
    return channels.filter(ch => {
      const name = ch.name.toLowerCase();
      const group = ch.group?.toLowerCase() || '';
      return kw.some(k => name.includes(k) || group.includes(k));
    });
  };

  const movieChannels = useMemo(() => filterChannelsByKeywords(parsedChannels, ['movie', 'cinema', 'film', 'أفلام', 'سينما', 'osn movies', 'rotana cinema', 'mbc action']), [parsedChannels]);
  const seriesChannels = useMemo(() => filterChannelsByKeywords(parsedChannels, ['series', 'drama', 'مسلسل', 'مسلسلات', 'دراما', 'mbc drama', 'rotana drama']), [parsedChannels]);
  const kidsChannels = useMemo(() => filterChannelsByKeywords(parsedChannels, ['kids', 'children', 'أطفال', 'cartoon', 'spacetoon', 'disney', 'toon', 'كرتون']), [parsedChannels]);
  const sportsChannels = useMemo(() => filterChannelsByKeywords(parsedChannels, ['sport', 'رياضة', 'ssc', 'bein', 'ad sport', 'saudi sport', 'dubai sport']), [parsedChannels]);
  const newsChannels = useMemo(() => filterChannelsByKeywords(parsedChannels, ['news', 'أخبار', 'aljazeera', 'alarabiya', 'sky news', 'cnn', 'bbc', 'الحدث']), [parsedChannels]);

  useEffect(() => {
    if (dataLoadedRef.current) return; // ✅ تخطي التحميل إذا تم مسبقاً
    fetchAppData().then(data => {
      setAppData(data);
      setLoading(false);
      dataLoadedRef.current = true;
    });
  }, []);

  useEffect(() => {
    if (activeCategory !== 'channels') {
      setSubCategory('main');
      setSelectedGroup(null);
      setSelectedCountry(null);
    }
  }, [activeCategory]);

  const toggleFavorite = useCallback((ch) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === ch.id);
      if (exists) return prev.filter(f => f.id !== ch.id);
      Alert.alert('تمت الإضافة ❤️', ch.name, [{ text: 'موافق' }]);
      return [...prev, ch];
    });
  }, []);

  const handlePlayChannel = useCallback((channel) => {
    if (!channel?.streamUrl) {
      Alert.alert('غير متاح', 'لا يوجد رابط تشغيل لهذه القناة', [{ text: 'موافق' }]);
      return;
    }
    onPlayChannel?.({
      id: channel.id,
      name: channel.name,
      streamUrl: channel.streamUrl,
      headers: channel.headers,
      logo: channel.logo,
      group: channel.group
    });
  }, [onPlayChannel]);

  // ✅ شاشة تحميل محسّنة (تتطابق مع الثيم، لا تومض بالأبيض، تختفي فوراً بعد أول تحميل)
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: c.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={[{ color: c.textSecondary, marginTop: 12, fontSize: 14 }]}>جاري تحضير المحتوى...</Text>
      </View>
    );
  }

  const ChannelRow = ({ item }) => (
    <TouchableOpacity 
      style={styles.channelRow} 
      onPress={() => handlePlayChannel(item)} 
      onLongPress={() => toggleFavorite(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name) }} style={styles.channelImg} resizeMode="contain" />
      <View style={styles.channelTextContainer}>
        <Text style={[styles.channelName, { color: c.text }]} numberOfLines={2}>{item.name}</Text>
        <Text style={{ color: c.primary, fontSize: 11, marginTop: 2 }}>
          {favorites.some(f => f.id === item.id) ? '❤️ في المفضلة' : 'اضغط مطولاً للإضافة'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (activeCategory === 'channels') {
    const getListData = () => {
      if (selectedCountry) return selectedCountry.channels;
      if (selectedGroup) return selectedGroup.channels;
      if (subCategory === 'selected') return [SBC_CHANNEL];
      if (subCategory === 'favorites') return favorites;
      if (subCategory === 'movies') return movieChannels;
      if (subCategory === 'series') return seriesChannels;
      if (subCategory === 'kids') return kidsChannels;
      if (subCategory === 'sports') return sportsChannels;
      if (subCategory === 'news') return newsChannels;
      if (subCategory === 'country') return countryChannels;
      return [];
    };

    const getEmptyMessage = () => {
      if (subCategory === 'selected') return 'لا توجد قنوات مختارة';
      if (subCategory === 'favorites') return 'لا توجد قنوات مفضلة';
      if (subCategory === 'movies') return 'لا توجد قنوات أفلام';
      if (subCategory === 'series') return 'لا توجد قنوات مسلسلات';
      if (subCategory === 'kids') return 'لا توجد قنوات أطفال';
      if (subCategory === 'sports') return 'لا توجد قنوات رياضية';
      if (subCategory === 'news') return 'لا توجد قنوات أخبار';
      if (subCategory === 'country') return countryChannels.length > 0 ? 'اختر دولة لعرض قنواتها' : '⚠️ لا توجد دول متاحة';
      return 'لا توجد قنوات';
    };

    const getHeaderTitle = () => {
      if (selectedCountry) return selectedCountry.name;
      if (selectedGroup) return selectedGroup.name;
      return 'قوائم القنوات';
    };

    const handleBackPress = () => {
      if (selectedCountry) {
        setSelectedCountry(null);
      } else if (selectedGroup) {
        setSelectedGroup(null);
      } else {
        setActiveCategory('home');
      }
    };

    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <Header title={getHeaderTitle()} showSearch={false} onMenuPress={handleBackPress} />
        <CategoryBar onSelect={setActiveCategory} activeCategory={activeCategory} />
        
        {!selectedGroup && !selectedCountry && (
          <View style={styles.subNavContainer}>
            <View style={styles.subTabRow3}>
              <TouchableOpacity style={[styles.subTabThird, { backgroundColor: subCategory === 'main' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('main')} activeOpacity={0.8}>
                <Text style={[styles.subTabText, { color: subCategory === 'main' ? '#fff' : c.text }]}>🏠 الرئيسية</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subTabThird, { backgroundColor: subCategory === 'selected' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('selected')} activeOpacity={0.8}>
                <Text style={[styles.subTabText, { color: subCategory === 'selected' ? '#fff' : c.text }]}>⭐ المختارة</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subTabThird, { backgroundColor: subCategory === 'favorites' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('favorites')} activeOpacity={0.8}>
                <Text style={[styles.subTabText, { color: subCategory === 'favorites' ? '#fff' : c.text }]}>❤️ المفضلة</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.subTabFull, { backgroundColor: subCategory === 'news' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('news')} activeOpacity={0.8}>
              <Text style={[styles.subTabText, { color: subCategory === 'news' ? '#fff' : c.text }]}>📰 الأخبار</Text>
            </TouchableOpacity>

            <View style={styles.subTabRow}>
              <TouchableOpacity style={[styles.subTabHalf, { backgroundColor: subCategory === 'movies' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('movies')} activeOpacity={0.8}>
                <Text style={[styles.subTabText, { color: subCategory === 'movies' ? '#fff' : c.text }]}>🎬 الأفلام</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subTabHalf, { backgroundColor: subCategory === 'series' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('series')} activeOpacity={0.8}>
                <Text style={[styles.subTabText, { color: subCategory === 'series' ? '#fff' : c.text }]}>📺 المسلسلات</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.subTabRow}>
              <TouchableOpacity style={[styles.subTabHalf, { backgroundColor: subCategory === 'sports' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('sports')} activeOpacity={0.8}>
                <Text style={[styles.subTabText, { color: subCategory === 'sports' ? '#fff' : c.text }]}>⚽ الرياضة</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subTabHalf, { backgroundColor: subCategory === 'kids' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('kids')} activeOpacity={0.8}>
                <Text style={[styles.subTabText, { color: subCategory === 'kids' ? '#fff' : c.text }]}>🧸 أطفال</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.subTabRow}>
              <TouchableOpacity style={[styles.subTabHalf, { backgroundColor: subCategory === 'country' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('country')} activeOpacity={0.8}>
                <Text style={[styles.subTabText, { color: subCategory === 'country' ? '#fff' : c.text }]}>🌍 حسب الدول</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subTabHalf, { backgroundColor: subCategory === 'language' ? c.primary : c.cardBg }]} onPress={() => setSubCategory('language')} activeOpacity={0.8}>
                <Text style={[styles.subTabText, { color: subCategory === 'language' ? '#fff' : c.text }]}>🗣️ حسب اللغة</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!selectedCountry && subCategory === 'country' ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.countriesGrid}>
            {countryChannels.length > 0 ? countryChannels.map((country) => (
              <TouchableOpacity 
                key={country.code} 
                style={styles.countryCard} 
                onPress={() => setSelectedCountry(country)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: country.flag }} style={styles.countryFlag} resizeMode="contain" />
                <Text style={[styles.countryName, { color: c.text }]} numberOfLines={1}>{country.name}</Text>
                <Text style={[styles.countryCount, { color: c.textSecondary }]}>{Array.isArray(country.channels) ? country.channels.length : 0} قناة</Text>
              </TouchableOpacity>
            )) : (
              <Text style={[{ textAlign: 'center', padding: 40, color: c.textSecondary }]}>⚠️ لا توجد دول متاحة</Text>
            )}
          </ScrollView>
        ) : !selectedGroup && subCategory === 'main' ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.groupsGrid}>
            {groupsData.map((group) => (
              <TouchableOpacity key={group.id} style={styles.groupSquare} onPress={() => setSelectedGroup(group)} activeOpacity={0.7}>
                <Image source={{ uri: group.logo }} style={styles.groupImg} resizeMode="cover" />
                <Text style={[styles.groupSquareName, { color: c.text }]} numberOfLines={1}>{group.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <FlatList
            data={getListData()}
            keyExtractor={(item, idx) => item?.id ? item.id.toString() : `ch-${idx}`}
            numColumns={1}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={[{ textAlign: 'center', padding: 60, color: c.textSecondary, fontSize: 15 }]}>{getEmptyMessage()}</Text>}
            renderItem={({ item }) => <ChannelRow item={item} />}
          />
        )}
      </View>
    );
  }

  const { moviesArabic, seriesArabic } = appData || { moviesArabic: [], seriesArabic: [] };
  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Header title="mezlive" showSearch={false} onMenuPress={() => {}} />
      <CategoryBar onSelect={setActiveCategory} activeCategory={activeCategory} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text, fontSize: 18, fontWeight: '700', marginBottom: 16 }]}>القنوات المباشرة</Text>
          <TouchableOpacity style={[{ padding: 28, backgroundColor: c.primary, borderRadius: r.lg, alignItems: 'center' }]}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>📺</Text>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>أدخل القنوات</Text>
          </TouchableOpacity>
        </View>
        <Section title="أحدث الأفلام العربية">{moviesArabic.map(m => <ContentCard key={m.id} item={m} type="movie" onPress={() => {}} />)}</Section>
        <Section title="أحدث المسلسلات العربية">{seriesArabic.map(s => <ContentCard key={s.id} item={s} type="series" onPress={() => onOpenSeries(s)} />)}</Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: c.text, fontSize: 18, fontWeight: '700', marginBottom: 16 }]}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>{children}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100 },
  section: { marginBottom: 28, paddingHorizontal: 20 },
  sectionTitle: { marginBottom: 14 },
  horizontalScroll: { gap: 14 },
  
  subNavContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, gap: 12 },
  subTabFull: { width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  subTabRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  subTabRow3: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  subTabHalf: { flex: 1, paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  subTabThird: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  subTabText: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  
  countriesGrid: { padding: 16, paddingBottom: 100, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 },
  countryCard: { width: '48%', padding: 16, alignItems: 'center', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 8 },
  countryFlag: { width: '100%', height: 60, borderRadius: 8, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.1)' },
  countryName: { fontSize: 15, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  countryCount: { fontSize: 12, textAlign: 'center' },
  
  groupsGrid: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 100, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  groupSquare: { width: '22%', alignItems: 'center', marginBottom: 12 },
  groupImg: { width: 60, height: 60, borderRadius: 30, marginBottom: 8, shadowColor: 'rgba(0,0,0,0.12)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  groupSquareName: { fontSize: 11, fontWeight: '600', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1 },
  
  listContainer: { padding: 12, paddingBottom: 100 },
  channelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, marginBottom: 4 },
  channelImg: { width: 70, height: 70, marginRight: 16 },
  channelTextContainer: { flex: 1, justifyContent: 'center' },
  channelName: { fontSize: 16, fontWeight: '600', textAlign: 'left' }
});