import React from 'react';
import PropTypes from 'prop-types';
import ImageUpload from './ImageUpload';

/**
 * 内容模块组件
 * @component
 * @description 用于编辑礼物详情中的内容模块，包含标题、图片和文本内容。
 * 支持多种图片布局方式，可以添加和删除整个模块。
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.title - 模块标题
 * @param {string} props.content - 模块文本内容
 * @param {string[]} [props.images=[]] - 模块图片 URL 列表
 * @param {Function} props.onTitleChange - 标题变更回调函数
 * @param {Function} props.onContentChange - 内容变更回调函数
 * @param {Function} props.onImagesChange - 图片变更回调函数
 * @param {Function} props.onRemove - 删除模块回调函数
 * @param {('single'|'double'|'triple')} [props.imageLayout='single'] - 图片布局方式：
 * - single: 单图布局
 * - double: 双图布局
 * - triple: 三图布局
 * 
 * @example
 * ```jsx
 * <ContentModule
 *   title="商品介绍"
 *   content="这是一段商品介绍内容"
 *   images={['image1.jpg', 'image2.jpg']}
 *   onTitleChange={(newTitle) => handleTitleChange(newTitle)}
 *   onContentChange={(newContent) => handleContentChange(newContent)}
 *   onImagesChange={(newImages) => handleImagesChange(newImages)}
 *   onRemove={() => handleRemove()}
 *   imageLayout="double"
 * />
 * ```
 * 
 * @returns {JSX.Element} 内容模块组件
 */
const ContentModule = ({
  title,
  content,
  images = [],
  onTitleChange,
  onContentChange,
  onImagesChange,
  onRemove,
  imageLayout = 'single'
}) => {
  return (
    <div className="content-module">
      <div className="module-header">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="输入模块标题"
          className="module-title-input"
        />
        <button
          type="button"
          onClick={onRemove}
          className="remove-module"
        >
          删除模块
        </button>
      </div>
      
      <ImageUpload
        images={images}
        onChange={onImagesChange}
        maxCount={imageLayout === 'single' ? 1 : imageLayout === 'double' ? 2 : 3}
        layout={imageLayout}
      />

      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="输入模块内容"
        className="module-content"
        rows="6"
      />
    </div>
  );
};

ContentModule.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  onTitleChange: PropTypes.func.isRequired,
  onContentChange: PropTypes.func.isRequired,
  onImagesChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  imageLayout: PropTypes.oneOf(['single', 'double', 'triple'])
};

export default ContentModule; 