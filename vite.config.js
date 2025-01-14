import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gift-website/', // 设置基础路径为仓库名
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
}); 