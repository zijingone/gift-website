import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockApi } from '../../mockData';
import Toast from '../../components/Toast';
import '../../styles/admin.css';

/**
 * 礼物管理列表页面
 * @component
 */
const GiftList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [toast, setToast] = useState(null);

  // 处理路由状态中的消息
  useEffect(() => {
    if (location.state?.message) {
      setToast({
        message: location.state.message,
        type: location.state.type || 'info'
      });
      // 清除路由状态
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        console.log('开始获取礼物列表...');
        setLoading(true);
        
        // 获取所有礼物
        const data = await mockApi.getGifts({ keyword: searchKeyword });
        console.log('获取到的礼物:', data);
        
        // 在前端进行状态过滤
        let filteredGifts = Array.isArray(data) ? data : [];
        
        if (currentStatus !== 'all') {
          filteredGifts = filteredGifts.filter(gift => {
            if (currentStatus === 'scheduled') {
              return gift.status === 'scheduled';
            } else if (currentStatus === 'published') {
              return gift.status === 'published';
            } else if (currentStatus === 'draft') {
              return gift.status === 'draft';
            }
            return true;
          });
        }
        
        setGifts(filteredGifts);
      } catch (error) {
        console.error('获取礼物列表失败:', error);
        setGifts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [currentStatus, searchKeyword]);

  const handleEdit = (id) => {
    navigate(`/admin/gifts/${id}`);
  };

  const handlePreview = (id) => {
    navigate(`/gifts/${id}`);
  };

  return (
    <div className="admin-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <h1>礼物管理</h1>
      
      <div className="admin-header">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${currentStatus === 'all' ? 'active' : ''}`}
            onClick={() => setCurrentStatus('all')}
          >
            全部
          </button>
          <button 
            className={`filter-tab ${currentStatus === 'published' ? 'active' : ''}`}
            onClick={() => setCurrentStatus('published')}
          >
            已发布
          </button>
          <button 
            className={`filter-tab ${currentStatus === 'draft' ? 'active' : ''}`}
            onClick={() => setCurrentStatus('draft')}
          >
            草稿
          </button>
          <button 
            className={`filter-tab ${currentStatus === 'scheduled' ? 'active' : ''}`}
            onClick={() => setCurrentStatus('scheduled')}
          >
            定时发布
          </button>
        </div>

        <button className="add-gift-button" onClick={() => navigate('/admin/gifts/new')}>
          新建礼物
        </button>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="gift-table">
          <div className="gift-table-header">
            <div className="gift-table-cell">图片</div>
            <div className="gift-table-cell">名称</div>
            <div className="gift-table-cell">价格</div>
            <div className="gift-table-cell">状态</div>
            <div className="gift-table-cell">发布时间</div>
            <div className="gift-table-cell">操作</div>
          </div>

          {gifts.map((gift) => (
            <div key={gift.id} className="gift-table-row">
              <div className="gift-table-cell">
                {gift.coverImage ? (
                  <img src={gift.coverImage} alt={gift.name} />
                ) : (
                  <div className="no-image">无图片</div>
                )}
              </div>
              <div className="gift-table-cell">{gift.name || '无标题'}</div>
              <div className="gift-table-cell">¥{gift.price}</div>
              <div className="gift-table-cell">
                <span className={`status-tag ${gift.status}`}>
                  {gift.status === 'published' ? '已发布' : 
                   gift.status === 'draft' ? '草稿' : 
                   gift.status === 'scheduled' ? '定时发布' : '-'}
                </span>
              </div>
              <div className="gift-table-cell">
                {gift.status === 'scheduled' && gift.publishAt 
                  ? new Date(gift.publishAt).toLocaleString() 
                  : gift.status === 'published' 
                    ? new Date(gift.publishAt || Date.now()).toLocaleString()
                    : '-'
                }
              </div>
              <div className="gift-table-cell">
                <span className="action-link" onClick={() => handleEdit(gift.id)}>编辑</span>
                <span className="action-link" onClick={() => handlePreview(gift.id)}>预览</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GiftList; 