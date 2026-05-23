"""Generate qianli (千里江山) placeholder background layers."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "assets" / "bg" / "qianli"
MOUNTAIN = ROOT / "public" / "assets" / "cutout" / "bg" / "mountain-texture.png"
GROUND = ROOT / "public" / "assets" / "cutout" / "bg" / "ground-scroll.png"


def tint_green(img: Image.Image, strength: float = 0.55) -> Image.Image:
    rgba = img.convert("RGBA")
    r, g, b, a = rgba.split()
    r = r.point(lambda p: int(p * (1 - strength * 0.4)))
    g = g.point(lambda p: min(255, int(p * (1 + strength * 0.35))))
    b = b.point(lambda p: min(255, int(p * (1 + strength * 0.25))))
    return Image.merge("RGBA", (r, g, b, a))


def make_sky(w: int = 4000, h: int = 600) -> None:
    img = Image.new("RGBA", (w, h))
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(245 * (1 - t * 0.08) + 180 * t * 0.12)
        g = int(245 * (1 - t * 0.1) + 210 * t * 0.15)
        b = int(220 * (1 - t * 0.15) + 170 * t * 0.2)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
    # soft mountain silhouette wash
    for i, alpha in enumerate([40, 28, 18]):
        y0 = int(h * (0.45 + i * 0.08))
        draw.polygon(
            [(0, h), (w * 0.15, y0), (w * 0.35, y0 + 40), (w * 0.55, y0 - 20),
             (w * 0.75, y0 + 30), (w, y0 + 10), (w, h)],
            fill=(46, 120, 90, alpha),
        )
    img.save(OUT / "sky.png")


def make_mountain_layer(name: str, w: int, h: int, blur: float = 2) -> None:
    if MOUNTAIN.exists():
        base = Image.open(MOUNTAIN).convert("RGBA")
        base = tint_green(base, 0.65)
        base = base.resize((w, h), Image.Resampling.LANCZOS)
    else:
        base = Image.new("RGBA", (w, h), (60, 130, 95, 180))
    if blur:
        base = base.filter(ImageFilter.GaussianBlur(blur))
    base.save(OUT / name)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    make_sky()
    make_mountain_layer("far-mountains.png", 4200, 520, blur=3)
    make_mountain_layer("mid-mountains.png", 4200, 480, blur=1.5)
    print(f"Wrote qianli layers to {OUT}")


if __name__ == "__main__":
    main()
