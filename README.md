# 飞书克隆项目

基于 Next.js 15 打造的现代化飞书协同办公平台克隆版。采用 React 18 构建，结合 NextUI 和 Tailwind CSS 实现精美的用户界面。

## ✨ 特性

- 🎨 现代化 UI：基于 NextUI 组件的精美响应式界面
- 📝 Markdown 支持：集成 react-md-editor 的编辑预览功能
- 🌓 主题切换：支持深色/浅色主题一键切换
- 🎯 拖拽操作：基于 @hello-pangea/dnd 实现的流畅拖拽体验
- 📊 数据可视化：使用 Recharts 构建直观的数据图表
- 🔄 状态管理：采用 Zustand 实现高效的状态管理
- 🚀 开发体验：支持 Turbopack 的快速开发环境

## 🚀 快速开始

确保你的开发环境中已安装 Node.js 16.8 或更高版本。

1. 克隆项目
```bash
git clone [your-repository-url]
cd feishu-clone
```

2. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🛠️ 技术栈

- **框架：** Next.js 15
- **UI 组件：** NextUI v2
- **样式解决方案：** Tailwind CSS
- **状态管理：** Zustand
- **拖拽功能：** @hello-pangea/dnd
- **数据可视化：** Recharts
- **主题支持：** next-themes

## 📦 项目结构

```
src/
├── app/          # Next.js 应用路由
├── components/   # 可复用组件
├── hooks/        # 自定义 Hooks
├── lib/          # 工具函数和配置
├── store/        # Zustand 状态管理
└── styles/       # 全局样式
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

1. Fork 项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
