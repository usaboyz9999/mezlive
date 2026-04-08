// src/utils/LinkFetcher.js
// 🎯 دالة جلب رابط m3u8 ديناميكياً من موقعك الوسيط (get.php)
// ✅ يدعم الكاش المحلي، إعادة المحاولة، ومعالجة الأخطاء

// 🔗 رابط API الأساسي (عدّله إذا غيّر موقعك)
export const API_BASE = 'https://almadinaboyz.byethost13.com/php_video_system';

// 💾 كاش محلي في الذاكرة (للسرعة الفائقة)
const memoryCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 دقائق

/**
 * 🎯 جلب رابط m3u8 طازج من موقعك
 * @param {string} source - نوع المصدر ("vidmoly")
 * @param {string} fileCode - المعرف الفريد للفيديو (مثل: hspyiimkz2ff)
 * @param {boolean} forceRefresh - تجاوز الكاش وجلب رابط جديد
 * @returns {Promise<string|null>} رابط m3u8 أو null عند الفشل
 */
export const fetchFreshLink = async (source, fileCode, forceRefresh = false) => {
  const cacheKey = `${source}_${fileCode}`;
  const now = Date.now();

  // 🔍 التحقق من الكاش المحلي أولاً (إذا لم يُطلب تحديث قسري)
  if (!forceRefresh && memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey);
    if (now < cached.expiresAt) {
      console.log(`✅ [LinkFetcher] استخدام الرابط من الكاش: ${cacheKey}`);
      return cached.url;
    }
    console.log(`🔄 [LinkFetcher] انتهاء الكاش، جاري التجديد: ${cacheKey}`);
  }

  try {
    console.log(`🔗 [LinkFetcher] طلب جديد: source=${source}, fileCode=${fileCode}`);
    
    const startTime = performance?.now?.() || Date.now();
    
    // 🌐 طلب الرابط من موقعك الوسيط
    const response = await fetch(`${API_BASE}/get.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        source,
        file_code: fileCode,  // snake_case ليتوافق مع PHP
        force_refresh: forceRefresh
      }),
      // مهلة زمنية معقولة
      signal: AbortSignal.timeout(15000) // 15 ثانية
    });

    const endTime = performance?.now?.() || Date.now();
    const duration = Math.round(endTime - startTime);
    console.log(`⏱️ [LinkFetcher] وقت الاستجابة: ${duration}ms`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log(`📥 [LinkFetcher] استجابة:`, {
      success: data.success,
      cached: data.cached,
      m3u8_preview: data.m3u8?.substring(0, 60) + '...'
    });

    if (data.success && data.m3u8) {
      // 💾 حفظ في الكاش المحلي مع وقت انتهاء
      memoryCache.set(cacheKey, {
        url: data.m3u8,
        expiresAt: now + CACHE_TTL,
        fetchedAt: new Date().toISOString(),
        source: data.source,
        fileCode: data.fileCode
      });

      console.log(`✅ [LinkFetcher] تم جلب وحفظ الرابط: ${data.m3u8.substring(0, 60)}...`);
      return data.m3u8;
    }

    console.warn(`❌ [LinkFetcher] فشل الاستخراج: ${data.error || 'خطأ غير معروف'}`);
    if (data.debug) {
      console.debug('[LinkFetcher] تفاصيل التصحيح:', data.debug);
    }
    return null;

  } catch (err) {
    console.error(`💥 [LinkFetcher] خطأ في الاتصال:`, {
      message: err.message,
      name: err.name,
      cause: err.cause?.message
    });
    return null;
  }
};

/**
 * 🔄 دالة مساعدة: جلب رابط مع إعادة محاولة تلقائية عند الفشل
 * @param {string} source - نوع المصدر
 * @param {string} fileCode - معرف الفيديو
 * @param {number} maxRetries - عدد المحاولات القصوى (افتراضي: 2)
 * @returns {Promise<string|null>} رابط m3u8 أو null
 */
export const fetchLinkWithRetry = async (source, fileCode, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const url = await fetchFreshLink(source, fileCode, attempt > 1);
    if (url) return url;
    
    if (attempt < maxRetries) {
      console.log(`🔄 [LinkFetcher] محاولة ${attempt + 1}/${maxRetries} بعد ${attempt * 1000}ms`);
      await new Promise(resolve => setTimeout(resolve, attempt * 1000)); // تأخير تصاعدي
    }
  }
  return null;
};

/**
 * 🧹 مسح الكاش المحلي (مفيد عند تحديث التطبيق أو عند طلب المستخدم)
 */
export const clearLinkCache = () => {
  memoryCache.clear();
  console.log('🗑️ [LinkFetcher] تم مسح الكاش المحلي');
};

/**
 * 📊 الحصول على إحصائيات الكاش (لأغراض التصحيح)
 * @returns {Object} إحصائيات الكاش
 */
export const getCacheStats = () => ({
  size: memoryCache.size,
  keys: Array.from(memoryCache.keys()),
  timestamp: new Date().toISOString()
});