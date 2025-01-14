import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../../mockData';
import ImageUpload from '../../components/ImageUpload';
import ContentModule from '../../components/ContentModule';

/**
 * 礼物编辑器组件
 * @component
 * @description 用于创建和编辑礼物信息的表单界面，支持图片上传、标签管理、内容模块编辑等功能
 */
function GiftEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    coverImage: '',
    tags: [],
    modules: [],
    status: 'draft',
    isScheduled: false,
    publishTime: ''
  });

  useEffect(() => {
    if (id) {
      loadGift();
    }
  }, [id]);

  /**
   * 加载礼物数据
   * @async
   * @function
   * @description 根据 URL 参数中的 ID 加载对应礼物的详细信息
   */
  const loadGift = async () => {
    try {
      const gift = await mockApi.getGiftById(id);
      if (gift) {
        setFormData({
          ...gift,
          coverImage: gift.image,
          status: gift.status || 'draft'
        });
      }
    } catch (error) {
      console.error('加载礼物失败:', error);
    }
  };

  /**
   * 提交表单处理函数
   * @async
   * @function
   * @param {string} action - 操作类型，可选值：'draft'（草稿）或 'publish'（发布）
   * @description 处理表单提交，支持保存草稿和发布两种操作，包含定时发布功能
   */
  const handleSubmit = async (action) => {
    try {
      setLoading(true);
      
      let status = action;
      let publishTime = formData.publishTime;
      
      if (action === 'publish') {
        if (formData.isScheduled && formData.publishTime) {
          status = 'scheduled';
        } else {
          status = 'published';
          publishTime = new Date().toISOString();
        }
      }

      const giftData = {
        ...formData,
        id: id || undefined,
        status,
        publishTime
      };

      await mockApi.saveGift(giftData);
      navigate('/admin/gifts');
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 表单字段变更处理函数
   * @function
   * @param {Object} e - 事件对象
   * @description 处理表单输入字段的变更，更新组件状态
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * 图片变更处理函数
   * @function
   * @param {Array<string>} images - 图片 URL 数组
   * @description 处理封面图片的上传和更新
   */
  const handleImageChange = (images) => {
    if (images && images.length > 0) {
      setFormData(prev => ({
        ...prev,
        coverImage: images[0]
      }));
    }
  };

  /**
   * 标签切换处理函数
   * @function
   * @param {string|number} tagId - 标签 ID
   * @description 处理标签的选择和取消选择
   */
  const handleTagToggle = (tagId) => {
    setFormData(prev => {
      const currentTags = prev.tags || [];
      const tagExists = currentTags.find(tag => tag.id === tagId);
      
      if (tagExists) {
        return {
          ...prev,
          tags: currentTags.filter(tag => tag.id !== tagId)
        };
      } else {
        const newTag = mockTags.find(tag => tag.id === tagId);
        return {
          ...prev,
          tags: [...currentTags, { id: newTag.id, name: newTag.name }]
        };
      }
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>{id ? '编辑礼物' : '新建礼物'}</h1>
        </div>

        <form className="gift-form" onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label>封面图片</label>
            <ImageUpload
              images={formData.coverImage ? [formData.coverImage] : []}
              onChange={handleImageChange}
              maxCount={1}
            />
          </div>

          <div className="form-group">
            <label>名称</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="输入礼物名称"
            />
          </div>

          <div className="form-group">
            <label>价格</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="输入价格"
            />
          </div>

          <div className="modules-container">
            {formData.modules.map((module, index) => (
              <ContentModule
                key={index}
                module={module}
                onUpdate={(updatedModule) => {
                  const newModules = [...formData.modules];
                  newModules[index] = updatedModule;
                  setFormData(prev => ({ ...prev, modules: newModules }));
                }}
                onDelete={() => {
                  setFormData(prev => ({
                    ...prev,
                    modules: prev.modules.filter((_, i) => i !== index)
                  }));
                }}
              />
            ))}
            <button
              type="button"
              className="add-module"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  modules: [...prev.modules, { title: '', content: '', images: [] }]
                }));
              }}
            >
              添加内容模块
            </button>
          </div>

          <div className="tags-group">
            <h3>选择标签</h3>
            {Object.entries(
              mockTags.reduce((acc, tag) => {
                if (!acc[tag.category]) acc[tag.category] = [];
                acc[tag.category].push(tag);
                return acc;
              }, {})
            ).map(([category, tags]) => (
              <div key={category} className="tag-category">
                <h4>{category}</h4>
                <div className="tag-list">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      className={`tag ${formData.tags?.some(t => t.id === tag.id) ? 'active' : ''}`}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="publish-options">
            <div className="schedule-option">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isScheduled"
                  checked={formData.isScheduled}
                  onChange={handleChange}
                />
                定时发布
              </label>
              {formData.isScheduled && (
                <input
                  type="datetime-local"
                  name="publishTime"
                  value={formData.publishTime}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  step="1800"
                />
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="draft-button"
                onClick={() => handleSubmit('draft')}
                disabled={loading}
              >
                保存草稿
              </button>
              <button
                type="button"
                className="publish-button"
                onClick={() => handleSubmit('publish')}
                disabled={loading}
              >
                {formData.isScheduled ? '定时发布' : '立即发布'}
              </button>
              {id && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => {
                    if (window.confirm('确定要删除这个礼物吗？')) {
                      // TODO: 实现删除功能
                      navigate('/admin/gifts');
                    }
                  }}
                >
                  删除
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GiftEditor; 