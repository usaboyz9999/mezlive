// src/tv/hooks/useRemoteNavigation.js
// 🎮 محرك التنقل بالريموت/لوحة المفاتيح - آمن للويب والأندرويد والتلفاز
// ✅ استيراد صحيح: React hooks من 'react'، Platform من 'react-native'

// 🔴 هام: استيراد دوال React من 'react' وليس 'react-native'
import { useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';

// 🔑 خريطة مفاتيح لوحة المفاتيح (للمعاينة في المتصفح فقط)
const KEY_MAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Enter: 'select',
  ' ': 'select',      // Space bar
  Escape: 'back',
  Backspace: 'back',
};

/**
 * 🎮 Hook لإدارة التنقل بالريموت/لوحة المفاتيح - آمن لجميع المنصات
 * @param {Object} options - خيارات التكوين
 */
export const useRemoteNavigation = ({
  onNavigate,
  onSelect,
  onBack,
  enabled = true,
  debounce = 200,
} = {}) => {
  const lastPressTime = useRef(0);
  
  // 🌐 كشف إذا كنا في المتصفح (آمن)
  const isWeb = typeof window !== 'undefined' && typeof window.addEventListener === 'function';

  // 🎯 معالجة حدث الضغط (مركزية)
  const handleKeyPress = useCallback((direction) => {
    const now = Date.now();
    
    // 🛡️ Debounce: تجاهل الضغطات المتكررة خلال فترة قصيرة
    if (now - lastPressTime.current < debounce) {
      return;
    }
    lastPressTime.current = now;

    // 🎮 تنفيذ الإجراء المناسب
    if (direction === 'select' && onSelect) {
      onSelect();
    } else if (direction === 'back' && onBack) {
      onBack();
    } else if (['up', 'down', 'left', 'right'].includes(direction) && onNavigate) {
      onNavigate(direction);
    }
  }, [onNavigate, onSelect, onBack, debounce]);

  // 🖥️ مستمع لوحة المفاتيح (للويب فقط - آمن)
  useEffect(() => {
    // 🚫 لا تفعل شيئاً إذا لم نكن في المتصفح أو إذا كان المعطل مفعل
    if (!enabled || !isWeb) return;

    const handleKeyDown = (event) => {
      const key = event.key;
      const direction = KEY_MAP[key];
      
      if (direction) {
        event.preventDefault(); // منع السلوك الافتراضي للمتصفح
        handleKeyPress(direction);
      }
    };

    // ✅ الآن نستخدم window بأمان لأننا تأكدنا من وجوده
    window.addEventListener('keydown', handleKeyDown);
    
    // تنظيف المستمع عند إلغاء التثبيت
    return () => {
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [enabled, isWeb, handleKeyPress]);

  // 📺 مستمع أحداث الريموت لأندرويد تي في (عند توفرها)
  useEffect(() => {
    // هذا القسم يمكن توسيعه لاحقاً لدعم TV APIs الرسمية
    // حالياً: المنطق الأساسي يعمل عبر onFocus/onBlur في المكونات
  }, [enabled]);

  // 🔄 دالة مساعدة لتحديث الحالة يدوياً (للاختبار أو التكامل المتقدم)
  const triggerNavigation = useCallback((direction) => {
    handleKeyPress(direction);
  }, [handleKeyPress]);

  return {
    triggerNavigation, // للاستخدام اليدوي عند الحاجة
    isWeb,             // معرفة إذا كنا في المتصفح
    platform: Platform.OS, // معرفة النظام الأساسي
  };
};