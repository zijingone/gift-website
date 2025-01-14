import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import GiftList from './pages/GiftList'
import GiftDetail from './pages/GiftDetail'
import AdminGiftList from './pages/admin/GiftList'
import GiftEditor from './pages/admin/GiftEditor'
import TagManager from './pages/admin/TagManager'

/**
 * 应用程序主组件
 * @returns {JSX.Element} 应用程序主组件
 */
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/gifts" replace />} />
      <Route path="/gifts" element={<GiftList />} />
      <Route path="/gifts/:id" element={<GiftDetail />} />
      <Route path="/admin" element={<Navigate to="/admin/gifts" replace />} />
      <Route path="/admin/gifts" element={<AdminGiftList />} />
      <Route path="/admin/gifts/new" element={<GiftEditor />} />
      <Route path="/admin/gifts/:id/edit" element={<GiftEditor />} />
      <Route path="/admin/tags" element={<TagManager />} />
    </Routes>
  )
}

export default App 