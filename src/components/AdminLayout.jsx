import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { GiftOutlined, TagsOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

/**
 * 管理后台布局组件
 * @component
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const menuItems = [
    {
      key: '/admin/gifts',
      icon: <GiftOutlined />,
      label: '礼物管理'
    },
    {
      key: '/admin/tags',
      icon: <TagsOutlined />,
      label: '标签管理'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      navigate(key);
    }
  };

  return (
    <Layout className="admin-layout">
      <Header className="admin-header">
        <div className="logo">礼物导航后台管理</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Header>
      <Content className="admin-content">
        {children}
      </Content>
    </Layout>
  );
};

export default AdminLayout; 