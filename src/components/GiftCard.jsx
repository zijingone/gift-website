import React from 'react'
import PropTypes from 'prop-types'

/**
 * 礼物卡片组件
 * @component
 * @description 展示礼物的卡片组件，包含图片、名称、价格和标签信息。
 * 用于在礼物列表页面展示单个礼物的预览信息。
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.name - 礼物名称
 * @param {number} props.price - 礼物价格（单位：元）
 * @param {string} props.image - 礼物图片的 URL 地址
 * @param {Array<{id: string, name: string}>} props.tags - 标签列表
 * @param {Function} props.onClick - 点击卡片时的回调函数，通常用于导航到礼物详情页
 * 
 * @example
 * ```jsx
 * <GiftCard
 *   name="生日蛋糕"
 *   price={199}
 *   image="cake.jpg"
 *   tags={[
 *     { id: "1", name: "生日" },
 *     { id: "2", name: "甜点" }
 *   ]}
 *   onClick={() => navigate(`/gifts/${giftId}`)}
 * />
 * ```
 * 
 * @returns {JSX.Element} 礼物卡片组件
 */
const GiftCard = ({ name, price, image, tags, onClick }) => {
  return (
    <div className="gift-card" onClick={onClick}>
      <img src={image} alt={name} />
      <div className="gift-card__content">
        <h3 className="gift-card__title">{name}</h3>
        <div className="gift-card__price">¥{price}</div>
        <div className="gift-card__tags">
          {tags.map(tag => (
            <span key={tag.id} className="tag">{tag.name}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

GiftCard.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default GiftCard 