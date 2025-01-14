import React, { useState, useEffect } from 'react';
import { mockApi } from '../../mockData';

/**
 * 标签管理组件
 * @component
 * @description 提供标签的增删改查功能，支持按分类管理标签，包含添加新标签、编辑现有标签和删除标签的功能
 * @returns {JSX.Element} 标签管理界面
 */
const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [editingTag, setEditingTag] = useState(null);
  const [newTag, setNewTag] = useState({
    name: '',
    category: ''
  });

  useEffect(() => {
    const fetchTags = async () => {
      const tagsData = await mockApi.getTags();
      setTags(tagsData);
    };
    fetchTags();
  }, []);

  /**
   * 处理新标签表单字段变更
   * @function
   * @param {Object} e - 事件对象
   * @param {string} e.target.name - 字段名称
   * @param {string} e.target.value - 字段值
   */
  const handleNewTagChange = (e) => {
    const { name, value } = e.target;
    setNewTag(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * 处理编辑中标签的表单字段变更
   * @function
   * @param {Object} e - 事件对象
   * @param {string} e.target.name - 字段名称
   * @param {string} e.target.value - 字段值
   */
  const handleEditingTagChange = (e) => {
    const { name, value } = e.target;
    setEditingTag(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * 添加新标签
   * @async
   * @function
   * @description 验证并添加新标签到标签列表中
   */
  const addTag = async () => {
    if (!newTag.name || !newTag.category) {
      alert('请填写标签名称和分类');
      return;
    }

    // 在实际应用中，这里会调用API添加标签
    const newTagWithId = {
      ...newTag,
      id: Date.now().toString()
    };
    setTags(prev => [...prev, newTagWithId]);
    setNewTag({ name: '', category: '' });
  };

  /**
   * 开始编辑标签
   * @function
   * @param {Object} tag - 要编辑的标签对象
   * @param {string} tag.id - 标签ID
   * @param {string} tag.name - 标签名称
   * @param {string} tag.category - 标签分类
   */
  const startEditing = (tag) => {
    setEditingTag(tag);
  };

  /**
   * 取消编辑标签
   * @function
   * @description 清除当前编辑状态
   */
  const cancelEditing = () => {
    setEditingTag(null);
  };

  /**
   * 保存编辑后的标签
   * @async
   * @function
   * @param {Object} tag - 编辑后的标签对象
   * @param {string} tag.id - 标签ID
   * @param {string} tag.name - 标签名称
   * @param {string} tag.category - 标签分类
   */
  const saveTag = async (tag) => {
    if (!tag.name || !tag.category) {
      alert('请填写标签名称和分类');
      return;
    }

    // 在实际应用中，这里会调用API更新标签
    setTags(prev => prev.map(t => 
      t.id === tag.id ? tag : t
    ));
    setEditingTag(null);
  };

  /**
   * 删除标签
   * @async
   * @function
   * @param {string} tagId - 要删除的标签ID
   * @description 删除指定标签，并更新相关文章
   */
  const deleteTag = async (tagId) => {
    if (!window.confirm('确定要删除这个标签吗？删除后，使用该标签的文章也会被更新。')) {
      return;
    }

    // 在实际应用中，这里会调用API删除标签
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  // 按类别对标签进行分组
  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>标签管理</h1>
        
        <div className="tag-manager">
          <div className="add-tag-form">
            <h3>添加新标签</h3>
            <div className="form-row">
              <input
                type="text"
                name="name"
                value={newTag.name}
                onChange={handleNewTagChange}
                placeholder="标签名称"
              />
              <input
                type="text"
                name="category"
                value={newTag.category}
                onChange={handleNewTagChange}
                placeholder="标签分类"
              />
              <button
                type="button"
                className="add-tag-button"
                onClick={addTag}
              >
                添加
              </button>
            </div>
          </div>

          <div className="tag-list-manager">
            <h3>现有标签</h3>
            {Object.entries(groupedTags).map(([category, categoryTags]) => (
              <div key={category} className="tag-category-group">
                <h4>{category}</h4>
                <div className="tag-items">
                  {categoryTags.map(tag => (
                    <div key={tag.id} className="tag-item">
                      {editingTag?.id === tag.id ? (
                        <>
                          <input
                            type="text"
                            name="name"
                            value={editingTag.name}
                            onChange={handleEditingTagChange}
                          />
                          <input
                            type="text"
                            name="category"
                            value={editingTag.category}
                            onChange={handleEditingTagChange}
                          />
                          <div className="tag-actions">
                            <button
                              type="button"
                              className="save-tag-button"
                              onClick={() => saveTag(editingTag)}
                            >
                              保存
                            </button>
                            <button
                              type="button"
                              className="cancel-edit-button"
                              onClick={cancelEditing}
                            >
                              取消
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="tag-name">{tag.name}</span>
                          <div className="tag-actions">
                            <button
                              type="button"
                              className="edit-tag-button"
                              onClick={() => startEditing(tag)}
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              className="delete-tag-button"
                              onClick={() => deleteTag(tag.id)}
                            >
                              删除
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManager; 