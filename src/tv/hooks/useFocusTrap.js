// src/tv/hooks/useFocusTrap.js
// 🔒 Hook لحبس التركيز داخل منطقة معينة (مثل قائمة أو شبكة)
// ✅ يمنع تسرب التركيز خارج الحدود عند الضغط على الأسهم

import { useRef, useCallback } from 'react';

/**
 * 🔒 Hook لإدارة حبس التركيز داخل حاوية
 * @param {Object} options - خيارات التكوين
 * @param {string} options.id - معرف فريد للمنطقة (للتتبع)
 * @param {Function} options.onEscape - دالة تستدعى عند محاولة الخروج بـ "رجوع"
 * @param {Object} options.boundaries - حدود المنطقة: { minIndex, maxIndex, columns }
 */
export const useFocusTrap = ({
  id,
  onEscape,
  boundaries = { minIndex: 0, maxIndex: Infinity, columns: 1 },
} = {}) => {
  const focusedIndex = useRef(0);
  const { minIndex, maxIndex, columns } = boundaries;

  // 🎯 حساب المؤشر الجديد بناءً على الاتجاه
  const calculateNextIndex = useCallback((currentIndex, direction) => {
    let nextIndex = currentIndex;

    switch (direction) {
      case 'up':
        nextIndex = Math.max(minIndex, currentIndex - columns);
        break;
      case 'down':
        nextIndex = Math.min(maxIndex, currentIndex + columns);
        break;
      case 'left':
        nextIndex = Math.max(minIndex, currentIndex - 1);
        break;
      case 'right':
        nextIndex = Math.min(maxIndex, currentIndex + 1);
        break;
      default:
        nextIndex = currentIndex;
    }

    return nextIndex;
  }, [minIndex, maxIndex, columns]);

  // 🔄 تحديث التركيز مع التحقق من الحدود
  const updateFocus = useCallback((currentIndex, direction) => {
    const nextIndex = calculateNextIndex(currentIndex, direction);
    
    // 🚫 إذا حاول الخروج من الحدود ← استدعاء onEscape
    if (nextIndex < minIndex || nextIndex > maxIndex) {
      if (onEscape) {
        onEscape(direction);
      }
      return currentIndex; // البقاء في المكان
    }
    
    return nextIndex;
  }, [calculateNextIndex, minIndex, maxIndex, onEscape]);

  // 📊 دوال مساعدة للوصول للحالة
  const getFocusedIndex = useCallback(() => focusedIndex.current, []);
  
  const setFocusedIndex = useCallback((index) => {
    if (index >= minIndex && index <= maxIndex) {
      focusedIndex.current = index;
    }
  }, [minIndex, maxIndex]);

  return {
    focusedIndex: focusedIndex.current,
    updateFocus,
    getFocusedIndex,
    setFocusedIndex,
    boundaries,
  };
};