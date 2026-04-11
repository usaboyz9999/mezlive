// src/data/mockData.js
// 📦 بيانات التطبيق - مسلسلات عربية (علي كلاي، افراج، فرصة اخيرة، درش، راس الأفعى)

export const moviesArabic = [];
export const moviesForeign = [];
export const seriesForeign = [];

// 🔗 دالة توليد روابط "افراج" (30 حلقة)
const generateEfragUrl = (ep) => `https://vid2.arab254589.space/Efrag/${ep.toString().padStart(2, '0')}.mp4`;
const generateEfragEpisodes = () => Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `الحلقة ${i + 1}`,
  duration: "45 دقيقة",
  quality: "FHD",
  streamUrl: generateEfragUrl(i + 1)
}));

// 🔗 دالة توليد روابط "فرصة اخيرة" (15 حلقة)
const generateForsaUrl = (ep) => `https://vid2.arab254589.space/Forsa-Akhira/${ep.toString().padStart(2, '0')}.mp4`;
const generateForsaEpisodes = () => Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `الحلقة ${i + 1}`,
  duration: "45 دقيقة",
  quality: "FHD",
  streamUrl: generateForsaUrl(i + 1)
}));

// 🔗 دالة توليد روابط "درش" (30 حلقة)
const generateDarshUrl = (ep) => `https://vid3.arab254589.space/Darsh/${ep.toString().padStart(2, '0')}.mp4`;
const generateDarshEpisodes = () => Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `الحلقة ${i + 1}`,
  duration: "45 دقيقة",
  quality: "FHD",
  streamUrl: generateDarshUrl(i + 1)
}));

// 🔗 دالة توليد روابط "راس الأفعى" (30 حلقة) ✅ جديد
const generateRasAlAfaaUrl = (ep) => `https://vid4.arab254589.space/Ras-Al-Afaa/${ep.toString().padStart(2, '0')}.mp4`;
const generateRasAlAfaaEpisodes = () => Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `الحلقة ${i + 1}`,
  duration: "45 دقيقة",
  quality: "FHD",
  streamUrl: generateRasAlAfaaUrl(i + 1)
}));

export const seriesArabic = [
  // 🔹 مسلسل علي كلاي
  {
    id: 310,
    title: 'علي كلاي',
    year: '2026 • رمضان',
    rating: 4.9,
    description: 'علي، شاب نال لقب «كلاي» بين جيرانه بفضل براعته الاستثنائية في الملاكمة وقوة جأشه.',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnX020W9B5HeCi2JlNDzvkoTyyVlehl7WCQQ&s',
    backdrop: 'https://media.gemini.media/img/medium/2026/3/2/2026_3_2_22_27_32_960.webp',
    genres: ['دراما', 'اجتماعي', 'رياضة', 'إثارة'],
    language: 'العربية',
    cast: ['علي الجندى', 'درة', 'يارا الجوهري', 'محمود البزاوي', 'طارق الدسوقي'],
    episodes: [
      { id: 1, title: "الحلقة 1", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv2-gda.cdnz.quest/yh5cb5yyp7ikjnl75zd2rirgvd3ms2ifsxwlt4y2gujd5kdb7xgkrlk5pxwa/v.mp4" },
      { id: 2, title: "الحلقة 2", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs5-rvu.cdnz.quest/yh5chtdyp7ikjnl75zckrirjwtej2snzoia3zoe6leebzhmemhvkjwm6r27a/v.mp4" },
      { id: 3, title: "الحلقة 3", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv2-gda.cdnz.quest/yh5caky4p7ikjnl75zd2r5r3v5xjiucu3zq4dfhbieywd7ivt3ysnxrxkrjq/v.mp4" },
      { id: 4, title: "الحلقة 4", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv2-gda.cdnz.quest/yh5caty6p7ikjnl75zd2ryj2x5dyiot6zq4wijkagiurrm7bykzm5agkn7wq/v.mp4" },
      { id: 5, title: "الحلقة 5", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5chry7p7ikjnl75zd2ryznxuvkikgsuy7lt7ev6bika4f4uigc2v6glqua/v.mp4" },
      { id: 6, title: "الحلقة 6", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5chrarp7ikjnl75zd2r5l55zlg73sadsaf5mbr45qa2fkiofjcdtcckuta/v.mp4" },
      { id: 7, title: "الحلقة 7", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs5-rvu.cdnz.quest/yh5chjitp7ikjnl75zd2r4b7uyrq5wwokz5jsljcodly7i3ecc3ldf32lvqq/v.mp4" },
      { id: 8, title: "الحلقة 8", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-store2-liu.cdnz.quest/yh5chqyvp7ikjnl75zd2r2r3xqcjvhdc4g6osjwrys7nxwsh7pmlc3og4a2a/v.mp4" },
      { id: 9, title: "الحلقة 9", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs1-cew.cdnz.quest/yh5cg3yxp7ikjnl75zd2ryjg5j5afhsbttuvijyc4kooz7vhguj54vmcbvoa/v.mp4" },
      { id: 10, title: "الحلقة 10", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-store2-liu.cdnz.quest/yh5cgqajp7ikjnl75zckr3zhuqspfoxxv2l2kk6tz5hudnd6hw6izje64lcq/v.mp4" },
      { id: 11, title: "الحلقة 11", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-store2-liu.cdnz.quest/yh5cajqlp7ikjnl75zckr4d6v2icd4mltpu6bw42cvbg7qwevbnnfjku7w3q/v.mp4" },
      { id: 12, title: "الحلقة 12", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs3-pmh.cdnz.quest/yh5chtimp7ikjnl75zckrkjc5hit54pctlf5gxomp7tbagttbecbpycr4auq/v.mp4" },
      { id: 13, title: "الحلقة 13", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-store2-liu.cdnz.quest/yh5chgiop7ikjnl75zckr2rdwuk3avxjxdi63sftee43qgebtxhmnygtqmoa/v.mp4" },
      { id: 14, title: "الحلقة 14", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs5-rvu.cdnz.quest/yh5cgjiap7ikjnl75zckrljk5if7ewmzowqh4gpggm6oxq7zjjhpllov5ieq/v.mp4" },
      { id: 15, title: "الحلقة 15", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs5-rvu.cdnz.quest/yh5ch4qbp7ikjnl75zckr2lqxho2w7v4c2aq6bg5zirlpk4lvcs3bcscxatq/v.mp4" },
      { id: 16, title: "الحلقة 16", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5cbfqdp7ikjnl75zckr7t45edlcft5itxwqjx67ogdxurohqdofwv43vxq/v.mp4" },
      { id: 17, title: "الحلقة 17", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs5-rvu.cdnz.quest/yh5cgpqfp7ikjnl75zckr2dzvtz65irl3m5oepfo6waymbgt3smayrpcsscq/v.mp4" },
      { id: 18, title: "الحلقة 18", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5cbpagp7ikjnl75zckr5zdur7eu5bjx45uihbw5hzxjiwsvchzfsu5pycq/v.mp4" },
      { id: 19, title: "الحلقة 19", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs4-rvy.cdnz.quest/yh5cgv3yp7ikjnl75zckryr356pkxqc6cjxvpuhb453rx4mb4lytgybad7pq/v.mp4" },
      { id: 20, title: "الحلقة 20", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5cb43zp7ikjnl75zckr2zfwokxfia3m5lg3fjldcebonnwfkhx4oxuge2a/v.mp4" },
      { id: 21, title: "الحلقة 21", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs1-cew.cdnz.quest/yh5cgqd3p7ikjnl75zckryjpvmbi4ia3chvjlr6dpwx2szjbqn5b4r5uyajq/v.mp4" },
      { id: 22, title: "الحلقة 22", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5chwl4p7ikjnl75zc2r2r4vyvqho3d3joguu7kk2znh5rqbsrbbzh3hzmq/v.mp4" },
      { id: 23, title: "الحلقة 23", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5cbb36p7ikjnl75zc2ryjywx6a2whcjiijf3gldzanvgdkkf3zldhooz2a/v.mp4" },
      { id: 24, title: "الحلقة 24", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5chnl7p7ikjnl75zc2r2r4wdevkqg3nlspvg5hraqjzumhoxvr5nv4dmwq/v.mp4" },
      { id: 25, title: "الحلقة 25", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs1-cew.cdnz.quest/yh5ch2lqp7ikjnl75zc2r4l3xcscv6pqaonrbj4d37wgke5czzfrbawec7vq/v.mp4" },
      { id: 26, title: "الحلقة 26", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5cgrlsp7ikjnl75zc2r3rewskmgqtn5rzvqf6ktxccfxxlc4g6xgq45jfq/v.mp4" },
      { id: 27, title: "الحلقة 27", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-store2-liu.cdnz.quest/yh5cbp3tp7ikjnl75zc2r3jlvwszgyxcgzjckht4vmu3h7hdemuv3wmxmg3q/v.mp4" },
      { id: 28, title: "الحلقة 28", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs5-rvu.cdnz.quest/yh5cht3up7ikjnl75zc2rlzqvld6ufpn5iv5mx2qg6hcfi7tzw5kfu4q7csq/v.mp4" },
      { id: 29, title: "الحلقة 29", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflm-srv1-lkf.cdnz.quest/yh5cgfdwp7ikjnl75zc2r3zgw2qltvaswnia3oxrw5kii3aedjxx5mf5ih5a/v.mp4" },
      { id: 30, title: "الحلقة 30", duration: "45 دقيقة", quality: "FHD", streamUrl: "https://aflam-fs2-rvy.cdnz.quest/yh5cgjlxp7ikjnl75zc2r7j6witu3u7t6itplhhwkfckfdbyodemgdqv5mea/v.mp4" }
    ]
  },

  // 🔹 مسلسل افراج (30 حلقة)
  {
    id: 311,
    title: 'افراج',
    year: '2026',
    rating: 4.7,
    description: 'مسلسل افراج - دراما اجتماعية تشويقية تدور أحداثها حول قصة مثيرة من الواقع.',
    poster: 'https://media.gemini.media/img/large/2026/3/2/2026_3_2_22_27_32_960.webp',
    backdrop: 'https://media.gemini.media/img/original/2026/3/2/2026_3_2_22_27_32_960.webp',
    genres: ['دراما', 'تشويق', 'اجتماعي'],
    language: 'العربية',
    cast: ['طاقم التمثيل', 'يضاف لاحقاً'],
    episodes: generateEfragEpisodes()
  },

  // 🔹 مسلسل فرصة اخيرة (15 حلقة)
  {
    id: 312,
    title: 'فرصة اخيرة',
    year: '2026',
    rating: 4.8,
    description: 'مسلسل فرصة اخيرة - دراما إنسانية مشوقة تتناول قصة كفاح وأمل في مواجهة التحديات.',
    poster: 'https://media.gemini.media/img/large/2026/3/2/2026_3_2_22_27_32_960.webp',
    backdrop: 'https://media.gemini.media/img/original/2026/3/2/2026_3_2_22_27_32_960.webp',
    genres: ['دراما', 'إنساني', 'تشويق'],
    language: 'العربية',
    cast: ['طاقم التمثيل', 'يضاف لاحقاً'],
    episodes: generateForsaEpisodes()
  },

  // 🔹 مسلسل درش (30 حلقة)
  {
    id: 313,
    title: 'درش',
    year: '2026',
    rating: 4.6,
    description: 'مسلسل درش - دراما تشويقية مثيرة تدور حول أحداث غامضة وصراعات إنسانية.',
    poster: 'https://media.gemini.media/img/large/2026/3/2/2026_3_2_22_27_32_960.webp',
    backdrop: 'https://media.gemini.media/img/original/2026/3/2/2026_3_2_22_27_32_960.webp',
    genres: ['دراما', 'تشويق', 'غموض'],
    language: 'العربية',
    cast: ['طاقم التمثيل', 'يضاف لاحقاً'],
    episodes: generateDarshEpisodes()
  },

  // 🔹 مسلسل راس الأفعى (30 حلقة) ✅ جديد
  {
    id: 314,
    title: 'راس الأفعى',
    year: '2026',
    rating: 4.9,
    description: 'مسلسل راس الأفعى - دراما تشويقية مثيرة تدور حول صراعات السلطة والمؤامرات في عالم الجريمة.',
    // 🖼️ صورة البوستر (الصغيرة في القائمة)
    poster: 'https://media.gemini.media/img/large/2026/3/2/2026_3_2_22_27_32_960.webp',
    // 🖼️ صورة الغلاف (الكبيرة في التفاصيل)
    backdrop: 'https://media.gemini.media/img/original/2026/3/2/2026_3_2_22_27_32_960.webp',
    genres: ['دراما', 'تشويق', 'جريمة', 'إثارة'],
    language: 'العربية',
    cast: ['طاقم التمثيل', 'يضاف لاحقاً'],
    
    // 📼 توليد 30 حلقة تلقائياً بالروابط المرتبة
    episodes: generateRasAlAfaaEpisodes()
  }
];

export const fetchAppData = async () => ({
  moviesArabic,
  moviesForeign,
  seriesArabic,
  seriesForeign
});