# 中国象棋 Web 小游戏 🎮

一个基于 React + TypeScript 构建的现代化中国象棋 Web 游戏，具有智能 AI 对手和全局积分系统。

![GitHub](https://img.shields.io/github/license/tomgrade/ChineseChess)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)

## ✨ 特性

### 🎯 核心功能
- **三档难度选择**：小孩（简单）、中年人（中等）、老者（困难）
- **智能 AI 引擎**：基于 Minimax 算法，不同难度采用不同搜索深度
- **全局积分系统**：赢了加分，输了扣分，分数持久化保存
- **悔棋功能**：支持撤销操作

### 🎨 界面设计
- **中国传统风格**：精美的棋盘和棋子设计
- **楚河汉界**：河流波浪动画和金色发光文字
- **走棋高亮**：显示上一步 AI 的起始和目标位置
- **游戏结束界面**：精美的弹窗显示胜负和得分
- **响应式布局**：支持桌面端和移动端

### 🤖 AI 难度
| 难度 | 搜索深度 | 适合人群 |
|------|---------|---------|
| 小孩 | 1 层 | 初学者、儿童 |
| 中年人 | 3 层 | 有一定基础的玩家 |
| 老者 | 4 层 | 高手、专业玩家 |

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/tomgrade/ChineseChess.git
cd ChineseChess
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问游戏**
打开浏览器访问：http://localhost:5173

### 构建生产版本
```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产版本
```bash
npm run preview
```

## 🎮 游戏规则

### 基本规则
- 红方先行，双方轮流走棋
- 吃掉对方的将/帅即获胜
- 积分规则：
  - 胜利：+100 分
  - 失败：-100 分
  - 吃子：根据棋子价值获得相应分数

### 棋子价值
| 棋子 | 价值 | 说明 |
|------|------|------|
| 将/帅 | 10000 | 被吃即输 |
| 车 | 1000 | 威力最大 |
| 炮 | 500 | 需要炮架 |
| 马 | 450 | 走日字 |
| 相/象 | 200 | 不能过河 |
| 仕/士 | 200 | 保护将帅 |
| 兵/卒 | 100 | 过河后威力增强 |

## 📁 项目结构

```
ChineseChess/
├── src/
│   ├── components/
│   │   ├── ChessBoard.tsx      # 棋盘组件
│   │   ├── GamePiece.tsx       # 棋子组件
│   │   ├── GameControls.tsx    # 控制面板
│   │   ├── Game.tsx            # 主游戏组件
│   │   └── Game.css            # 样式文件
│   ├── utils/
│   │   ├── board.ts            # 棋盘逻辑和规则
│   │   └── ai.ts               # AI 引擎
│   ├── types/
│   │   └── index.ts            # 类型定义
│   ├── App.tsx                 # 应用入口
│   ├── main.tsx                # React 入口
│   └── index.css               # 全局样式
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ 技术栈

- **前端框架**: React 18.2.0
- **开发语言**: TypeScript 5.3.0
- **构建工具**: Vite 5.0.0
- **状态管理**: React Hooks
- **样式**: CSS3（渐变、动画、响应式）

## 🎯 开发说明

### 代码规范
- 使用 TypeScript 严格模式
- 组件采用函数式写法
- 使用 ESLint 进行代码检查

### 添加新功能
1. 在 `src/components` 创建新组件
2. 在 `src/utils` 添加工具函数
3. 在 `src/types` 定义类型
4. 更新主组件 `Game.tsx`

## 📝 更新日志

### v1.0.0 (2026-05-19)
- ✅ 初始版本发布
- ✅ 三档难度 AI
- ✅ 全局积分系统
- ✅ 精美 UI 设计
- ✅ 楚河汉界动画
- ✅ 走棋高亮显示
- ✅ 游戏结束界面
- ✅ 悔棋功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为中国象棋开源项目做出贡献的开发者！

## 📧 联系方式

- **项目地址**: https://github.com/tomgrade/ChineseChess
- **Issues**: https://github.com/tomgrade/ChineseChess/issues

---

**享受游戏！** 🎉
