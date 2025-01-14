const User = require('../models/User');

/**
 * @desc    注册用户
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 创建用户
    const user = await User.create({
      username,
      password
    });

    // 生成token并返回
    const token = user.getSignedToken();

    res.status(201).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    用户登录
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 验证用户名和密码是否存在
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: '请提供用户名和密码'
      });
    }

    // 查找用户
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    // 生成token并返回
    const token = user.getSignedToken();

    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    获取当前登录用户信息
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
}; 