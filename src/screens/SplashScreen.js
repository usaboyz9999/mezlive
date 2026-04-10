import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen() {
  const fade = new Animated.Value(0);
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 1200, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <Text style={styles.logo}>📺</Text>
      <Text style={styles.title}>mezlive</Text>
      <Text style={styles.sub}>بث مباشر احترافي</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  sub: { fontSize: 14, color: '#a0a0b0', marginTop: 8 }
});