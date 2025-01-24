import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Tag, Spin, Empty, Input, Button } from 'antd';
import axios from 'axios';
import '../styles/main.css';

const { Search } = Input;

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
        const response = await axios.get('/api/tags');
        console.log('获取到的标签列表:', response.data);
        setTags(response.data);
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
        const response = await axios.get('/api/gifts', {
          params: {
            tags: selectedTags.join(','),
            keyword: searchKeyword,
            status: 'published'
          }
        });
        console.log('获取到的礼物列表:', response.data);
        
        if (Array.isArray(response.data)) {
          console.log('设置礼物列表:', response.data);
          setGifts(response.data);
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
  const handleSearch = (value) => {
    setSearchKeyword(value);
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
   * @param {number} giftId - 被点击的礼物ID
   */
  const handleGiftClick = (giftId) => {
    navigate(`/gifts/${giftId}`);
  };

  /**
   * 按类别对标签进行分组
   * @type {Object.<string, Array<{id: string, name: string, category: string}>>}
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

  /**
   * 将标签ID转换为完整的标签对象
   * @function
   * @param {Array<string>} tagIds - 标签ID列表
   * @returns {Array<{id: string, name: string}>} 标签对象列表
   */
  const getTagObjects = (tagIds) => {
    return tagIds.map(id => tags.find(tag => tag.id === id)).filter(Boolean);
  };

  return (
    <div className="gift-list-container">
      <div className="search-section">
        <Search
          placeholder="搜索礼物..."
          allowClear
          enterButton="搜索"
          size="large"
          onSearch={handleSearch}
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : gifts.length > 0 ? (
        <div className="gift-grid">
          {gifts.map((gift) => (
            <Card
              key={gift._id}
              hoverable
              cover={gift.coverImage && <img alt={gift.name} src={gift.coverImage} />}
              onClick={() => handleGiftClick(gift._id)}
              className="gift-card"
            >
              <Card.Meta
                title={gift.name}
                description={gift.description}
              />
              <div className="gift-tags">
                {gift.tags && gift.tags.map(tag => (
                  <Tag key={tag._id}>{tag.name}</Tag>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty description="暂无礼物" />
      )}
    </div>
  );
};

export default GiftList; 