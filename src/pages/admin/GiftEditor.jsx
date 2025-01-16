import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTags, mockApi } from '../../mockData';
import ImageUploader from '../../components/ImageUploader';
import '../../styles/admin.css';

/**
 * 礼物编辑器组件
 * @component
 * @description 用于创建新礼物或编辑现有礼物的表单组件。
 * 支持设置礼物的基本信息（名称、价格、描述等）、标签和状态。
 * 
 * @returns {JSX.Element} 礼物编辑器组件
 */
function GiftEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    coverImage: '',
    tags: [],
    status: 'draft',
    modules: [],
    isScheduled: false,
    publishAt: null
  });

  /**
   * 加载礼物数据
   * @function
   */
  useEffect(() => {
    const loadGift = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const gift = await mockApi.getGiftById(id);
        if (gift) {
          setFormData({
            name: gift.name,
            price: gift.price,
            description: gift.description || '',
            coverImage: gift.coverImage || '',
            tags: gift.tags || [],
            status: gift.status || 'draft',
            modules: gift.modules || [],
            isScheduled: gift.isScheduled || false,
            publishAt: gift.publishAt || null
          });
        }
      } catch (error) {
        console.error('加载礼物数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGift();
  }, [id]);

  /**
   * 处理表单提交
   * @function
   * @param {React.FormEvent} e - 表单提交事件
   */
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!formData.name || !formData.price) {
      alert('请填写礼物名称和价格');
      return;
    }

    try {
      setSaving(true);
      // 准备要保存的数据
      const giftData = {
        ...formData,
        price: Number(formData.price),
        // 确保状态和发布时间的一致性
        status: formData.status,
        publishAt: formData.status === 'published' ? new Date().toISOString() :
                  formData.status === 'scheduled' ? formData.publishAt :
                  null
      };

      if (id) {
        giftData.id = id;
      }

      console.log('准备保存的数据:', giftData); // 添加日志

      const savedGift = await mockApi.saveGift(giftData);
      if (savedGift) {
        // 根据状态设置不同的消息
        const message = formData.status === 'draft' 
          ? '已保存为草稿'
          : formData.status === 'scheduled'
            ? '已设置定时发布'
            : '发布成功';
        
        // 通过 state 传递消息
        navigate('/admin/gifts', { 
          state: { 
            message,
            type: 'success'
          } 
        });
      }
    } catch (error) {
      console.error('保存礼物失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  /**
   * 处理发布按钮点击
   * @function
   * @param {'draft' | 'published'} status - 要设置的状态
   */
  const handlePublish = async (status) => {
    // 准备要保存的数据
    const giftData = {
      ...formData,
      price: Number(formData.price)
    };

    // 根据操作类型设置状态和发布时间
    if (status === 'published') {
      if (formData.isScheduled && formData.publishAt) {
        // 如果设置了定时发布且有发布时间
        const publishDate = new Date(formData.publishAt);
        const now = new Date();
        
        if (publishDate > now) {
          // 如果发布时间在未来，设为定时发布
          giftData.status = 'scheduled';
          giftData.publishAt = formData.publishAt;
        } else {
          // 如果发布时间已过，设为立即发布
          giftData.status = 'published';
          giftData.publishAt = new Date().toISOString();
        }
      } else {
        // 立即发布
        giftData.status = 'published';
        giftData.publishAt = new Date().toISOString();
      }
    } else {
      // 保存草稿
      giftData.status = 'draft';
      giftData.publishAt = null;
    }

    if (id) {
      giftData.id = id;
    }

    try {
      setSaving(true);
      const savedGift = await mockApi.saveGift(giftData);
      if (savedGift) {
        const message = giftData.status === 'draft' 
          ? '已保存为草稿'
          : giftData.status === 'scheduled'
            ? '已设置定时发布'
            : '发布成功';
        
        navigate('/admin/gifts', { 
          state: { 
            message,
            type: 'success'
          } 
        });
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  /**
   * 处理表单字段变更
   * @function
   * @param {string} field - 字段名称
   * @param {string | number | Array} value - 字段值
   */
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 处理添加模块
   * @function
   */
  const handleAddModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, {
        id: Date.now(),
        sections: [
          { type: 'title', content: '' },
          { type: 'text', content: '' }
        ]
      }]
    }));
  };

  /**
   * 处理移除模块
   * @function
   * @param {number} moduleIndex - 要移除的模块索引
   */
  const handleRemoveModule = (moduleIndex) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, index) => index !== moduleIndex)
    }));
  };

  /**
   * 处理模块移动
   * @function
   * @param {number} moduleIndex - 要移动的模块索引
   * @param {'up' | 'down'} direction - 移动方向
   */
  const handleMoveModule = (moduleIndex, direction) => {
    if (direction === 'up' && moduleIndex === 0) return;
    if (direction === 'down' && moduleIndex === formData.modules.length - 1) return;

    setFormData(prev => {
      const newModules = [...prev.modules];
      const targetIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1;
      const temp = newModules[moduleIndex];
      newModules[moduleIndex] = newModules[targetIndex];
      newModules[targetIndex] = temp;
      return { ...prev, modules: newModules };
    });
  };

  /**
   * 处理添加章节
   * @function
   * @param {number} moduleIndex - 目标模块索引
   * @param {'title' | 'text' | 'image'} type - 章节类型
   */
  const handleAddSection = (moduleIndex, type) => {
    setFormData(prev => {
      const newModules = [...prev.modules];
      if (type === 'image') {
        const hasImage = newModules[moduleIndex].sections.some(section => section.type === 'image');
        if (hasImage) {
          return prev;
        }
      }
      newModules[moduleIndex].sections.push({ type, content: '' });
      return { ...prev, modules: newModules };
    });
  };

  /**
   * 处理移除章节
   * @function
   * @param {number} moduleIndex - 目标模块索引
   * @param {number} sectionIndex - 要移除的章节索引
   */
  const handleRemoveSection = (moduleIndex, sectionIndex) => {
    setFormData(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].sections = newModules[moduleIndex].sections
        .filter((_, index) => index !== sectionIndex);
      return { ...prev, modules: newModules };
    });
  };

  /**
   * 处理章节上移
   * @function
   * @param {number} moduleIndex - 目标模块索引
   * @param {number} sectionIndex - 要移动的章节索引
   */
  const handleMoveSectionUp = (moduleIndex, sectionIndex) => {
    if (sectionIndex === 0) return;
    setFormData(prev => {
      const newModules = [...prev.modules];
      const sections = [...newModules[moduleIndex].sections];
      const temp = sections[sectionIndex];
      sections[sectionIndex] = sections[sectionIndex - 1];
      sections[sectionIndex - 1] = temp;
      newModules[moduleIndex] = { ...newModules[moduleIndex], sections };
      return { ...prev, modules: newModules };
    });
  };

  /**
   * 处理章节下移
   * @function
   * @param {number} moduleIndex - 目标模块索引
   * @param {number} sectionIndex - 要移动的章节索引
   */
  const handleMoveSectionDown = (moduleIndex, sectionIndex) => {
    setFormData(prev => {
      const sections = prev.modules[moduleIndex].sections;
      if (sectionIndex === sections.length - 1) return prev;
      
      const newModules = [...prev.modules];
      const newSections = [...sections];
      const temp = newSections[sectionIndex];
      newSections[sectionIndex] = newSections[sectionIndex + 1];
      newSections[sectionIndex + 1] = temp;
      newModules[moduleIndex] = { ...newModules[moduleIndex], sections: newSections };
      return { ...prev, modules: newModules };
    });
  };

  /**
   * 处理章节内容变更
   * @function
   * @param {number} moduleIndex - 目标模块索引
   * @param {number} sectionIndex - 目标章节索引
   * @param {string} value - 新的内容值
   */
  const handleSectionChange = (moduleIndex, sectionIndex, value) => {
    setFormData(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].sections[sectionIndex].content = value;
      return { ...prev, modules: newModules };
    });
  };

  /**
   * 处理返回按钮点击
   * @function
   */
  const handleBack = async () => {
    // 如果表单有内容，保存为草稿
    if (formData.name || formData.price || formData.description || formData.coverImage || formData.tags.length > 0 || formData.modules.length > 0) {
      try {
        setSaving(true);
        const giftData = {
          ...formData,
          status: 'draft',
          price: formData.price ? Number(formData.price) : 0
        };

        if (id) {
          giftData.id = id;
        }

        await mockApi.saveGift(giftData);
      } catch (error) {
        console.error('保存草稿失败:', error);
      } finally {
        setSaving(false);
      }
    }
    
    navigate('/admin/gifts');
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="admin-container">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={handleBack}
          disabled={saving}
        >
          返回
        </button>
        <h1>{id ? '编辑礼物' : '新建礼物'}</h1>
      </div>
      
      <div className="gift-form">
        <div className="form-group">
          <label>封面图片</label>
          <ImageUploader
            value={formData.coverImage}
            onChange={(url) => handleFieldChange('coverImage', url)}
            maxSize={2}
            style={{ height: 300 }}
          />
        </div>

        <div className="form-group">
          <label>名称</label>
          <input 
            type="text" 
            placeholder="输入礼物名称"
            value={formData.name}
            onChange={e => handleFieldChange('name', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>价格</label>
          <input 
            type="number" 
            placeholder="输入价格"
            value={formData.price}
            onChange={e => handleFieldChange('price', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>标签</label>
          <div className="tag-group">
            {mockTags.map(tag => (
              <span 
                key={tag.id}
                className={`tag-item ${formData.tags.includes(tag.id) ? 'selected' : ''}`}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    tags: prev.tags.includes(tag.id)
                      ? prev.tags.filter(t => t !== tag.id)
                      : [...prev.tags, tag.id]
                  }));
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>内容模块</label>
          <div className="modules-container">
            {formData.modules.map((module, moduleIndex) => (
              <div key={module.id} className="content-module">
                <div className="module-header">
                  <span>模块 {moduleIndex + 1}</span>
                  <div className="module-actions">
                    <button 
                      onClick={() => handleMoveModule(moduleIndex, 'up')}
                      disabled={moduleIndex === 0}
                    >
                      上移
                    </button>
                    <button 
                      onClick={() => handleMoveModule(moduleIndex, 'down')}
                      disabled={moduleIndex === formData.modules.length - 1}
                    >
                      下移
                    </button>
                    <button onClick={() => handleRemoveModule(moduleIndex)}>删除</button>
                  </div>
                </div>

                <div className="module-sections">
                  {module.sections.map((section, sectionIndex) => {
                    let sectionContent = null;
                    
                    if (section.type === 'title') {
                      sectionContent = (
                        <input
                          type="text"
                          placeholder="输入标题"
                          value={section.content}
                          onChange={e => handleSectionChange(moduleIndex, sectionIndex, e.target.value)}
                        />
                      );
                    } else if (section.type === 'text') {
                      sectionContent = (
                        <textarea
                          placeholder="输入内容"
                          value={section.content}
                          onChange={e => handleSectionChange(moduleIndex, sectionIndex, e.target.value)}
                        />
                      );
                    } else if (section.type === 'image') {
                      sectionContent = (
                        <ImageUploader
                          value={section.content}
                          onChange={(url) => handleSectionChange(moduleIndex, sectionIndex, url)}
                          maxSize={2}
                        />
                      );
                    }

                    return (
                      <div key={sectionIndex} className="module-section">
                        <div className="section-header">
                          <span>{section.type === 'title' ? '标题' : 
                                section.type === 'text' ? '文本' : '图片'}</span>
                          <div className="section-actions">
                            <button 
                              onClick={() => handleMoveSectionUp(moduleIndex, sectionIndex)}
                              disabled={sectionIndex === 0}
                            >
                              上移
                            </button>
                            <button 
                              onClick={() => handleMoveSectionDown(moduleIndex, sectionIndex)}
                              disabled={sectionIndex === module.sections.length - 1}
                            >
                              下移
                            </button>
                            <button onClick={() => handleRemoveSection(moduleIndex, sectionIndex)}>
                              删除
                            </button>
                          </div>
                        </div>
                        {sectionContent}
                      </div>
                    );
                  })}
                </div>

                <div className="add-section-buttons">
                  <button onClick={() => handleAddSection(moduleIndex, 'title')}>
                    添加标题
                  </button>
                  <button onClick={() => handleAddSection(moduleIndex, 'text')}>
                    添加文本
                  </button>
                  <button onClick={() => handleAddSection(moduleIndex, 'image')}>
                    添加图片
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="add-module" onClick={handleAddModule}>
            添加内容模块
          </button>
        </div>

        <div className="form-group">
          <label>
            <input 
              type="checkbox"
              checked={formData.isScheduled}
              onChange={e => setFormData(prev => ({
                ...prev,
                isScheduled: e.target.checked,
                publishAt: e.target.checked ? prev.publishAt : null
              }))}
            />
            定时发布
          </label>
          {formData.isScheduled && (
            <div className="schedule-publish">
              <input
                type="datetime-local"
                value={formData.publishAt || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  publishAt: e.target.value
                }))}
              />
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button 
            className="save-draft"
            onClick={() => handlePublish('draft')}
            disabled={saving}
          >
            保存草稿
          </button>
          <button 
            className="publish-now"
            onClick={() => handlePublish('published')}
            disabled={saving}
          >
            {formData.isScheduled ? '定时发布' : '立即发布'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GiftEditor; 