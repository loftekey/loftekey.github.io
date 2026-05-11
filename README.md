# 电子玫瑰经 (Digital Rosary)

基于 React + TypeScript 的电子玫瑰经应用。按星期自动选择奥迹（欢喜/痛苦/荣福/光明），80 步完整玫瑰经序列。

## 开发

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # 构建到 dist/
```

## 部署

GitHub Pages 自动从 `gh-pages` 分支部署。

## 结构

- `src/config/` — 数据类型、默认配置、步骤生成、本地存储
- `src/hooks/` — React hooks（状态管理）
- `src/components/` — UI 组件（TopBar、RosaryButton、ProgressIndicator 等）
- `public/legacy/` — 原版单体 HTML（已迁移为 React）
