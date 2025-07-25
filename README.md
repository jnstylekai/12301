# 志愿者管理系统

## 功能概述

本项目实现了志愿者信息查询和领队手机号修改功能。

## 主要功能

### 1. 志愿者信息查询 (`describeVolunteerByPhone`)
- 根据手机号查询志愿者信息
- 支持实时查询，输入手机号后自动触发查询
- 查询到信息时在界面显示详细信息
- 未查询到信息时显示固定提示信息

### 2. 领队手机号修改
- 在查询到志愿者信息后，可以修改其领队手机号
- 包含手机号格式验证
- 提交成功后更新界面显示

## 文件结构

```
src/
├── types/
│   └── volunteer.ts          # 志愿者相关类型定义
├── api/
│   └── volunteerApi.ts       # API 接口封装
└── components/
    └── VolunteerPhoneManager.tsx  # 主要组件
```

## 使用方法

### 1. 导入组件

```tsx
import VolunteerPhoneManager from './components/VolunteerPhoneManager';
```

### 2. 使用组件

```tsx
<VolunteerPhoneManager
  onSuccess={(message) => console.log('成功:', message)}
  onError={(message) => console.error('错误:', message)}
/>
```

## API 接口

### 查询志愿者信息
- **接口**: `POST /api/volunteer/describe-by-phone`
- **参数**: `{ phone: string }`
- **返回**: 志愿者信息或错误信息

### 修改领队手机号
- **接口**: `POST /api/volunteer/update-team-leader-phone`
- **参数**: `{ volunteerId: string, newTeamLeaderPhone: string }`
- **返回**: 修改结果

## 环境变量

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

## 开发说明

1. 所有接口调用都包含错误处理
2. 组件支持加载状态显示
3. 包含基本的表单验证
4. 使用 TypeScript 确保类型安全
