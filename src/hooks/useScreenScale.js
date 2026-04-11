// src/hooks/useScreenScale.js
// 📐 Hook ذكي لتحجيم العناصر تلقائياً حسب حجم الشاشة (32" إلى 85")

import { useState, useEffect } from 'react';
import { Dimensions, PixelRatio } from 'react-native';

const BASE_MOBILE_WIDTH = 360;
const BASE_TV_WIDTH = 1920;
const MAX_SCALE = 1.8;
const MIN_SCALE = 1.0;

export default function useScreenScale() {
  const [scale, setScale] = useState(1);
  const [isTV, setIsTV] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const update = () => {
      const width = Dimensions.get('window').width;
      setScreenWidth(width);
      
      // كشف التلفاز تقريبياً (عرض > 1200px أو نسبة عرض/ارتفاع < 1.5)
      const height = Dimensions.get('window').height;
      const aspect = width / height;
      const isLikelyTV = width > 1200 || aspect < 1.6;
      setIsTV(isLikelyTV);

      // حساب مقياس التحجيم
      let calculatedScale;
      if (isLikelyTV) {
        calculatedScale = width / BASE_TV_WIDTH;
      } else {
        calculatedScale = width / BASE_MOBILE_WIDTH;
      }

      // تثبيت المقياس بين 1.0 و 1.8 لتجنب التكبير المفرط على 4K/8K
      setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, calculatedScale)));
    };

    update();
    const subscription = Dimensions.addEventListener('change', update);
    return () => subscription?.remove();
  }, []);

  return {
    scale,
    isTV,
    screenWidth,
    // دالة مساعدة للتحجيم الآمن
    s: (size) => PixelRatio.roundToNearestPixel(size * scale),
    // دالة مساعدة للخطوط
    fs: (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale))
  };
}