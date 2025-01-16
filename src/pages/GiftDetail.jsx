import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockApi } from '../mockData';

const GiftDetail = () => {
  const { id } = useParams();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGift = async () => {
      try {
        const data = await mockApi.getGiftById(id);
        setGift(data);
      } catch (error) {
        console.error('加载礼物详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGift();
  }, [id]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!gift) {
    return <div className="error">礼物不存在</div>;
  }

  return (
    <div className="gift-detail">
      <div className="gift-detail__header">
        <h1>{gift.name}</h1>
        <div className="gift-detail__price">¥{gift.price}</div>
      </div>

      <div className="gift-detail__image">
        {gift.coverImage && <img src={gift.coverImage} alt={gift.name} />}
      </div>

      {gift.tags && gift.tags.length > 0 && (
        <div className="gift-detail__tags">
          {gift.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {gift.description && (
        <div className="gift-detail__description">
          {gift.description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}

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

      {gift.modules && gift.modules.length > 0 && (
        <div className="gift-detail__modules">
          {gift.modules.map((module, index) => (
            <div key={index} className="content-module">
              {module.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="module-section">
                  {section.type === 'title' && <h3>{section.content}</h3>}
                  {section.type === 'text' && <p>{section.content}</p>}
                  {section.type === 'image' && section.content && (
                    <img src={section.content} alt={`内容图片 ${sectionIndex + 1}`} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GiftDetail; 