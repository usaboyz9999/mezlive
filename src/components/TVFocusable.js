// src/components/TVFocusable.js
// 🎮 غلاف ذكي يجعل العناصر قابلة للتنقل بالريموت على Android TV

import React from 'react';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import useScreenScale from '../hooks/useScreenScale';

export default function TVFocusable({ children, onPress, style, ...props }) {
  const { isTV } = useScreenScale();
  
  if (!isTV || Platform.OS !== 'android') {
    return (
      <TouchableOpacity style={style} onPress={onPress} {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  // على Android TV: تفعيل التركيز التلقائي ودعم أزرار الريموت
  return (
    <TouchableOpacity
      style={[style, styles.tvTouchable]}
      onPress={onPress}
      focusable={true}
      hasTVPreferredControl={true}
      tvParallaxProperties={{
        enabled: true,
        shiftDistanceX: 2.0,
        shiftDistanceY: 2.0,
        tiltAngle: 0.05,
        magnitude: 3.0
      }}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tvTouchable: {
    // تحسين منطقة اللمس/التركيز للريموت
    padding: 4
  }
});