# AgnAIstic

> Agnai: 不局限而灵活，自己搭建或者多用户使用

AI Agnostic Chat

基于一个更早的项目：https://github.com/PygmalionAI/galatea-ui

<div style="display: flex; flex-direction: row; gap: 0.5rem;" >
<img src="https://github.com/sceuick/agn-ai/blob/dev/screenshots/chat.png?raw=true" height="150">
<img src="https://github.com/sceuick/agn-ai/blob/dev/screenshots/persona.png?raw=true" height="150">
<img src="https://github.com/sceuick/agn-ai/blob/dev/screenshots/settings.png?raw=true" height="150">
</div>

## 特性

- 支持各种AI适配器：Kobold、Novel、AI Horde、Chai
- 群组对话：多个用户与单个机器人（角色）
- 支持多种角色信息格式 (W++, Square bracket format, Boostyle)
- 多用户支持：
  - 用户验证
  - 单独用户设置：不同人分别使用的适配器及其设置
  - 单独用户的生成配置(_开发中_)
- 聊天： 
  - 更换特定聊天的AI
  - 更换特定聊天的角色

## 项目计划

查看[计划](https://github.com/users/sceuick/projects/1)

## 用户快速开始

> 提醒：这个项目处于早期开发阶段。你可能会在更新间遇到重大变更。

如果你只是想运行AgnAI的话：

1. 安装 [Node.js](https://nodejs.org/en/download/) 
2. 安装 [MongoDB](https://www.mongodb.com/docs/manual/installation/)
3. 克隆这个项目: `git clone https://github.com/sceuick/agn-ai` 或者直接 [下载](https://github.com/sceuick/agn-ai/archive/refs/heads/dev.zip)
4. 从项目文件夹内打开终端：
   - `npm install`
   - `npm build:all`
   - `npm start`
5. 如果你想要运行公共的服务：
   - `npm run start:public`

## 设计目标

这个项目很快就与原上游项目分离了。这个项目不会打算成为SaaS，也不打算以Pygmalion模型为中心。
归根结底，这个项目的设计目标看我自己

- 高质量代码库
- 适配器: 简明的使用各种AI模型和服务
  - 最开始的适配器：Kobold, Kobold Horde, and Novel
- 无阻使用切换适配器
- 足够轻量，可以自建
- 避免使用本地依赖或Docker。不太懂技术的人也可以轻松安装运行。

## For Developers 对于开发者

### 技术栈

重要的部分有：

- 维护：[MongoDB](https://www.mongodb.com/docs/manual/installation/) for persistence
- [SolidJS](https://www.solidjs.com/) for interactivity
- [TailwindCSS](https://tailwindcss.com/) for styling
- 依赖管理：[pnpm](https://pnpm.io/)

### 快速开始

如果你已经安装了pnpm，可以执行以下命令搭建开发服务器：

```bash
# 安装依赖：
> pnpm install --lockfile

# 启动前端，后端和python服务：
> pnpm start

# 使用Docker运行MongoDB：
> pnpm run up

# Start the public facing version: 启动公共版本
> pnpm start:public
```

### 开发者工具

- Redux Dev Tools 
  - [Redux Dev Tool](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)连接前端应用的状态。
- NodeJS debugger
  - 运行`start`脚本加上`--inspect`选项启动NodeJS API
  - 访问 `chrome://inspect` 这个URL来debug

### 格式与类型的检查

项目使用ESLint来lint，使用Prettier保证代码格式，用TypeScript检查类型错误。创建新的拉取请求时，执行以下的操作以确保不会引入任何新的错误。

```bash
# 自动修复所有的样式问题
$ pnpm run format:fix

# 运行TS编译器以显示所有类型的错误
$ pnpm run typecheck
```
