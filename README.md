# 维修报价系统

一个完整的维修报价管理系统，包含用户端、管理端和后端API。

## 项目结构

```
system/
├── backend/          # 后端API服务 (NestJS)
├── frontend-user/    # 用户端前端 (Vue 3 + TypeScript)
├── frontend-admin/   # 管理端前端 (Vue 3 + TypeScript)
├── mysql/           # MySQL数据库文件
├── import_data.py   # 数据导入脚本
└── *.csv           # 示例数据文件
```

## 功能特性

### 用户端 (frontend-user)
- 学校选择和维修项目浏览
- 维修项目报价和计价单生成
- 响应式设计，支持移动端

### 管理端 (frontend-admin)
- 学校信息管理
- 维修项目管理
- 报价单审核和管理
- 数据统计和报表

### 后端API (backend)
- RESTful API设计
- JWT身份认证
- MySQL数据库集成
- 数据验证和错误处理

## 技术栈

- **前端**: Vue 3, TypeScript, Element Plus, Vite
- **后端**: NestJS, TypeScript, TypeORM
- **数据库**: MySQL 8.0
- **工具**: Pinia (状态管理), Vue Router

## 快速开始

### 环境要求
- Node.js 16+
- MySQL 8.0+
- npm 或 yarn

### 安装和运行

1. **后端服务**
```bash
cd backend
npm install
npm run start:dev
```

2. **用户端前端**
```bash
cd frontend-user
npm install
npm run dev
```

3. **管理端前端**
```bash
cd frontend-admin
npm install
npm run dev
```

### 访问地址
- 用户端: http://localhost:5173
- 管理端: http://localhost:3001
- 后端API: http://localhost:3000

## 数据库配置

1. 安装MySQL 8.0
2. 创建数据库
3. 配置后端 `.env` 文件
4. 运行数据迁移

## 开发文档

详细的开发文档请参考 `维修上报系统开发文档.md`

## 许可证

MIT License
