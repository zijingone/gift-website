import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

/**
 * 登录页面组件
 * @component
 */
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      setLoading(true);
      // 模拟登录验证
      if (formData.username === 'admin' && formData.password === 'admin123') {
        // 模拟生成 token
        const token = 'mock_token_' + Date.now();
        localStorage.setItem('token', token);
        navigate('/admin/gifts');
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      console.error('登录失败:', err);
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="login-form">
        <h1>管理员登录</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                username: e.target.value
              }))}
              placeholder="请输入用户名"
            />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              placeholder="请输入密码"
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 