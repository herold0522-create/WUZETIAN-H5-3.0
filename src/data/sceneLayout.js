import { ASSETS } from "./assets";

/** x/y 为 0~1 相对世界宽度；h 为屏高比例 */
export const sceneLayout = [
  { id: "bg", layer: "sky", texture: ASSETS.street.bg, x: 0, y: 0, w: 1.86, h: 1, parallax: 0.35 },
  { id: "mountain", layer: "far", texture: ASSETS.street.mountain, x: 0.2, y: 0.35, h: 0.45, parallax: 0.55 },
  { id: "teahouse", layer: "mid", texture: ASSETS.buildings.teahouse, x: 0.55, y: 0.52, h: 0.42, parallax: 0.85 },
  { id: "inn", layer: "mid", texture: ASSETS.buildings.inn, x: 0.28, y: 0.55, h: 0.38, parallax: 0.85 },
  { id: "bookstall", layer: "mid", texture: ASSETS.buildings.bookstall, x: 0.88, y: 0.58, h: 0.28, parallax: 0.85 },
  { id: "sancaiStall", layer: "mid", texture: ASSETS.buildings.sancaiStall, x: 1.05, y: 0.58, h: 0.28, parallax: 0.85 },
  { id: "hubing", layer: "ground", texture: ASSETS.buildings.hubing, x: 0.42, y: 0.62, h: 0.26, parallax: 1 },
  { id: "waiter", layer: "actors", texture: ASSETS.npc.waiter, x: 0.52, y: 0.62, h: 0.22, dialog: "waiter", label: "茶肆店小二", parallax: 1.08 },
  { id: "merchant", layer: "actors", texture: ASSETS.npc.merchant, x: 0.38, y: 0.62, h: 0.24, dialog: "merchant", label: "胡饼胡商", parallax: 1.08 },
  { id: "sancai", layer: "actors", texture: ASSETS.npc.storyteller, x: 1.08, y: 0.62, h: 0.2, dialog: "sancai", label: "唐三彩摊贩", parallax: 1.08 },
  { id: "bookman", layer: "actors", texture: ASSETS.npc.bookman, x: 0.92, y: 0.62, h: 0.2, dialog: "bookman", label: "字画书摊主", parallax: 1.08 },
  { id: "lady", layer: "actors", texture: ASSETS.npc.lady, x: 0.78, y: 0.62, h: 0.22, dialog: "lady", label: "唐仕女", parallax: 1.08 },
  { id: "waner", layer: "actors", texture: ASSETS.npc.waner, x: 0.85, y: 0.62, h: 0.22, dialog: "waner", label: "紫衣女子", parallax: 1.08 },
  { id: "monk", layer: "actors", texture: ASSETS.npc.monk, x: 0.22, y: 0.62, h: 0.22, dialog: "monk", label: "行脚僧", parallax: 1.08 },
  { id: "storyteller", layer: "actors", texture: ASSETS.npc.storyteller, x: 0.65, y: 0.62, h: 0.2, dialog: "storyteller", label: "说书先生", parallax: 1.08 },
  { id: "child", layer: "actors", texture: ASSETS.npc.child, x: 1.15, y: 0.64, h: 0.16, dialog: "child", label: "顽童", parallax: 1.08 },
  { id: "stonemason", layer: "actors", texture: ASSETS.npc.stonemason, x: 1.28, y: 0.62, h: 0.2, dialog: "stonemason", label: "老石匠", parallax: 1.08 },
  { id: "fgCloud", layer: "fg", texture: ASSETS.street.fgCloud, x: 0.1, y: 0.2, h: 0.35, parallax: 1.25 },
  { id: "fgWillow", layer: "fg", texture: ASSETS.street.fgWillow, x: 0.02, y: 0.45, h: 0.45, parallax: 1.25 },
];

export const ZHOU_STROKES = [
  "M 120 40 L 120 200",
  "M 120 40 L 200 40 L 200 110 L 120 110",
  "M 120 110 L 200 110",
  "M 160 110 L 160 200",
  "M 120 200 L 200 200",
  "M 200 40 L 200 200",
];
