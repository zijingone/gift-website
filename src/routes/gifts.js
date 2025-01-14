const express = require('express');
const router = express.Router();
const {
  getGifts,
  getGift,
  createGift,
  updateGift,
  deleteGift
} = require('../controllers/gifts');
const { protect, authorize } = require('../middleware/auth');

// 公开路由
router.get('/', getGifts);
router.get('/:id', getGift);

// 需要管理员权限的路由
router.post('/', protect, authorize('admin'), createGift);
router.put('/:id', protect, authorize('admin'), updateGift);
router.delete('/:id', protect, authorize('admin'), deleteGift);

module.exports = router; 