/**
 * 图片上传组件
 * @component
 * @param {Object} props - 组件属性
 * @param {string} [props.value] - 当前图片URL
 * @param {Function} props.onChange - 图片变更回调函数
 * @param {string} [props.className] - 自定义类名
 * @param {Object} [props.style] - 自定义样式
 * @param {number} [props.maxSize=5] - 最大文件大小(MB)
 * @param {string[]} [props.acceptedTypes=['image/jpeg', 'image/png', 'image/gif']] - 接受的文件类型
 */
import React, { useState, useRef } from 'react';
import '../styles/ImageUploader.css';

function ImageUploader({
  value,
  onChange,
  className = '',
  style,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif']
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  /**
   * 处理文件选择
   * @param {File} file - 选择的文件
   */
  const handleFile = async (file) => {
    setError('');

    // 验证文件类型
    if (!acceptedTypes.includes(file.type)) {
      setError('不支持的文件类型');
      return;
    }

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSize}MB`);
      return;
    }

    try {
      setUploading(true);
      // 模拟上传进度
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('file', file);

      // 从 localStorage 获取 token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('未登录或登录已过期');
      }

      // 发送上传请求
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '上传失败');
      }

      clearInterval(interval);
      setProgress(100);
      // 根据响应格式获取文件 URL
      const fileUrl = result.data?.fileUrl || result.url;
      if (!fileUrl) {
        throw new Error('上传成功但未获取到文件 URL');
      }
      onChange(fileUrl);
    } catch (err) {
      setError(err.message || '上传失败，请重试');
      console.error('上传失败:', err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  /**
   * 处理拖拽事件
   * @param {React.DragEvent} e - 拖拽事件对象
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  /**
   * 处理文件放置
   * @param {React.DragEvent} e - 拖拽事件对象
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div 
      className={`image-uploader ${className} ${isDragging ? 'dragging' : ''}`}
      style={style}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFile(file);
          }
        }}
        style={{ display: 'none' }}
      />

      {value ? (
        <div className="preview">
          <img src={value} alt="预览" />
          <button 
            className="remove-button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
          >
            删除
          </button>
        </div>
      ) : (
        <div className="upload-content">
          {uploading ? (
            <div className="upload-progress">
              <div 
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
              <span>{progress}%</span>
            </div>
          ) : (
            <>
              <div className="upload-icon">+</div>
              <div className="upload-text">
                点击或拖拽上传图片<br />
                支持 jpg、png、gif 格式
                {maxSize && <div className="size-limit">大小不超过 {maxSize}MB</div>}
              </div>
            </>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ImageUploader; 