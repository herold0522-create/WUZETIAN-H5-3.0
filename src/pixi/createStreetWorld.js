import gsap from "gsap";
import {
  Application,
  Assets,
  ColorMatrixFilter,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";

const LAYER_ORDER = ["sky", "far", "mid", "ground", "actors", "fg", "fx"];
const DEBUG = new URLSearchParams(window.location.search).get("debug") === "1";

function qianliFilter() {
  const f = new ColorMatrixFilter();
  f.hue(85, false);
  f.saturate(0.35, false);
  f.brightness(1.05, false);
  return f;
}

function checkAlpha(texture, id) {
  if (!texture?.source) return;
  try {
    const src = texture.source;
    if (src.width < 4 || src.height < 4) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.min(64, src.width);
    canvas.height = Math.min(64, src.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = src.resource ?? src;
    if (img instanceof HTMLImageElement || img instanceof HTMLCanvasElement) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 250) transparent++;
      }
      const pct = (transparent / (canvas.width * canvas.height)) * 100;
      if (pct < 2 && id !== "groundScroll" && !id.startsWith("qianli")) {
        console.warn(`[cutout] ${id} may lack transparency (${pct.toFixed(1)}% alpha)`);
      }
    }
  } catch {
    /* texture not readable in this environment */
  }
}

function startAmbientAnim(sprite, type, baseX, unit) {
  const tl = gsap.timeline({ repeat: -1, yoyo: true });
  switch (type) {
    case "float":
      tl.to(sprite, { y: sprite.y - 6, duration: 2.2, ease: "sine.inOut" });
      break;
    case "walk":
      tl.to(sprite, { x: sprite.x + unit * 0.012, duration: 1.8, ease: "sine.inOut" });
      break;
    case "walkX":
      gsap.to(sprite, { x: baseX + unit * 0.04, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      break;
    case "walkX2":
      gsap.to(sprite, { x: baseX - unit * 0.05, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
      break;
    case "dance":
      gsap.to(sprite, { rotation: 0.04, duration: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(sprite, { y: sprite.y - 4, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      break;
    case "lantern":
      tl.to(sprite, { y: sprite.y + 5, duration: 1.6, ease: "sine.inOut" });
      break;
    default:
      break;
  }
  return tl;
}

export async function createStreetWorld(containerEl, layout, onNpcTap, onCameraChange) {
  const app = new Application();
  await app.init({
    background: "#d8e8d0",
    resizeTo: containerEl,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });
  containerEl.appendChild(app.canvas);

  const world = new Container();
  app.stage.addChild(world);

  const layers = {};
  LAYER_ORDER.forEach((name) => {
    const layer = new Container();
    layer.label = name;
    layer.parallax =
      name === "sky" ? 0.35 : name === "far" ? 0.55 : name === "mid" ? 0.85 : name === "fg" ? 1.25 : name === "actors" ? 1.08 : 1;
    layers[name] = layer;
    world.addChild(layer);
  });

  // silk sky gradient behind scroll
  const skyGrad = new Graphics();
  skyGrad.label = "qianli-sky-grad";
  layers.sky.addChildAt(skyGrad, 0);

  const qFilter = qianliFilter();
  const requiredUrls = [...new Set(layout.filter((i) => !i.optional).map((i) => i.texture).filter(Boolean))];
  await Assets.load(requiredUrls);
  const optionalUrls = layout.filter((i) => i.optional).map((i) => i.texture).filter(Boolean);
  if (optionalUrls.length) {
    await Promise.allSettled(optionalUrls.map((u) => Assets.load(u)));
  }

  const npcSprites = [];
  const animTweens = [];
  const spriteMap = new Map();

  layout.forEach((item) => {
    if (!item.texture) return;
    if (item.optional && !Assets.get(item.texture)) return;
    const tex = Assets.get(item.texture) ?? item.texture;
    checkAlpha(tex, item.id);

    const sprite = Sprite.from(tex);
    sprite.itemId = item.id;
    sprite.itemData = item;
    sprite.anchor.set(item.layer === "sky" ? 0 : 0.5, item.layer === "sky" ? 0 : 1);

    if (item.qianli) {
      sprite.filters = [qFilter];
    }

    if (item.dialog) {
      sprite.eventMode = "static";
      sprite.cursor = "pointer";
      sprite.ringRef = new Graphics();
      sprite.addChild(sprite.ringRef);

      const shadow = new Graphics();
      shadow.label = "shadow";
      sprite.shadowRef = shadow;
      layers[item.layer].addChildAt(shadow, layers[item.layer].children.length);

      if (item.label) {
        const tag = new Text({
          text: item.label,
          style: new TextStyle({
            fontFamily: "Noto Serif SC, serif",
            fontSize: 13,
            fill: "#5b3b19",
            stroke: { color: "#f5ead0", width: 3 },
          }),
        });
        tag.anchor.set(0.5, 1);
        tag.label = "tag";
        sprite.addChild(tag);
      }

      sprite.on("pointertap", (e) => {
        e.stopPropagation();
        onNpcTap(item.dialog, item.id);
      });
      npcSprites.push(sprite);
    }

    if (DEBUG) {
      sprite.eventMode = "static";
      sprite.cursor = "move";
      let dragStart = null;
      sprite.on("pointerdown", (e) => {
        dragStart = { x: e.global.x - sprite.x, y: e.global.y - sprite.y, pointerId: e.pointerId };
        app.canvas.setPointerCapture(e.pointerId);
      });
      sprite.on("globalpointermove", (e) => {
        if (!dragStart || dragStart.pointerId !== e.pointerId) return;
        sprite.x = e.global.x - dragStart.x;
        sprite.y = e.global.y - dragStart.y;
      });
      sprite.on("pointerup", (e) => {
        if (!dragStart || dragStart.pointerId !== e.pointerId) return;
        const W = app.screen.width;
        const H = app.screen.height;
        const xFrac = (sprite.x / W).toFixed(3);
        const yFrac = ((H - sprite.y) / H).toFixed(3);
        console.log(`[debug] ${item.id}: x=${xFrac}, y=${yFrac}, h=${item.h}`);
        dragStart = null;
      });
    }

    layers[item.layer].addChild(sprite);
    spriteMap.set(item.id, sprite);
  });

  function drawSkyGrad(W, H, worldW) {
    skyGrad.clear();
    skyGrad.rect(0, 0, worldW + W * 0.2, H);
    skyGrad.fill({ color: 0xf5f5dc, alpha: 1 });
    skyGrad.rect(0, H * 0.55, worldW + W * 0.2, H * 0.45);
    skyGrad.fill({ color: 0x6b9e78, alpha: 0.22 });
  }

  function layoutWorld() {
    const W = app.screen.width;
    const H = app.screen.height;
    const worldW = W * 1.86;
    drawSkyGrad(W, H, worldW);

    layout.forEach((item) => {
      const sprite = spriteMap.get(item.id);
      if (!sprite) return;
      const h = (item.h || 0.3) * H;
      const tex = sprite.texture;
      if (tex?.height) {
        const scale = h / tex.height;
        sprite.scale.set(scale);
      }
      sprite.x = item.x * W;
      sprite.y = H - (item.y || 0.5) * H;
      if (item.layer === "sky" && item.w) {
        sprite.width = worldW;
        sprite.height = H;
      }
      sprite.baseX = sprite.x;
    });

    return { W, H, worldW, maxCam: Math.max(0, worldW - W) };
  }

  function updateNpcDecor() {
    npcSprites.forEach((sprite) => {
      const h = sprite.height;
      const ring = sprite.ringRef;
      if (ring) {
        ring.clear();
        ring.circle(0, -h * 0.45, h * 0.35);
        ring.fill({ color: 0xe4c36a, alpha: 0.15 });
        ring.stroke({ color: 0xe4c36a, width: 2, alpha: 0.5 });
      }
      const tag = sprite.children.find((c) => c.label === "tag");
      if (tag) tag.y = -h - 8;
    });
  }

  app.ticker.add(() => {
    npcSprites.forEach((sprite) => {
      const shadow = sprite.shadowRef;
      if (!shadow) return;
      const h = sprite.height;
      shadow.clear();
      shadow.ellipse(sprite.x, sprite.y - 2, h * 0.22, h * 0.06);
      shadow.fill({ color: 0x000000, alpha: 0.22 });
    });
  });

  let cameraX = 0;
  let maxCam = 0;
  let dragging = false;
  let startX = 0;
  let startCam = 0;

  function renderCamera() {
    Object.values(layers).forEach((layer) => {
      const p = layer.parallax || 1;
      layer.x = -cameraX * p;
    });
    npcSprites.forEach((sprite) => {
      const shadow = sprite.shadowRef;
      if (shadow) {
        const h = sprite.height;
        shadow.clear();
        shadow.ellipse(sprite.x, sprite.y - 2, h * 0.22, h * 0.06);
        shadow.fill({ color: 0x000000, alpha: 0.22 });
      }
    });
    onCameraChange?.(maxCam ? cameraX / maxCam : 0);
  }

  function setCamera(x) {
    cameraX = Math.max(0, Math.min(maxCam, x));
    renderCamera();
    return maxCam ? cameraX / maxCam : 0;
  }

  function setCameraByProgress(pct) {
    return setCamera(pct * maxCam);
  }

  const metrics = layoutWorld();
  maxCam = metrics.maxCam;
  updateNpcDecor();
  renderCamera();

  animTweens.forEach((t) => t.kill());
  layout.forEach((item) => {
    if (!item.anim) return;
    const sprite = spriteMap.get(item.id);
    if (!sprite) return;
    const t = startAmbientAnim(sprite, item.anim, sprite.baseX, metrics.W);
    if (t) animTweens.push(t);
  });

  const onResize = () => {
    const m = layoutWorld();
    maxCam = m.maxCam;
    updateNpcDecor();
    setCamera(cameraX);
  };
  window.addEventListener("resize", onResize);

  app.canvas.addEventListener("pointerdown", (e) => {
    if (DEBUG && e.target !== app.canvas) return;
    dragging = true;
    startX = e.clientX;
    startCam = cameraX;
    app.canvas.setPointerCapture(e.pointerId);
  });
  app.canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    setCamera(startCam - (e.clientX - startX));
  });
  app.canvas.addEventListener("pointerup", () => {
    dragging = false;
  });
  app.canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      setCamera(cameraX + (e.deltaX || e.deltaY) * 0.8);
    },
    { passive: false }
  );

  if (DEBUG) {
    console.info("[debug] Drag sprites to reposition; coords logged on release.");
  }

  return {
    app,
    maxCam,
    setCamera,
    setCameraByProgress,
    getCameraProgress: () => (maxCam ? cameraX / maxCam : 0),
    destroy: () => {
      animTweens.forEach((t) => t.kill());
      window.removeEventListener("resize", onResize);
      app.destroy(true, { children: true, texture: false });
    },
  };
}
