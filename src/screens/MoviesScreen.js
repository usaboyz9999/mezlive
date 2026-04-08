// src/screens/MoviesScreen.js
// 🎬 شاشة الأفلام - تمرير الفيلم للمشغل المستقل (بدون هيدرز معقدة)

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Platform, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import { moviesArabic, moviesForeign } from '../data/mockData';

export default function MoviesScreen({ onPlay }) {
  const { currentTheme } = useTheme();
  const c = currentTheme.colors;
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ دمج جميع الأفلام في قائمة واحدة
  const allMovies = useMemo(() => {
    const combined = [...moviesArabic, ...moviesForeign];
    return combined.map(movie => ({
      id: movie.id,
      title: movie.title || movie.name,
      streamUrl: movie.streamUrl || movie.videoUrl,
      poster: movie.poster || movie.image,
      year: movie.year,
      rating: movie.rating,
      description: movie.description,
      genres: movie.genres
    }));
  }, []);

  // ✅ فلترة البحث (تدعم العربية والإنجليزية)
  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return allMovies;
    const q = searchQuery.toLowerCase().trim();
    return allMovies.filter(movie => 
      movie.title?.toLowerCase().includes(q) || 
      movie.description?.toLowerCase().includes(q) ||
      movie.genres?.some(g => g.toLowerCase().includes(q))
    );
  }, [searchQuery, allMovies]);

  // 🎬 معالجة الضغط على الفيلم - تمرير بسيط للمشغل المستقل
  const handlePlayMovie = (movie) => {
    if (!movie?.streamUrl) {
      Alert.alert('غير متاح', 'لا يوجد رابط تشغيل لهذا الفيلم', [{ text: 'موافق' }]);
      return;
    }
    
    // ✅ تمرير البيانات بالصيغة التي يتوقعها المشغل المستقل
    onPlay?.({
      id: movie.id,
      title: movie.title,
      streamUrl: movie.streamUrl,
      poster: movie.poster
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Header title="الأفلام" showSearch={true} onSearchPress={() => {}} />
      
      {/* ✅ شريط البحث */}
      <View style={[styles.searchContainer, { backgroundColor: c.surface }]}>
        <Text style={{ fontSize: 18, marginRight: 10 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: c.text }]}
          placeholder="ابحث عن فيلم..."
          placeholderTextColor={c.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={{ fontSize: 20, color: c.textSecondary, marginLeft: 5 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ عرض قائمة الأفلام */}
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={2}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🎬</Text>
            <Text style={[{ color: c.text, fontSize: 16, fontWeight: '600' }]}>
              {searchQuery.trim() ? 'لا توجد نتائج' : 'لا توجد أفلام متاحة'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ContentCard 
            item={item} 
            type="movie" 
            onPress={() => handlePlayMovie(item)} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // شريط البحث
  searchContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    marginHorizontal: 16, marginTop: 12, marginBottom: 8, 
    paddingHorizontal: 14, paddingVertical: 10, 
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 4 },
  
  // قائمة الأفلام
  listContainer: { padding: 12, paddingBottom: 100 },
  
  // حالة فارغة
  emptyState: { 
    alignItems: 'center', padding: 40, marginTop: 40,
    justifyContent: 'center', flex: 1 
  }
});