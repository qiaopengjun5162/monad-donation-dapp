# Monad Blink 捐赠 DApp

> 支持 Monad 测试网钱包连接、余额显示、捐赠操作、弹窗反馈与最近捐赠记录的 Next.js + Tailwind CSS DApp

---

## 项目简介 | Project Introduction

本项目是基于 [Next.js](https://nextjs.org) + [wagmi](https://wagmi.sh) + [Tailwind CSS](https://tailwindcss.com) 的 Monad 区块链捐赠 DApp 示例，支持钱包连接、余额实时显示、捐赠 MON、弹窗反馈和最近一条捐赠记录展示。

This project is a Monad blockchain donation DApp built with Next.js, wagmi, and Tailwind CSS. It supports wallet connection, real-time balance display, MON donation, feedback modal, and recent donation record display.

---

## 功能特性 | Features

- 钱包连接（Monad 测试网）
- 实时显示钱包余额
- 支持多种金额和自定义金额捐赠
- 捐赠后弹窗反馈（显示余额变化、时间、捐赠人、接收人）
- 最近一条捐赠记录本地保存与展示
- 响应式美观 UI，支持暗色模式

---

## 快速开始 | Quick Start

1. **安装依赖 | Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. **配置环境变量 | Configure environment variables**

在项目根目录下新建 `.env.local` 文件，添加：

```env
NEXT_PUBLIC_DONATION_WALLET=你的捐赠钱包地址
```

3. **启动开发服务器 | Start the dev server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

---

## 主要依赖 | Main Dependencies

- [Next.js](https://nextjs.org)
- [wagmi](https://wagmi.sh)
- [viem](https://viem.sh)
- [@dialectlabs/blinks](https://github.com/dialectlabs/blinks)
- [connectkit](https://connectkit.dev)
- [@tanstack/react-query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)

---

## 目录结构 | Directory Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx         # 主页面，包含钱包连接、余额、捐赠、弹窗等
│   │   ├── layout.tsx       # 全局布局
│   │   ├── globals.css      # 全局样式
│   │   └── api/
│   │       └── actions/
│   │           └── donate-mon/route.ts  # 捐赠 API 路由
│   ├── config.ts            # wagmi 链接配置
│   └── provider.tsx         # 全局 Provider 组件
├── .env.local               # 环境变量（需手动创建）
├── README.md                # 项目说明
```

---

## 常见问题 | FAQ

- **Q: 为什么捐赠金额有时无法准确显示？**
  - A: 由于 Blink 组件机制，前端只能准确获取余额变化，无法100%获取本次捐赠金额。建议以余额变化为准。

- **Q: 如何切换捐赠钱包地址？**
  - A: 修改 `.env.local` 文件中的 `NEXT_PUBLIC_DONATION_WALLET`。

- **Q: 支持多次捐赠吗？**
  - A: 支持，每次捐赠后会自动弹窗反馈并记录。

---

## 贡献与反馈 | Contributing

欢迎提交 Issue 或 PR 参与改进！

---

## License

[MIT](LICENSE)
