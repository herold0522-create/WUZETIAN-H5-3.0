# 无字碑 · 大周长安 H5 3.0

武周长安互动剧本 · React + PixiJS + GSAP

## 本地开发

```bash
npm install
npm run dev
```

横屏体验最佳。街景调试摆位：访问 `?debug=1`，拖拽 Sprite 后控制台输出坐标 JSON。

## 构建

```bash
npm run build
```

## 部署

推送到 [WUZETIAN-H5-3.0](https://github.com/herold0522-create/WUZETIAN-H5-3.0) 的 `main` 分支后，GitHub Actions 自动发布至：

`https://herold0522-create.github.io/WUZETIAN-H5-3.0/`

首次需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

## 素材与抠图

| 目录 | 说明 |
|------|------|
| `public/assets/cutout/` | 透明抠图（部署用） |
| `public/assets/bg/qianli/` | 千里江山背景层（可替换） |
| `public/assets/cutout/intro/` | 开幕卷轴/毛笔分层 |
| `scripts/cutout-batch.py` | 从 `E:\武则天2.0` 批量去底 |
| `scripts/cutout-manifest.json` | 源文件名 → cutout 路径映射 |
| `src/data/assetManifest.js` | 角色/建筑正确映射表 |

**重新生成抠图：**

```bash
python scripts/cutout-batch.py
python scripts/gen-qianli-bg.py
```

精修后可直接替换 `public/assets/cutout/` 下同名 PNG，无需改代码。

## 技术栈

- React 18 + Vite 5
- PixiJS 8（街市横滑卷轴 + 千里江山视差）
- GSAP 3（开幕卷轴展开、毛笔写「周」、环境动画）
- Zustand（纯前端状态，无后端）
