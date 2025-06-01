# 维修报价管理系统

一个完整的维修报价管理系统，包含用户端、管理端和后端API服务。系统支持学校维修项目管理、报价单生成、数据统计等功能。

## 项目架构

### 整体架构
```
维修报价管理系统
├── 前端层
│   ├── 用户端 (frontend-user) - Vue 3 + TypeScript
│   └── 管理端 (frontend-admin) - Vue 3 + TypeScript
├── 后端层
│   └── API服务 (backend) - NestJS + TypeScript
└── 数据层
    └── MySQL 8.0 数据库
```

### 项目结构
```
system/
├── backend/                 # 后端API服务
│   ├── src/
│   │   ├── auth/           # 认证模块
│   │   ├── school/         # 学校管理模块
│   │   ├── repair-item/    # 维修项目模块
│   │   ├── quotation/      # 报价单模块
│   │   ├── statistics/     # 统计模块
│   │   └── database/       # 数据库配置和种子数据
│   ├── package.json
│   ├── .env               # 环境配置文件
│   └── tsconfig.json
├── frontend-user/          # 用户端前端
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── components/    # 通用组件
│   │   ├── api/          # API接口
│   │   ├── stores/       # 状态管理
│   │   └── router/       # 路由配置
│   ├── package.json
│   └── vite.config.ts
├── frontend-admin/         # 管理端前端
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── layout/        # 布局组件
│   │   ├── api/          # API接口
│   │   ├── stores/       # 状态管理
│   │   └── router/       # 路由配置
│   ├── package.json
│   └── vite.config.ts
├── mysql/                  # MySQL数据库文件
├── import_data.py         # 数据导入脚本
├── *.csv                  # 示例数据文件
└── README.md
```

## 功能特性

### 用户端 (frontend-user)
- 🏫 学校选择和信息查看
- 🔧 维修项目浏览和搜索
- 💰 维修项目报价和计价单生成
- 📱 响应式设计，支持移动端访问
- 📋 报价单历史记录查看

### 管理端 (frontend-admin)
- 🏢 学校信息管理 (增删改查)
- 🛠️ 维修项目管理 (增删改查)
- 📊 报价单审核和管理
- 📈 数据统计和报表展示
- 📤 Excel数据导出功能
- 📥 CSV批量导入功能

### 后端API (backend)
- 🚀 RESTful API设计
- 🔐 JWT身份认证系统
- 🗄️ MySQL数据库集成
- ✅ 数据验证和错误处理
- 📁 文件上传和处理
- 📊 统计数据计算

## 技术栈

### 前端技术
- **框架**: Vue 3.x
- **语言**: TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios

### 后端技术
- **框架**: NestJS
- **语言**: TypeScript
- **ORM**: TypeORM
- **数据库**: MySQL 8.0
- **验证**: class-validator
- **文件处理**: Multer
- **Excel处理**: ExcelJS

## 部署基本条件

### 系统要求
- **操作系统**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- **Node.js**: 16.x 或更高版本
- **npm**: 8.x 或更高版本 (或 yarn 1.22+)
- **MySQL**: 8.0 或更高版本
- **内存**: 最少 4GB RAM
- **存储**: 最少 2GB 可用空间

### 开发环境要求
- **代码编辑器**: VS Code (推荐) 或其他支持TypeScript的编辑器
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+
- **Git**: 用于版本控制

## 详细启动流程

### 1. 环境准备

#### 1.1 安装Node.js
```bash
# 检查Node.js版本
node --version  # 应该 >= 16.0.0
npm --version   # 应该 >= 8.0.0
```

#### 1.2 安装MySQL
1. 下载并安装 MySQL 8.0
2. 启动MySQL服务
3. 创建数据库:
```sql
CREATE DATABASE repair_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 项目克隆和配置

#### 2.1 克隆项目
```bash
git clone https://github.com/Aiting-for-you/repair-quotation-system.git
cd repair-quotation-system
```

#### 2.2 后端配置
```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env  # 如果没有.env文件，创建一个
```

编辑 `backend/.env` 文件:
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=repair_system

# 使用MySQL作为开发数据库
DB_TYPE=mysql

# 应用配置
PORT=3000
NODE_ENV=development
```

### 3. 启动服务

#### 3.1 启动后端服务
```bash
cd backend
npm run start:dev
```

启动成功后会看到:
```
应用程序运行在: http://localhost:3000
数据库初始化完成！
```

#### 3.2 启动用户端前端
```bash
# 新开一个终端窗口
cd frontend-user
npm install
npm run dev
```

启动成功后会看到:
```
  Local:   http://localhost:5173/
  Network: use --host to expose
```

#### 3.3 启动管理端前端
```bash
# 新开一个终端窗口
cd frontend-admin
npm install
npm run dev
```

启动成功后会看到:
```
  Local:   http://localhost:3001/
  Network: use --host to expose
```

### 4. 访问系统

- **用户端**: http://localhost:5173
- **管理端**: http://localhost:3001
- **后端API**: http://localhost:3000
- **API文档**: http://localhost:3000/api (如果配置了Swagger)

### 5. 默认登录信息

管理端默认登录账号:
- **用户名**: admin
- **密码**: admin123

## 数据库说明

### 数据表结构
- `schools` - 学校信息表
- `repair_items` - 维修项目表
- `quotations` - 报价单主表
- `quotation_details` - 报价单详情表

### 初始数据
系统启动时会自动创建示例数据，包括:
- 3所示例学校
- 每所学校的维修项目
- 示例报价单数据

## 开发指南

### 添加新功能
1. 后端: 在对应模块添加Controller、Service、Entity
2. 前端: 在views中添加页面，在api中添加接口调用
3. 更新路由配置

### 数据导入
支持CSV格式的维修项目批量导入，格式要求:
```csv
序号,维修项目名称,单位,单价
1,教室门窗维修,扇,150.00
2,课桌椅维修,套,80.00
```

### API接口
主要API端点:
- `GET /api/schools` - 获取学校列表
- `GET /api/repair-items` - 获取维修项目
- `POST /api/quotations` - 创建报价单
- `GET /api/statistics` - 获取统计数据

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   ```

2. **数据库连接失败**
   - 检查MySQL服务是否启动
   - 验证.env文件中的数据库配置
   - 确认数据库用户权限

3. **依赖安装失败**
   ```bash
   # 清除缓存重新安装
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **前端页面空白**
   - 检查后端API是否正常运行
   - 查看浏览器控制台错误信息
   - 确认API接口地址配置正确

## 生产部署

### 构建生产版本
```bash
# 后端
cd backend
npm run build
npm run start:prod

# 前端
cd frontend-user
npm run build

cd frontend-admin
npm run build
```

### 环境变量配置
生产环境需要修改以下配置:
- 数据库连接信息
- JWT密钥
- CORS域名设置
- 文件上传路径

## 许可证

MIT License

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 联系方式

如有问题或建议，请通过以下方式联系:
- 提交 Issue
- 发送邮件
- 项目讨论区

---

**注意**: 这是一个演示项目，生产环境使用前请确保进行充分的安全性测试和性能优化。