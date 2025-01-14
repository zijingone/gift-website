import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../mockData';
import GiftCard from '../components/GiftCard';

/**
 * 礼物详情页面
 * @returns {JSX.Element} 礼物详情页面
 */
const GiftDetail = () => {
  const [gift, setGift] = useState(null);
  const [relatedGifts, setRelatedGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGiftDetails = async () => {
      try {
        setLoading(true);
        const giftData = await mockApi.getGiftById(id);
        const relatedData = await mockApi.getRelatedGifts(id);
        setGift(giftData);
        setRelatedGifts(relatedData);
      } catch (error) {
        console.error('获取礼物详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!gift) {
    return <div className="error">未找到该礼物</div>;
  }

  return (
    <div className="gift-detail">
      <div className="gift-detail__main">
        <img src={gift.image} alt={gift.name} className="gift-detail__image" />
        <div className="gift-detail__content">
          <h1 className="gift-detail__title">{gift.name}</h1>
          <div className="gift-detail__price">¥{gift.price}</div>
          <div className="gift-detail__tags">
            {gift.tags.map(tag => (
              <span key={tag.id} className="tag">{tag.name}</span>
            ))}
          </div>
          <p className="gift-detail__description">{gift.description}</p>
        </div>
      </div>

      {relatedGifts.length > 0 && (
        <div className="gift-detail__related">
          <h2>相关推荐</h2>
          <div className="gift-list">
            {relatedGifts.map(relatedGift => (
              <GiftCard
                key={relatedGift.id}
                {...relatedGift}
                onClick={() => navigate(`/gifts/${relatedGift.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftDetail; 