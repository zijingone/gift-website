import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import axios from 'axios';

const { Option } = Select;

/**
 * 标签管理页面组件
 * @component
 */
const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [form] = Form.useForm();

  // 预定义的标签分类
  const categories = [
    'MBTI',
    '性别',
    '年龄',
    '关系',
    '价格',
    '礼物类别',
    '星座'
  ];

  // 预定义的标签数据
  const defaultTags = {
    'MBTI': ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'],
    '性别': ['男性', '女性', '通用'],
    '年龄': ['儿童', '青少年', '青年', '中年', '老年'],
    '关系': ['父母', '情侣', '朋友', '同事', '客户', '老师', '学生'],
    '价格': ['0-100', '100-300', '300-500', '500-1000', '1000以上'],
    '礼物类别': ['日常', '仪式感', '食物', '奢侈品', '电子产品', '美妆护肤', '游戏娱乐', '创新礼物'],
    '星座': ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
  };

  useEffect(() => {
    fetchTags();
  }, []);

  /**
   * 获取标签列表
   */
  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tags');
      setTags(response.data);
    } catch (error) {
      message.error('获取标签列表失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 初始化默认标签
   */
  const initializeDefaultTags = async () => {
    try {
      setLoading(true);
      for (const [category, tagNames] of Object.entries(defaultTags)) {
        for (const name of tagNames) {
          await axios.post('/api/tags', {
            name,
            category,
            description: `${category}类别下的${name}标签`
          });
        }
      }
      message.success('默认标签初始化成功');
      fetchTags();
    } catch (error) {
      message.error('初始化默认标签失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理标签创建或更新
   * @param {Object} values - 表单值
   */
  const handleSubmit = async (values) => {
    try {
      if (editingTag) {
        await axios.put(`/api/tags/${editingTag._id}`, values);
        message.success('标签更新成功');
      } else {
        await axios.post('/api/tags', values);
        message.success('标签创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      message.error(editingTag ? '更新标签失败' : '创建标签失败');
    }
  };

  /**
   * 处理标签删除
   * @param {string} id - 标签ID
   */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tags/${id}`);
      message.success('标签删除成功');
      fetchTags();
    } catch (error) {
      message.error('删除标签失败');
    }
  };

  /**
   * 打开编辑模态框
   * @param {Object} tag - 标签对象
   */
  const handleEdit = (tag) => {
    setEditingTag(tag);
    form.setFieldsValue(tag);
    setModalVisible(true);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: categories.map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个标签吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="tag-manager">
      <div className="tag-manager-header" style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" onClick={() => {
            setEditingTag(null);
            form.resetFields();
            setModalVisible(true);
          }}>
            添加标签
          </Button>
          {tags.length === 0 && (
            <Button onClick={initializeDefaultTags}>
              初始化默认标签
            </Button>
          )}
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingTag ? '编辑标签' : '添加标签'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingTag(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="标签分类"
            rules={[{ required: true, message: '请选择标签分类' }]}
          >
            <Select>
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTag ? '更新' : '创建'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingTag(null);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManager; 