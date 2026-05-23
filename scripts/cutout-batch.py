"""
Batch cutout: remove near-white/beige backgrounds from 武则天2.0 stage assets.
Outputs transparent PNGs to public/assets/cutout/ + cutout-manifest.json
"""
from __future__ import annotations

import json
import os
import struct
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(r"E:\武则天2.0")
OUT = ROOT / "public" / "assets" / "cutout"
MANIFEST_PATH = ROOT / "scripts" / "cutout-manifest.json"

# source filename -> (category, output id)
MAPPING: dict[str, tuple[str, str]] = {
    # backgrounds (keep opaque, copy to bg/)
    "3.1 街市长卷背景（无建筑无人）　.png": ("bg", "ground-scroll"),
    "7.2 碑林背景.png": ("bg", "stele-bg"),
    "大殿朝堂背景.png": ("bg", "palace-hall"),
    "S2 碑石质感贴图　.png": ("bg", "mountain-texture"),
    # buildings
    "A1酒肆.png": ("buildings", "inn"),
    "A2 绸缎布庄.png": ("buildings", "silk-shop"),
    "A3 药铺.png": ("buildings", "pharmacy"),
    "A4 民居小院.png": ("buildings", "courtyard"),
    "A5 铁匠铺.png": ("buildings", "smithy"),
    "A6 胡商客栈.png": ("buildings", "teahouse"),
    "A7 远景城楼.png": ("buildings", "far-city"),
    "A8 远景佛塔.png": ("buildings", "far-pagoda"),
    "3.2 建筑 · 科举贡院.png": ("buildings", "gongyuan"),
    "3.3 建筑 · 茶肆.png": ("buildings", "tea-building"),
    "建筑 · 上官官署.png": ("buildings", "office"),
    "古老佛教岩窟寺庙.png": ("buildings", "grotto"),
    "B1 胡饼食摊.png": ("props", "hubing"),
    "B2 果蔬摊.png": ("props", "veggie"),
    "B3 唐三彩陶器摊.png": ("props", "sancai-stall"),
    "B4 布匹摊.png": ("props", "cloth-stall"),
    "B5 茶水摊.png": ("props", "tea-stall"),
    "B6 字画书摊.png": ("props", "bookstall"),
    "B7 杂货摊.png": ("props", "grocery-stall"),
    "B8 卖艺场子.png": ("props", "show"),
    # npc
    "茶客.png": ("npc", "waiter"),
    "上官婉儿.png": ("npc", "waner"),
    "C2 卖饼胡商.png": ("npc", "merchant"),
    "C4 唐仕女.png": ("npc", "lady"),
    "C9 行脚僧.png": ("npc", "monk"),
    "C10 说书先生.png": ("npc", "storyteller"),
    "C8 ★动 顽童.png": ("npc", "child"),
    "老石匠.png": ("npc", "stonemason"),
    "寒门举子.png": ("npc", "scholar"),
    "C3 ★动 推车货郎.png": ("npc", "peddler"),
    "C7 ★动 胡旋舞女.png": ("npc", "dancer"),
    "C5 ★动 牵骆驼胡人.png": ("npc", "camelman"),
    "C11 ★动 杂耍艺人.png": ("npc", "sancai-vendor"),
    "C1 ★动 挑担小贩.png": ("npc", "vendor"),
    "D1 ★动 挑菜农夫.png": ("npc", "farmer"),
    "D4 提篮农妇.png": ("npc", "basket-woman"),
    # props / animals
    "F10 拱桥.png": ("props", "bridge"),
    "F7 石水井.png": ("props", "well"),
    "F11 绸卷堆.png": ("props", "scrolls"),
    "F9 柳树.png": ("props", "willow"),
    "F2 招幌酒旗.png": ("props", "flag"),
    "F6 木板车.png": ("props", "pushcart"),
    "E4 马.png": ("props", "horse"),
    "E1 骆驼.png": ("props", "camel"),
    # foreground
    "G1 前景灯笼.png": ("fg", "lanterns"),
    "G2 前景柳枝.png": ("fg", "fg-willow"),
    "G3 前景摊棚角.png": ("fg", "fg-awning"),
    "F1 红灯笼串.png": ("fg", "fg-lantern"),
    # ending
    "7.3 分享卡 · 金石边框.png": ("bg", "stele-frame"),
    "无字碑特写.png": ("bg", "stele-closeup"),
}


def color_dist(a: tuple[int, ...], b: tuple[int, ...]) -> float:
    return sum((int(a[i]) - int(b[i])) ** 2 for i in range(3)) ** 0.5


def flood_cutout(im: Image.Image, tolerance: float = 38) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    bg_samples = [px[x, y][:3] for x, y in corners]
    bg = tuple(sum(c[i] for c in bg_samples) // len(bg_samples) for i in range(3))

    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    for x, y in corners:
        if color_dist(px[x, y][:3], bg) <= tolerance:
            q.append((x, y))
            visited[y][x] = True

    while q:
        x, y = q.popleft()
        px[x, y] = (px[x, y][0], px[x, y][1], px[x, y][2], 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                if color_dist(px[nx, ny][:3], bg) <= tolerance:
                    visited[ny][nx] = True
                    q.append((nx, ny))

    # second pass: light fringe near transparent edges
    for y in range(h):
        for x in range(w):
            if px[x, y][3] == 0:
                continue
            r, g, b, a = px[x, y]
            if color_dist((r, g, b), bg) < tolerance * 0.65:
                px[x, y] = (r, g, b, max(0, a - 80))

    im = im.filter(ImageFilter.GaussianBlur(radius=0.6))
    bbox = im.getbbox()
    if bbox:
        pad = 4
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
        im = im.crop(bbox)
    return im


def process_one(src_name: str, category: str, out_id: str) -> dict:
    src_path = SRC / src_name
    if not src_path.exists():
        return {"id": out_id, "source": src_name, "error": "missing"}

    out_dir = OUT / category
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{out_id}.png"

    im = Image.open(src_path)
    if category == "bg":
        im.save(out_path, optimize=True)
    else:
        cut = flood_cutout(im)
        cut.save(out_path, optimize=True)
        alpha = cut.split()[-1]
        transparent = sum(1 for p in alpha.getdata() if p < 10)
        total = alpha.size[0] * alpha.size[1]
        pct = round(transparent / total * 100, 1) if total else 0

    rel = f"assets/cutout/{category}/{out_id}.png"
    entry = {
        "id": out_id,
        "source": src_name,
        "category": category,
        "path": rel,
        "size": list(Image.open(out_path).size),
    }
    if category != "bg":
        entry["transparent_pct"] = pct
    return entry


def split_intro():
    intro_src = ROOT / "public" / "assets" / "intro" / "scroll-brush-source.png"
    if not intro_src.exists():
        return []
    im = Image.open(intro_src).convert("RGBA")
    w, h = im.size
    out_dir = OUT / "intro"
    out_dir.mkdir(parents=True, exist_ok=True)
    entries = []

    # left ~42% brush, right ~58% scroll
    brush = im.crop((0, 0, int(w * 0.42), h))
    brush = flood_cutout(brush.convert("RGB"), tolerance=45)
    brush_path = out_dir / "brush.png"
    brush.save(brush_path)

    scroll = im.crop((int(w * 0.38), 0, w, h))
    sw = scroll.size[0]
    sh = scroll.size[1]
    top = scroll.crop((0, 0, sw, int(sh * 0.08)))
    paper = scroll.crop((0, int(sh * 0.08), sw, int(sh * 0.92)))
    bottom = scroll.crop((0, int(sh * 0.92), sw, sh))

    for name, part in [("scroll-top", top), ("scroll-paper", paper), ("scroll-bottom", bottom)]:
        p = out_dir / f"{name}.png"
        part.save(p)

    entries.append({"id": "brush", "path": "assets/cutout/intro/brush.png", "category": "intro"})
    for name in ("scroll-top", "scroll-paper", "scroll-bottom"):
        entries.append({"id": name, "path": f"assets/cutout/intro/{name}.png", "category": "intro"})
    return entries


def main():
    manifest = {"items": [], "intro": []}
    for src_name, (cat, out_id) in MAPPING.items():
        entry = process_one(src_name, cat, out_id)
        manifest["items"].append(entry)
        status = entry.get("transparent_pct", "bg")
        print(f"  {out_id}: {status}")

    manifest["intro"] = split_intro()
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {len(manifest['items'])} cutouts -> {OUT}")
    print(f"Manifest -> {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
