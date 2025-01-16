import React, { useEffect } from 'react';
import '../styles/toast.css';

/**
 * Toast 提示组件
 * @component
 * @param {Object} props - 组件属性
 * @param {string} props.message - 提示消息
 * @param {string} props.type - 提示类型（success/error/info）
 * @param {Function} props.onClose - 关闭回调函数
 * @returns {JSX.Element} Toast组件
 */
function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
}

export default Toast; 