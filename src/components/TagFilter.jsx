import React from 'react';

/**
 * 标签筛选组件
 * @component
 * @description 提供按类别分组的标签筛选功能，支持多选标签进行礼物筛选。
 * 标签按照类别分组展示，每个标签可以切换选中状态。
 * 
 * @param {Object} props - 组件属性
 * @param {Array<{id: string, name: string, category: string}>} props.tags - 可选标签列表
 * @param {Array<string>} props.selectedTags - 已选中的标签ID列表
 * @param {Function} props.onTagSelect - 标签选择回调函数，参数为被点击标签的ID
 * 
 * @example
 * ```jsx
 * <TagFilter
 *   tags={[
 *     { id: "1", name: "生日", category: "场合" },
 *     { id: "2", name: "节日", category: "场合" },
 *     { id: "3", name: "男士", category: "受众" }
 *   ]}
 *   selectedTags={["1", "3"]}
 *   onTagSelect={(tagId) => handleTagSelect(tagId)}
 * />
 * ```
 * 
 * @returns {JSX.Element} 标签筛选组件
 */
const TagFilter = ({ tags, selectedTags, onTagSelect }) => {
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

  return (
    <div className="tag-filter">
      {Object.entries(groupedTags).map(([category, categoryTags]) => (
        <div key={category} className="tag-filter__category">
          <h4 className="tag-filter__category-title">{category}</h4>
          <div className="tag-filter__tags">
            {categoryTags.map((tag) => (
              <button
                key={tag.id}
                className={`tag-filter__tag ${
                  selectedTags.includes(tag.id) ? 'active' : ''
                }`}
                onClick={() => onTagSelect(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagFilter; 