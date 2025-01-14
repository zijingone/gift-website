const express = require('express');
const router = express.Router();
const {
  getTags,
  createTag,
  updateTag,
  deleteTag
} = require('../controllers/tags');
const { protect, authorize } = require('../middleware/auth');

// 公开路由
router.get('/', getTags);

// 需要管理员权限的路由
router.post('/', protect, authorize('admin'), createTag);
router.put('/:id', protect, authorize('admin'), updateTag);
router.delete('/:id', protect, authorize('admin'), deleteTag);

module.exports = router; 