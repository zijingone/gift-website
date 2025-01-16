/**
 * 默认标签数据
 * @type {Array<{id: string, name: string, category: string}>}
 */
const defaultTags = [
  { id: 'INTJ', name: 'INTJ', category: 'MBTI' },
  { id: 'birthday', name: '生日', category: '节日' },
  { id: 'age18-25', name: '18-25岁', category: '年龄' }
];

/**
 * 从 localStorage 加载数据
 * @template T
 * @param {string} key - localStorage 的键名
 * @param {T} defaultValue - 默认值，当 localStorage 中没有数据时使用
 * @returns {T} 加载的数据或默认值
 */
const loadFromStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    console.log(`从 localStorage 加载 ${key}:`, data);
    if (!data) {
      console.log(`localStorage 中没有 ${key}，使用默认值:`, defaultValue);
      saveToStorage(key, defaultValue);
      return defaultValue;
    }
    const parsedData = JSON.parse(data);
    console.log(`成功解析 ${key} 数据:`, parsedData);
    return parsedData;
  } catch (error) {
    console.error(`加载 ${key} 时出错:`, error);
    return defaultValue;
  }
};

/**
 * 修复礼物数据的状态
 * @function
 * @param {Array<Object>} gifts - 礼物数据列表
 * @returns {Array<Object>} 修复后的礼物数据列表
 */
const fixGiftStatuses = (gifts) => {
  console.log('开始修复礼物状态...');
  return gifts.map(gift => {
    let { status, publishAt } = gift;
    const now = new Date();

    if (publishAt) {
      // 如果有发布时间，根据时间判断状态
      const publishDate = new Date(publishAt);
      
      if (publishDate > now) {
        // 发布时间在未来，应该是定时发布
        status = 'scheduled';
        console.log(`礼物 ${gift.id}: 发布时间在未来，状态修改为定时发布`);
      } else {
        // 发布时间已过，应该是已发布
        status = 'published';
        console.log(`礼物 ${gift.id}: 发布时间已过，状态修改为已发布`);
      }
    } else if (status === 'published') {
      // 如果状态是已发布但没有时间，设置为当前时间
      publishAt = now.toISOString();
      console.log(`礼物 ${gift.id}: 已发布但无时间，添加当前时间`);
    } else {
      // 没有发布时间，且不是已发布状态，应该是草稿
      status = 'draft';
      publishAt = null;
      console.log(`礼物 ${gift.id}: 无发布时间，状态修改为草稿`);
    }

    const updatedGift = { ...gift, status, publishAt };
    console.log(`礼物 ${gift.id} 修复结果:`, updatedGift);
    return updatedGift;
  });
};

/**
 * 从 localStorage 加载数据并修复状态
 * @template T
 * @param {string} key - localStorage 的键名
 * @param {T} defaultValue - 默认值，当 localStorage 中没有数据时使用
 * @returns {T} 加载的数据或默认值
 */
const loadFromStorageAndFix = (key, defaultValue) => {
  const data = loadFromStorage(key, defaultValue);
  if (key === 'gifts') {
    console.log('修复前的礼物数据:', data);
    const fixedData = fixGiftStatuses(data);
    console.log('修复后的礼物数据:', fixedData);
    // 保存修复后的数据
    saveToStorage(key, fixedData);
    return fixedData;
  }
  return data;
};

/**
 * 保存数据到 localStorage
 * @template T
 * @param {string} key - localStorage 的键名
 * @param {T} data - 要保存的数据
 * @returns {boolean} 保存是否成功
 */
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`成功保存 ${key} 到 localStorage:`, data);
    return true;
  } catch (error) {
    console.error(`保存 ${key} 时出错:`, error);
    return false;
  }
};

// 从 localStorage 加载初始标签
/**
 * 从 localStorage 加载的标签数据
 * @type {Array<{id: string, name: string, category: string}>}
 */
const mockTags = loadFromStorage('tags', defaultTags);

/**
 * 默认礼物数据
 * @type {Array<{
 *   id: number,
 *   name: string,
 *   price: number,
 *   coverImage: string,
 *   description: string,
 *   tags: Array<string>,
 *   status: 'draft' | 'published',
 *   publishAt: string
 * }>}
 */
const defaultGifts = [
  {
    id: 1,
    name: '乐高星球大战千年隼',
    price: 999,
    coverImage: 'https://picsum.photos/400/300?random=1',
    description: '经典的星球大战系列模型',
    tags: ['INTJ', 'age18-25'],
    status: 'published',
    publishAt: '2024-03-15T08:00:00.000Z'
  }
];

/**
 * 模拟 API 接口
 * @type {{
 *   getGifts: (params?: {
 *     status?: string,
 *     tags?: Array<string>,
 *     keyword?: string
 *   }) => Array<Object>,
 *   getGiftById: (id: string | number) => Promise<Object | null>,
 *   saveGift: (giftData: Object) => Object | null,
 *   getTags: () => Array<Object>
 * }}
 */
const mockApi = {
  /**
   * 获取礼物列表
   * @param {Object} [params] - 查询参数
   * @param {string} [params.status] - 礼物状态筛选
   * @param {Array<string>} [params.tags] - 标签筛选
   * @param {string} [params.keyword] - 关键词搜索
   * @returns {Array<Object>} 礼物列表
   */
  getGifts: ({ status, tags, keyword } = {}) => {
    console.log('获取礼物列表，参数:', { status, tags, keyword });
    // 每次获取都进行修复
    const gifts = loadFromStorageAndFix('gifts', defaultGifts);
    let filteredGifts = [...gifts];

    if (status) {
      console.log('按状态筛选:', status);
      filteredGifts = filteredGifts.filter(gift => gift.status === status);
    }

    if (tags && tags.length > 0) {
      console.log('按标签筛选:', tags);
      filteredGifts = filteredGifts.filter(gift =>
        tags.some(tag => gift.tags.includes(tag))
      );
    }

    if (keyword) {
      console.log('按关键词搜索:', keyword);
      const lowercaseKeyword = keyword.toLowerCase();
      filteredGifts = filteredGifts.filter(gift =>
        gift.name.toLowerCase().includes(lowercaseKeyword) ||
        (gift.description && gift.description.toLowerCase().includes(lowercaseKeyword))
      );
    }

    console.log('筛选后的礼物列表:', filteredGifts);
    return filteredGifts;
  },

  /**
   * 获取单个礼物详情
   * @param {string | number} id - 礼物ID
   * @returns {Promise<Object | null>} 礼物详情或 null
   */
  getGiftById: async (id) => {
    console.log('获取礼物详情, id:', id);
    // 每次获取都进行修复
    const gifts = loadFromStorageAndFix('gifts', defaultGifts);
    const numericId = Number(id);
    const gift = gifts.find(g => g.id === numericId);
    
    if (!gift) {
      console.log('未找到礼物:', id);
      return null;
    }
    
    console.log('找到礼物:', gift);
    return gift;
  },

  /**
   * 保存礼物数据
   * @param {Object} giftData - 礼物数据
   * @returns {Object | null} 保存成功返回礼物数据，失败返回 null
   */
  saveGift: (giftData) => {
    console.log('开始保存礼物:', giftData);
    // 先获取并修复现有数据
    const gifts = loadFromStorageAndFix('gifts', defaultGifts);
    let updatedGift = { ...giftData };

    // 确保状态和发布时间的一致性
    if (updatedGift.status === 'published' && !updatedGift.publishAt) {
      updatedGift.publishAt = new Date().toISOString();
    } else if (updatedGift.status === 'draft') {
      updatedGift.publishAt = null;
    }

    console.log('处理后的礼物数据:', updatedGift);

    let newGifts;
    if (giftData.id) {
      const numericId = Number(giftData.id);
      updatedGift.id = numericId;
      console.log('更新现有礼物:', numericId);
      newGifts = gifts.map(gift =>
        gift.id === numericId ? updatedGift : gift
      );
    } else {
      const newId = Math.max(...gifts.map(g => g.id), 0) + 1;
      updatedGift = {
        ...updatedGift,
        id: newId
      };
      console.log('添加新礼物:', newId);
      newGifts = [...gifts, updatedGift];
    }

    const saved = saveToStorage('gifts', newGifts);
    if (!saved) {
      console.error('保存礼物失败');
      return null;
    }

    console.log('礼物保存成功:', updatedGift);
    return updatedGift;
  },

  /**
   * 获取标签列表
   * @returns {Array<Object>} 标签列表
   */
  getTags: () => {
    return loadFromStorage('tags', defaultTags);
  }
};

// 导出
export { mockApi, mockTags, defaultTags }; 