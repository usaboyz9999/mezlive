// src/hooks/useOrientation.js
// 📐 Hook مخصص لكشف اتجاه الشاشة تلقائياً

import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export default function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const update = () => {
      const { width, height } = Dimensions.get('window');
      setScreenWidth(width);
      setScreenHeight(height);
      setIsLandscape(width > height);
    };

    update();
    const subscription = Dimensions.addEventListener('change', update);
    return () => subscription?.remove();
  }, []);

  return {
    isLandscape,
    screenWidth,
    screenHeight,
    sidebarWidth: isLandscape ? 80 : 0,
    contentPadding: isLandscape ? { paddingRight: 80 } : {}
  };
}