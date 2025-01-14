import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GiftCard from '../components/GiftCard';
import { mockApi } from '../mockData';

/**
 * 礼物列表页面
 * @returns {JSX.Element} 礼物列表页面
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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await mockApi.getTags();
        setTags(data);
      } catch (error) {
        console.error('获取标签列表失败:', error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedTags.length > 0) {
          params.tags = selectedTags.join(',');
        }
        if (searchKeyword) {
          params.search = searchKeyword;
        }

        const data = await mockApi.getGifts(params);
        setGifts(data);
      } catch (error) {
        console.error('获取礼物列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [selectedTags, searchKeyword]);

  const handleTagSelect = (tagId) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId];
      return newTags;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 搜索逻辑保持不变
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSearchKeyword('');
  };

  const handleGiftClick = (giftId) => {
    setExpandedGiftId(expandedGiftId === giftId ? null : giftId);
  };

  // 按类别对标签进行分组
  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

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
        ) : (
          <div className="gift-list">
            {gifts.map((gift) => (
              <GiftCard
                key={gift.id}
                {...gift}
                onClick={() => handleGiftClick(gift.id)}
              />
            ))}
          </div>
        )}
      </main>

      {expandedGiftId && (
        <div className="gift-detail-overlay">
          <div className="gift-detail-modal">
            <button 
              className="gift-detail-modal__close"
              onClick={() => setExpandedGiftId(null)}
            >
              ×
            </button>
            {gifts.map(gift => gift.id === expandedGiftId && (
              <div key={gift.id} className="gift-detail-modal__content">
                <div className="gift-detail-modal__header">
                  <img src={gift.image} alt={gift.name} />
                  <div className="gift-detail-modal__info">
                    <h2>{gift.name}</h2>
                    <div className="gift-detail-modal__price">¥{gift.price}</div>
                    <div className="gift-detail-modal__tags">
                      {gift.tags.map(tag => (
                        <span key={tag.id} className="tag">{tag.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="gift-detail-modal__body">
                  <div className="gift-detail__description">
                    {gift.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  {gift.background && (
                    <div className="gift-detail__background">
                      <h3>背景故事</h3>
                      {gift.background.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  {gift.features && (
                    <div className="gift-detail__features">
                      <h3>产品特点</h3>
                      {gift.features.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
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