// src/tv/theme/tvTheme.js
// 🎨 مقاييس مخصصة للتلفاز - تعتمد على الثيم الأصلي مع تعديلات للشاشات الكبيرة
// ✅ تستورد القيم الأساسية من theme.js وتضيف طبقة تلفزيونية فوقها

import baseTheme from '../../config/theme';

// 🔧 عوامل التكبير للشاشات الكبيرة (قابل للتعديل حسب الحاجة)
const TV_SCALE = {
  font: 1.5,      // تكبير الخطوط بنسبة 50%
  spacing: 1.4,   // تكبير المسافات بنسبة 40%
  radius: 1.2,    // تكبير زوايا الحواف بنسبة 20%
  card: 1.8,      // تكبير البطاقات بنسبة 80%
};

// 🎯 ألوان حالات التركيز (مخصصة للتلفاز فقط)
const focusColors = {
  glow: 'rgba(184, 97, 255, 0.6)',  // توهج بنفسجي ناعم
  border: '#B861FF',                 // إطار بنفسجي صريح
  shadow: 'rgba(0, 0, 0, 0.4)',      // ظل عميق للعنصر المحدد
  background: 'rgba(184, 97, 255, 0.15)', // خلفية خفيفة عند التركيز
};

// 📐 هوامش الأمان للتلفاز (Overscan ~5%)
const safeArea = {
  horizontal: '5%',  // هامش جانبي
  vertical: '3.5%',  // هامش علوي/سفلي
};

// 🎬 إنشاء كائن الثيم التلفزيوني النهائي
const tvTheme = {
  // ✅ إعادة استخدام كل الألوان الأساسية كما هي (هوية بصرية موحدة)
  colors: {
    ...baseTheme.colors,
    // ➕ إضافة ألوان التركيز المخصصة
    focus: focusColors,
  },
  
  // ✅ تكبير المسافات للشاشات الكبيرة
  spacing: {
    xs: Math.round(baseTheme.spacing.xs * TV_SCALE.spacing),
    sm: Math.round(baseTheme.spacing.sm * TV_SCALE.spacing),
    md: Math.round(baseTheme.spacing.md * TV_SCALE.spacing),
    lg: Math.round(baseTheme.spacing.lg * TV_SCALE.spacing),
    xl: Math.round(baseTheme.spacing.xl * TV_SCALE.spacing),
  },
  
  // ✅ تكبير زوايا الحواف لمظهر أكثر نعومة على الشاشات الكبيرة
  radius: {
    sm: Math.round(baseTheme.radius.sm * TV_SCALE.radius),
    md: Math.round(baseTheme.radius.md * TV_SCALE.radius),
    lg: Math.round(baseTheme.radius.lg * TV_SCALE.radius),
    xl: Math.round(baseTheme.radius.xl * TV_SCALE.radius),
    round: Math.round(baseTheme.radius.round * TV_SCALE.radius),
  },
  
  // ✅ تكبير الخطوط بشكل كبير للقراءة عن بُعد (2-3 أمتار)
  font: {
    xs: Math.round(baseTheme.font.xs * TV_SCALE.font),
    sm: Math.round(baseTheme.font.sm * TV_SCALE.font),
    md: Math.round(baseTheme.font.md * TV_SCALE.font),
    lg: Math.round(baseTheme.font.lg * TV_SCALE.font),
    xl: Math.round(baseTheme.font.xl * TV_SCALE.font),
    xxl: Math.round(baseTheme.font.xxl * TV_SCALE.font),
    // ➕ أحجام جديدة للشاشات الكبيرة جداً
    xxxl: Math.round(baseTheme.font.xxl * TV_SCALE.font * 1.3),
    title: Math.round(baseTheme.font.xxl * TV_SCALE.font * 1.6),
  },
  
  // ✅ أبعاد البطاقات والعناصر للشاشات العريضة
  card: {
    width: Math.round(150 * TV_SCALE.card),      // عرض بطاقة المحتوى
    height: Math.round(220 * TV_SCALE.card),     // ارتفاع صورة البطاقة
    channelWidth: Math.round(110 * TV_SCALE.card), // عرض بطاقة القناة
    channelHeight: Math.round(70 * TV_SCALE.card), // ارتفاع صورة القناة
  },
  
  // ✅ هوامش الأمان لمنع التصاق العناصر بحواف التلفاز
  safeArea,
  
  // ✅ تأثيرات التركيز الموحدة (تُستخدم في FocusWrapper)
  focusEffect: {
    scale: 1.05,              // تكبير طفيف عند التركيز
    duration: 300,            // مدة الانتقال بالمللي ثانية
    borderWidth: 3,           // سماكة الإطار عند التركيز
    shadowOpacity: 0.6,       // شفافية الظل
    shadowRadius: 12,         // نصف قطر الظل
  },
  
  // ✅ إعدادات الشبكة والقوائم للتلفاز
  grid: {
    columns: 4,               // عدد أعمدة الشبكة الافتراضي
    gap: Math.round(20 * TV_SCALE.spacing), // تباعد بين العناصر
    scrollMargin: Math.round(40 * TV_SCALE.spacing), // هامش التمرير
  },
  
  // ✅ إعدادات القائمة الجانبية
  sidebar: {
    width: '22%',             // عرض القائمة الجانبية كنسبة من الشاشة
    itemHeight: 70,           // ارتفاع كل عنصر في القائمة
    iconSize: 28,             // حجم الأيقونة
    labelSize: Math.round(baseTheme.font.md * TV_SCALE.font * 1.1), // حجم النص
  },
};

export default tvTheme;