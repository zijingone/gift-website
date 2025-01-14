import React from 'react';

/**
 * 搜索栏组件
 * @component
 * @description 提供礼物搜索功能的搜索栏，支持关键词搜索和标签推荐。
 * 用户可以通过输入关键词搜索，也可以点击推荐标签进行快速筛选。
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.keyword - 搜索关键词
 * @param {Function} props.onSearch - 搜索提交时的回调函数，参数为当前搜索关键词
 * @param {Function} props.onChange - 搜索输入框值变化时的回调函数，参数为新的输入值
 * @param {Array<{id: string, name: string}>} [props.suggestedTags=[]] - 推荐标签列表
 * @param {Function} props.onTagClick - 点击推荐标签时的回调函数，参数为被点击的标签对象
 * 
 * @example
 * ```jsx
 * <SearchBar
 *   keyword="生日"
 *   onSearch={(keyword) => handleSearch(keyword)}
 *   onChange={(value) => setKeyword(value)}
 *   suggestedTags={[
 *     { id: "1", name: "生日" },
 *     { id: "2", name: "节日" }
 *   ]}
 *   onTagClick={(tag) => handleTagSearch(tag)}
 * />
 * ```
 * 
 * @returns {JSX.Element} 搜索栏组件
 */
const SearchBar = ({ 
  keyword, 
  onSearch, 
  onChange,
  suggestedTags = [],
  onTagClick,
}) => {
  /**
   * 处理搜索表单提交
   * @function
   * @param {Event} e - 表单提交事件对象
   * @private
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-bar__input"
          placeholder="搜索礼物名称、描述或标签..."
          value={keyword}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="submit" className="search-bar__button">
          搜索
        </button>
      </form>
      
      {suggestedTags.length > 0 && (
        <div className="search-suggestions">
          {suggestedTags.map((tag) => (
            <span
              key={tag.id}
              className="search-suggestion-tag"
              onClick={() => onTagClick(tag)}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 