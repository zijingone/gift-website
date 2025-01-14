import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * 图片上传组件
 * @component
 * @description 支持拖拽和点击上传图片，支持多种布局方式，可限制上传数量，
 * 支持图片预览和删除功能
 * @param {Object} props - 组件属性
 * @param {string[]} [props.images=[]] - 已上传的图片 URL 列表
 * @param {Function} props.onChange - 图片变化时的回调函数，参数为新的图片 URL 列表
 * @param {number} [props.maxCount=1] - 最大上传图片数量
 * @param {('single'|'double'|'triple')} [props.layout='single'] - 图片布局方式
 * @returns {JSX.Element} 图片上传组件
 */
const ImageUpload = ({ images = [], onChange, maxCount = 1, layout = 'single' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * 处理拖拽进入事件
   * @function
   * @param {DragEvent} e - 拖拽事件对象
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * 处理拖拽离开事件
   * @function
   * @param {DragEvent} e - 拖拽事件对象
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * 处理文件拖放事件
   * @async
   * @function
   * @param {DragEvent} e - 拖放事件对象
   */
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  /**
   * 处理文件选择事件
   * @async
   * @function
   * @param {Event} e - 文件选择事件对象
   */
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  /**
   * 上传文件到服务器
   * @async
   * @function
   * @param {File[]} files - 要上传的文件列表
   * @description 处理文件上传逻辑，包括文件验证、上传和错误处理
   */
  const uploadFiles = async (files) => {
    // 检查文件数量限制
    if (images.length + files.length > maxCount) {
      alert(`最多只能上传 ${maxCount} 张图片`);
      return;
    }

    // 检查文件类型
    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      alert('只支持 jpg、jpeg、png、gif 格式的图片');
      return;
    }

    try {
      const formData = new FormData();
      if (maxCount === 1) {
        formData.append('file', validFiles[0]);
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          onChange([result.data.fileUrl]);
        } else {
          alert(result.error || '上传失败');
        }
      } else {
        validFiles.forEach(file => formData.append('files', file));
        const response = await fetch('http://localhost:5000/api/upload/multiple', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          onChange([...images, ...result.data.map(file => file.fileUrl)]);
        } else {
          alert(result.errors?.join('\n') || '上传失败');
        }
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败,请重试');
    }
  };

  /**
   * 删除已上传的图片
   * @function
   * @param {number} index - 要删除的图片索引
   */
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className={`image-upload ${layout}-layout`}>
      {images.map((url, index) => (
        <div key={url} className="image-preview">
          <img src={url} alt={`上传图片 ${index + 1}`} />
          <button 
            type="button" 
            className="remove-button"
            onClick={() => removeImage(index)}
          >
            删除
          </button>
        </div>
      ))}
      
      {images.length < maxCount && (
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/jpeg,image/jpg,image/png,image/gif"
            multiple={maxCount > 1}
            onChange={handleFileSelect}
          />
          <div className="upload-hint">
            <span>点击或拖拽上传图片</span>
            <small>支持 jpg、jpeg、png、gif 格式</small>
          </div>
        </div>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  maxCount: PropTypes.number,
  layout: PropTypes.oneOf(['single', 'double', 'triple'])
};

export default ImageUpload; 