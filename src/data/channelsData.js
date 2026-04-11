// src/data/channelsData.js
// ✅ بيانات جاهزة ومضمونة العرض

export const CHANNELS_DATA = [
  {
    id: 'mbc',
    name: 'MBC',
    logo: 'https://ui-avatars.com/api/?name=MBC&background=E50914&color=fff&size=200',
    channels: [
      { id: 1, name: 'MBC 1', logo: 'https://ui-avatars.com/api/?name=MBC1&background=333&color=fff&size=150', streamUrl: 'https://example.com/mbc1.m3u8' },
      { id: 2, name: 'MBC 2', logo: 'https://ui-avatars.com/api/?name=MBC2&background=333&color=fff&size=150', streamUrl: 'https://example.com/mbc2.m3u8' },
      { id: 3, name: 'MBC Action', logo: 'https://ui-avatars.com/api/?name=MBCAction&background=333&color=fff&size=150', streamUrl: 'https://example.com/mbc-action.m3u8' },
      { id: 4, name: 'MBC Drama', logo: 'https://ui-avatars.com/api/?name=MBCDrama&background=333&color=fff&size=150', streamUrl: 'https://example.com/mbc-drama.m3u8' },
    ]
  },
  {
    id: 'rotana',
    name: 'Rotana',
    logo: 'https://ui-avatars.com/api/?name=Rotana&background=1E90FF&color=fff&size=200',
    channels: [
      { id: 10, name: 'Rotana Cinema', logo: 'https://ui-avatars.com/api/?name=RC&background=333&color=fff&size=150', streamUrl: 'https://example.com/rotana-cinema.m3u8' },
      { id: 11, name: 'Rotana Classic', logo: 'https://ui-avatars.com/api/?name=RClassic&background=333&color=fff&size=150', streamUrl: 'https://example.com/rotana-classic.m3u8' },
    ]
  },
  {
    id: 'sports',
    name: 'الرياضية',
    logo: 'https://ui-avatars.com/api/?name=Sports&background=2ED573&color=fff&size=200',
    channels: [
      { id: 20, name: 'SSC 1', logo: 'https://ui-avatars.com/api/?name=SSC1&background=333&color=fff&size=150', streamUrl: 'https://example.com/ssc1.m3u8' },
      { id: 21, name: 'SSC 2', logo: 'https://ui-avatars.com/api/?name=SSC2&background=333&color=fff&size=150', streamUrl: 'https://example.com/ssc2.m3u8' },
    ]
  }
];