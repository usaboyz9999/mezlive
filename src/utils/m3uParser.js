// src/utils/m3uParser.js
// 🧠 محلل M3U متقدم - يدعم جميع صيغ الهيدرز في ملفات القنوات

export const parseM3UWithHeaders = (rawContent) => {
  if (!rawContent || typeof rawContent !== 'string') return [];
  
  const lines = rawContent.split('\n');
  const channels = [];
  let currentChannel = {};
  let pendingHeaders = {};
  let pendingVlcOpts = {};

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.startsWith('#EXTM3U')) continue;

    // 1️⃣ قراءة خيارات VLC (#EXTVLCOPT) - تأتي قبل #EXTINF
    if (line.startsWith('#EXTVLCOPT:')) {
      const match = line.match(/#EXTVLCOPT:(http-[^=]+)=(.*)/i);
      if (match) {
        let key = match[1];
        let value = match[2].trim().replace(/^["']|["']$/g, '');
        if (key === 'http-referrer') key = 'Referer';
        else if (key === 'http-user-agent') key = 'User-Agent';
        else if (key === 'http-cookie') key = 'Cookie';
        pendingVlcOpts[key] = value;
      }
      continue;
    }

    // 2️⃣ قراءة بيانات القناة (#EXTINF)
    if (line.startsWith('#EXTINF:')) {
      // دمج خيارات VLC المعلقة مع القناة الجديدة
      pendingHeaders = { ...pendingVlcOpts };
      pendingVlcOpts = {};
      currentChannel = {};
      
      // استخراج الاسم (آخر عنصر بعد الفاصلة)
      const nameMatch = line.match(/,([^,]+)$/);
      currentChannel.name = nameMatch ? nameMatch[1].trim() : 'قناة';
      
      // استخراج الشعار
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      if (logoMatch) currentChannel.logo = logoMatch[1];
      
      // استخراج المجموعة
      const groupMatch = line.match(/group-title="([^"]+)"/i);
      if (groupMatch) currentChannel.group = groupMatch[1];
      
      // استخراج الدولة
      const countryMatch = line.match(/tvg-country="([^"]+)"/i);
      if (countryMatch) currentChannel.country = countryMatch[1].toUpperCase();
      
      // استخراج الهيدرز المدمجة داخل سطر #EXTINF
      const refMatch = line.match(/http-referrer="([^"]+)"/i);
      if (refMatch) pendingHeaders['Referer'] = refMatch[1];
      const uaMatch = line.match(/http-user-agent="([^"]+)"/i);
      if (uaMatch) pendingHeaders['User-Agent'] = uaMatch[1];
      
      continue;
    }

    // 3️⃣ قراءة رابط البث وتجميع القناة النهائية
    if ((line.startsWith('http') || line.startsWith('rtsp')) && currentChannel.name) {
      currentChannel.streamUrl = line.trim();
      
      // بناء الهيدرز النهائية مع قيم افتراضية آمنة
      currentChannel.headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'Origin': 'https://',
        ...pendingHeaders
      };
      
      // تحسين الـ Referer تلقائياً من الرابط إذا كان افتراضياً
      if (currentChannel.headers['Referer'] === 'https://') {
        const domainMatch = line.match(/https?:\/\/([^/]+)/i);
        if (domainMatch) {
          currentChannel.headers['Referer'] = `https://${domainMatch[1]}/`;
          currentChannel.headers['Origin'] = `https://${domainMatch[1]}`;
        }
      }
      
      // إضافة معرف فريد
      currentChannel.id = `ch_${channels.length + 1}_${Date.now()}`;
      channels.push({ ...currentChannel });
      
      // إعادة التعيين للقناة التالية
      currentChannel = {};
      pendingHeaders = {};
    }
  }
  
  console.log(`✅ تم تحليل ${channels.length} قناة من ملف M3U`);
  return channels;
};

// دالة مساعدة لتجميع القنوات حسب المجموعة
export const groupChannelsByCategory = (channels) => {
  const groups = {};
  channels.forEach(ch => {
    const group = ch.group || 'أخرى';
    if (!groups[group]) {
      groups[group] = {
        id: group.toLowerCase().replace(/\s+/g, '-'),
        name: group,
        channels: []
      };
    }
    groups[group].channels.push(ch);
  });
  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
};

// دالة مساعدة لتجميع القنوات حسب الدولة
export const groupChannelsByCountry = (channels) => {
  const countries = {};
  channels.forEach(ch => {
    const country = ch.country || 'OTHER';
    if (!countries[country]) {
      countries[country] = {
        code: country,
        name: getCountryNameArabic(country),
        flag: `https://flagcdn.com/w80/${country.toLowerCase()}.png`,
        channels: []
      };
    }
    countries[country].channels.push(ch);
  });
  return Object.values(countries).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
};

// خريطة أسماء الدول بالعربية
const getCountryNameArabic = (code) => {
  const map = {
    'SA': 'السعودية', 'EG': 'مصر', 'AE': 'الإمارات', 'KW': 'الكويت',
    'QA': 'قطر', 'BH': 'البحرين', 'OM': 'عمان', 'JO': 'الأردن',
    'LB': 'لبنان', 'IQ': 'العراق', 'MA': 'المغرب', 'DZ': 'الجزائر',
    'TN': 'تونس', 'LY': 'ليبيا', 'SY': 'سوريا', 'YE': 'اليمن',
    'PS': 'فلسطين', 'TR': 'تركيا', 'IR': 'إيران', 'AL': 'ألبانيا',
    'GB': 'بريطانيا', 'US': 'أمريكا', 'FR': 'فرنسا', 'DE': 'ألمانيا',
    'FI': 'فنلندا', 'IT': 'إيطاليا', 'JP': 'اليابان', 'IN': 'الهند',
    'OTHER': 'دول أخرى'
  };
  return map[code] || code;
};