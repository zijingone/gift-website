import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GiftCard from '../components/GiftCard';
const api = require('../api');
import '../styles/main.css';

/**
 * 礼物列表页面组件
 * @component
 * @description 展示礼物列表，支持标签筛选和关键词搜索。
 * 礼物以卡片形式展示，可以展开查看详情或跳转到详情页。
 * 
 * @returns {JSX.Element} 礼物列表页面组件
 */
const GiftList = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [tags, setTags] = useState([]);
  const [expandedGiftId, setExpandedGiftId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * 获取标签列表
   * @function
   */
  useEffect(() => {
    const fetchTags = async () => {
      try {
        console.log('开始获取标签列表...');
        const data = await api.get('/api/tags');
        console.log('获取到的标签列表:', data);
        setTags(data);
      } catch (error) {
        console.error('获取标签列表失败:', error);
      }
    };

    fetchTags();
  }, []);

  /**
   * 获取礼物列表
   * @function
   */
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        console.log('开始获取礼物列表...');
        console.log('当前筛选条件:', { selectedTags, searchKeyword });
        
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedTags.length > 0) {
          params.append('tags', selectedTags.join(','));
        }
        if (searchKeyword) {
          params.append('keyword', searchKeyword);
        }

        console.log('请求参数:', params.toString());
        const data = await api.get(`/api/gifts?${params.toString()}`);
        console.log('获取到的礼物列表:', data);
        
        if (Array.isArray(data)) {
          console.log('设置礼物列表:', data);
          setGifts(data);
        } else {
          console.log('没有获取到礼物数据或数据为空');
          setGifts([]);
        }
      } catch (error) {
        console.error('获取礼物列表失败:', error);
        setGifts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [selectedTags, searchKeyword]);

  /**
   * 处理标签选择
   * @function
   * @param {string} tagId - 被点击的标签ID
   */
  const handleTagSelect = (tagId) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId];
      return newTags;
    });
  };

  /**
   * 处理搜索表单提交
   * @function
   * @param {React.FormEvent} e - 表单提交事件
   */
  const handleSearch = (e) => {
    e.preventDefault();
    // 搜索逻辑保持不变
  };

  /**
   * 清除所有筛选条件
   * @function
   */
  const handleClearFilters = () => {
    setSelectedTags([]);
    setSearchKeyword('');
  };

  /**
   * 处理礼物卡片点击
   * @function
   * @param {string} giftId - 被点击的礼物ID
   */
  const handleGiftClick = (giftId) => {
    setExpandedGiftId(expandedGiftId === giftId ? null : giftId);
  };

  /**
   * 按类别对标签进行分组
   * @type {Object.<string, Array<{_id: string, name: string, category: string}>>}
   */
  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

  /**
   * 获取分类的中文名称
   * @function
   * @param {string} category - 分类英文名
   * @returns {string} 分类中文名
   */
  const getCategoryName = (category) => {
    switch (category) {
      case 'MBTI':
        return 'MBTI类型';
      case '星座':
        return '星座';
      case '节日':
        return '节日';
      case '生日':
        return '生日';
      case '纪念日':
        return '纪念日';
      case '礼物':
        return '礼物';
      case '标签':
        return '标签';
      default:
        return category;
    }
  };

  return (
    <div className="gift-list-page">
      <aside className="gift-list-page__sidebar">
        <h2>礼物探索</h2>
        <h3>筛选条件</h3>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-bar__input"
            placeholder="搜索礼物、标签或关键词..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </form>

        <div className="filters">
          {Object.entries(groupedTags).map(([category, categoryTags]) => (
            <div key={category} className="tag-category">
              <h4>{getCategoryName(category)}</h4>
              <div className="tag-list">
                {categoryTags.map((tag) => (
                  <button
                    key={tag.id}
                    className={`tag ${selectedTags.includes(tag.id) ? 'active' : ''}`}
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedTags.length > 0 && (
          <button className="clear-filters" onClick={handleClearFilters}>
            清除筛选
          </button>
        )}
      </aside>

      <main className="gift-list-page__main">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : gifts.length > 0 ? (
          <div className="gift-list">
            {gifts.map((gift) => (
              <GiftCard
                key={gift._id}
                {...gift}
                onClick={() => handleGiftClick(gift._id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-gifts">暂无礼物</div>
        )}
      </main>

      {expandedGiftId && (
        <div className="gift-detail-overlay" onClick={() => setExpandedGiftId(null)}>
          <div className="gift-detail-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="gift-detail-modal__close"
              onClick={() => setExpandedGiftId(null)}
            >
              ×
            </button>
            {gifts.filter(gift => gift._id === expandedGiftId).map(gift => (
              <div key={`modal-${gift._id}`} className="gift-detail-modal__content">
                <div className="gift-detail-modal__header">
                  <div className="gift-detail-modal__image">
                    <img src={gift.coverImage} alt={gift.name} />
                  </div>
                  <div className="gift-detail-modal__info">
                    <h2>{gift.name}</h2>
                    <div className="gift-detail-modal__price">¥{gift.price}</div>
                    <div className="gift-detail-modal__tags">
                      {gift.tags?.map(tag => (
                        <span key={`tag-${tag._id}`} className="tag">{tag.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="gift-detail-modal__body">
                  {gift.description && (
                    <div className="gift-detail__description">
                      {gift.description.split('\n').map((paragraph, index) => (
                        <p key={`desc-${gift._id}-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  {gift.background && (
                    <div className="gift-detail__background">
                      <h3>背景故事</h3>
                      {gift.background.split('\n').map((paragraph, index) => (
                        <p key={`bg-${gift._id}-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  {gift.features && (
                    <div className="gift-detail__features">
                      <h3>产品特点</h3>
                      {gift.features.split('\n').map((paragraph, index) => (
                        <p key={`feat-${gift._id}-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftList; 