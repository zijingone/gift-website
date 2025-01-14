export const mockTags = [
  // MBTI分类
  { id: 'intj', name: 'INTJ', category: 'MBTI' },
  { id: 'intp', name: 'INTP', category: 'MBTI' },
  { id: 'entj', name: 'ENTJ', category: 'MBTI' },
  { id: 'entp', name: 'ENTP', category: 'MBTI' },
  { id: 'infj', name: 'INFJ', category: 'MBTI' },
  { id: 'infp', name: 'INFP', category: 'MBTI' },
  { id: 'enfj', name: 'ENFJ', category: 'MBTI' },
  { id: 'enfp', name: 'ENFP', category: 'MBTI' },
  { id: 'istj', name: 'ISTJ', category: 'MBTI' },
  { id: 'isfj', name: 'ISFJ', category: 'MBTI' },
  { id: 'estj', name: 'ESTJ', category: 'MBTI' },
  { id: 'esfj', name: 'ESFJ', category: 'MBTI' },
  { id: 'istp', name: 'ISTP', category: 'MBTI' },
  { id: 'isfp', name: 'ISFP', category: 'MBTI' },
  { id: 'estp', name: 'ESTP', category: 'MBTI' },
  { id: 'esfp', name: 'ESFP', category: 'MBTI' },
  
  // 节日分类
  { id: 'christmas', name: '圣诞节', category: '节日' },
  { id: 'newyear', name: '新年', category: '节日' },
  { id: 'valentine', name: '情人节', category: '节日' },
  { id: 'birthday', name: '生日', category: '节日' },
  
  // 生日年龄段
  { id: 'age-18-25', name: '18-25岁', category: '生日' },
  { id: 'age-25-35', name: '25-35岁', category: '生日' },
  { id: 'age-35-50', name: '35-50岁', category: '生日' },
  
  // 纪念日
  { id: 'anniversary', name: '结婚纪念日', category: '纪念日' },
  { id: 'graduation', name: '毕业纪念', category: '纪念日' },
  { id: 'promotion', name: '升职纪念', category: '纪念日' },
  
  // 礼物类型
  { id: 'digital', name: '数码产品', category: '礼物' },
  { id: 'jewelry', name: '珠宝首饰', category: '礼物' },
  { id: 'beauty', name: '美妆护肤', category: '礼物' },
  { id: 'fashion', name: '时尚服饰', category: '礼物' },
  { id: 'hobby', name: '兴趣爱好', category: '礼物' },
  { id: 'home', name: '居家生活', category: '礼物' },
  
  // 其他标签
  { id: 'luxury', name: '奢侈品', category: '标签' },
  { id: 'limited', name: '限量版', category: '标签' },
  { id: 'handmade', name: '手工制作', category: '标签' },
  { id: 'customized', name: '可定制', category: '标签' },
];

export const mockGifts = [
  {
    id: '1',
    name: '乐高星球大战系列 - 千年隼',
    price: 999,
    description: '经典乐高模型，收藏价值高',
    image: 'https://picsum.photos/800/600?random=1',
    tags: [
      { id: 'hobby', name: '兴趣爱好' },
      { id: 'intj', name: 'INTJ' },
      { id: 'limited', name: '限量版' }
    ],
    status: 'published',
    publishTime: '2024-01-14T10:00:00'
  },
  {
    id: '2',
    name: 'Dyson Airwrap 美发造型器',
    price: 4990,
    description: `Dyson Airwrap 是一款革命性的美发造型工具，它利用空气动力学原理 - 考恩达效应(Coanda effect)来创造专业级的美发效果。这款多功能造型器不仅可以干发、卷发，还能顺发、造型，是追求美丽的您不可或缺的美发神器。

独特的数字马达V9可以产生强劲的气流，配合精心设计的温控系统，能够在保护秀发的同时，创造出令人惊艳的造型效果。六种不同的配件满足各种造型需求，让您在家也能轻松打造沙龙级发型。`,
    features: `核心功能特点：

1. 智能温控系统
- 实时温度监测，每秒测量40次
- 始终保持低于150°C的安全温度
- 预设三档温度可调节
- 冷风定型功能

2. 专业配件组合
- 40mm卷发筒，打造自然大卷
- 30mm卷发筒，适合中小卷发型
- 顺发梳，快速打造顺滑直发
- 圆形容积梳，增加发根蓬松度
- 造型梳，精细造型和打理刘海
- 预造型吹风嘴，快速预干发丝

3. 创新技术
- 考恩达气流技术，自动卷发不伤发
- 13叶片高速马达，每分钟转速高达110,000次
- 负离子技术，有效对抗静电
- 智能声波振动，减少发丝缠绕`,
    background: `Dyson的美发科技革新：

Dyson公司投入了3100万英镑研发经费，历时6年，进行了众多实验和测试，最终开发出这款革命性的美发造型器。研发团队研究了不同发质、发型和造型方式，收集了超过120万根真实头发样本进行测试。

在开发过程中，工程师们发现传统的高温造型工具容易导致发丝损伤，因此特别关注温度控制。通过创新的空气动力学应用，成功实现了使用较低温度达到专业的造型效果。

产品自2018年推出以来，获得了多个国际设计大奖，包括2019年红点设计大奖。持续的技术改进和用户反馈，让Airwrap成为美发造型领域的标杆产品。`,
    image: 'https://picsum.photos/800/600?random=2',
    tags: [
      { id: 'beauty', name: '美妆护肤' },
      { id: 'enfp', name: 'ENFP' },
      { id: 'luxury', name: '奢侈品' }
    ]
  },
  {
    id: '3',
    name: 'Nintendo Switch OLED',
    price: 2299,
    description: '便携式游戏机，支持多人游戏',
    image: 'https://picsum.photos/800/600?random=3',
    tags: [
      { id: 'digital', name: '数码产品' },
      { id: 'entp', name: 'ENTP' },
      { id: 'hobby', name: '兴趣爱好' }
    ]
  },
  {
    id: '4',
    name: 'SK-II 护肤礼盒',
    price: 1599,
    description: '高端护肤套装，提升肌肤品质',
    image: 'https://picsum.photos/800/600?random=4',
    tags: [
      { id: 'beauty', name: '美妆护肤' },
      { id: 'isfj', name: 'ISFJ' },
      { id: 'limited', name: '限量版' }
    ]
  },
  {
    id: '5',
    name: 'Kindle Paperwhite',
    price: 1099,
    description: '电子阅读器，阅读更轻松',
    image: 'https://picsum.photos/800/600?random=5',
    tags: [
      { id: 'digital', name: '数码产品' },
      { id: 'intj', name: 'INTJ' },
      { id: 'hobby', name: '兴趣爱好' }
    ]
  },
  {
    id: '6',
    name: 'LEGO 建筑系列',
    price: 799,
    description: '经典建筑模型，享受拼装乐趣',
    image: 'https://picsum.photos/800/600?random=6',
    tags: [
      { id: 'hobby', name: '兴趣爱好' },
      { id: 'intp', name: 'INTP' },
      { id: 'handmade', name: '手工制作' }
    ]
  },
  {
    id: '7',
    name: 'Tiffany 项链',
    price: 4999,
    description: '经典蒂芙尼蓝，永恒优雅',
    image: 'https://picsum.photos/800/600?random=7',
    tags: [
      { id: 'jewelry', name: '珠宝首饰' },
      { id: 'enfj', name: 'ENFJ' },
      { id: 'luxury', name: '奢侈品' }
    ]
  },
  {
    id: '8',
    name: 'iPhone 15 Pro',
    price: 8999,
    description: '最新款iPhone，性能强大',
    image: 'https://picsum.photos/800/600?random=8',
    tags: [
      { id: 'digital', name: '数码产品' },
      { id: 'entj', name: 'ENTJ' },
      { id: 'luxury', name: '奢侈品' }
    ]
  }
];

// 模拟API调用
export const mockApi = {
  async getTags() {
    return mockTags;
  },

  async getGifts(params = {}) {
    let filteredGifts = [...mockGifts];
    
    // 如果指定了状态，则按状态筛选
    if (params.status) {
      filteredGifts = filteredGifts.filter(gift => gift.status === params.status);
    }
    
    if (params.tags) {
      const tagIds = params.tags.split(',');
      filteredGifts = filteredGifts.filter(gift =>
        gift.tags.some(tag => tagIds.includes(tag.id))
      );
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredGifts = filteredGifts.filter(gift =>
        gift.name.toLowerCase().includes(searchLower) ||
        gift.description.toLowerCase().includes(searchLower) ||
        gift.tags.some(tag => tag.name.toLowerCase().includes(searchLower))
      );
    }

    return filteredGifts;
  },

  async getGiftById(id) {
    return mockGifts.find(gift => gift.id === id);
  },

  async getRelatedGifts(id) {
    const gift = await this.getGiftById(id);
    if (!gift) return [];

    const giftTagIds = gift.tags.map(tag => tag.id);
    return mockGifts
      .filter(g => g.id !== id && g.tags.some(tag => giftTagIds.includes(tag.id)))
      .slice(0, 3);
  },

  async toggleFavorite(id) {
    const gift = mockGifts.find(g => g.id === id);
    if (gift) {
      gift.isFavorite = !gift.isFavorite;
    }
    return gift;
  },

  async saveGift(giftData) {
    const gift = {
      id: giftData.id || Date.now().toString(),
      name: giftData.name,
      price: giftData.price,
      description: giftData.description || '',
      image: giftData.coverImage,
      tags: giftData.tags,
      status: giftData.status,
      publishTime: giftData.publishTime || '',
      modules: giftData.modules || [],
      isScheduled: giftData.isScheduled || false
    };

    const existingIndex = mockGifts.findIndex(g => g.id === gift.id);
    if (existingIndex !== -1) {
      mockGifts[existingIndex] = gift;
    } else {
      mockGifts.unshift(gift);
    }

    return gift;
  },
}; 