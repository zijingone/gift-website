import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../mockData';

/**
 * 管理后台礼物列表组件
 * @component
 * @description 展示所有礼物的列表，支持按状态筛选（全部、已发布、草稿、定时发布），
 * 提供新建、编辑、预览等功能
 * @returns {JSX.Element} 礼物列表管理界面
 */
function AdminGiftList() {
  const [gifts, setGifts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft', 'scheduled'
  const navigate = useNavigate();

  useEffect(() => {
    loadGifts();
  }, [filter]);

  /**
   * 加载礼物列表数据
   * @async
   * @function
   * @description 根据当前筛选条件加载礼物列表
   */
  const loadGifts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await mockApi.getGifts(params);
      setGifts(data);
    } catch (error) {
      console.error('加载礼物列表失败:', error);
    }
  };

  /**
   * 获取状态显示文本
   * @function
   * @param {string} status - 礼物状态
   * @returns {string} 状态的中文显示文本
   */
  const getStatusText = (status) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      case 'scheduled': return '定时发布';
      default: return '未知';
    }
  };

  /**
   * 获取状态对应的 CSS 类名
   * @function
   * @param {string} status - 礼物状态
   * @returns {string} 对应的 CSS 类名
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'published': return 'status-published';
      case 'draft': return 'status-draft';
      case 'scheduled': return 'status-scheduled';
      default: return '';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>礼物管理</h1>
          <button 
            className="add-gift-button"
            onClick={() => navigate('/admin/gifts/new')}
          >
            新建礼物
          </button>
        </div>

        <div className="filter-bar">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          <button 
            className={`filter-button ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            已发布
          </button>
          <button 
            className={`filter-button ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            草稿
          </button>
          <button 
            className={`filter-button ${filter === 'scheduled' ? 'active' : ''}`}
            onClick={() => setFilter('scheduled')}
          >
            定时发布
          </button>
        </div>

        <table className="gift-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>价格</th>
              <th>状态</th>
              <th>发布时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map(gift => (
              <tr key={gift.id}>
                <td>{gift.name}</td>
                <td>¥{gift.price}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(gift.status)}`}>
                    {getStatusText(gift.status)}
                  </span>
                </td>
                <td>{gift.publishTime || '-'}</td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => navigate(`/admin/gifts/${gift.id}/edit`)}
                  >
                    编辑
                  </button>
                  <button 
                    className="preview-button"
                    onClick={() => navigate(`/gifts/${gift.id}`)}
                  >
                    预览
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminGiftList; 