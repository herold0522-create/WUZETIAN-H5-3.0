# 无字碑 · 大周长安 H5 3.0

武周长安互动剧本 · React + PixiJS + GSAP

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署

推送到 [WUZETIAN-H5-3.0](https://github.com/herold0522-create/WUZETIAN-H5-3.0) 的 `main` 分支后，GitHub Actions 自动发布至：

`https://herold0522-create.github.io/WUZETIAN-H5-3.0/`

首次需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

## 素材

- 开幕卷轴/毛笔：`public/assets/intro/`
- 街市/大殿：`public/assets/street/`（来自武则天2.0素材包）

## 技术栈

- React 18 + Vite 5
- PixiJS 8（街市横滑卷轴）
- GSAP 3（开幕卷轴展开、毛笔写「周」、时间缝闪屏）
- Zustand（纯前端状态，无后端）
