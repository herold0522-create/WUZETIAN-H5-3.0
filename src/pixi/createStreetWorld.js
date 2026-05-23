import { Application, Assets, Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";

const LAYER_ORDER = ["sky", "far", "mid", "ground", "actors", "fg", "fx"];

export async function createStreetWorld(containerEl, layout, onNpcTap) {
  const app = new Application();
  await app.init({
    background: "#c8dcc8",
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
    layer.parallax = name === "sky" ? 0.35 : name === "far" ? 0.55 : name === "mid" ? 0.85 : name === "fg" ? 1.25 : name === "actors" ? 1.08 : 1;
    layers[name] = layer;
    world.addChild(layer);
  });

  const urls = [...new Set(layout.map((i) => i.texture))];
  await Assets.load(urls);

  const npcSprites = [];

  function layoutWorld() {
    const W = app.screen.width;
    const H = app.screen.height;
    const worldW = W * 1.86;

    layout.forEach((item) => {
      const sprite = layers[item.layer].children.find((c) => c.itemId === item.id);
      if (!sprite) return;
      const h = (item.h || 0.3) * H;
      const tex = sprite.texture;
      const scale = h / tex.height;
      sprite.scale.set(scale);
      sprite.x = item.x * W;
      sprite.y = H - (item.y || 0.5) * H - sprite.height;
      if (item.layer === "sky" && item.w) {
        sprite.width = worldW;
        sprite.height = H;
      }
    });

    return { W, H, worldW, maxCam: Math.max(0, worldW - W) };
  }

  layout.forEach((item) => {
    const sprite = Sprite.from(item.texture);
    sprite.itemId = item.id;
    sprite.anchor.set(item.layer === "sky" ? 0 : 0.5, item.layer === "sky" ? 0 : 1);

    if (item.dialog) {
      sprite.eventMode = "static";
      sprite.cursor = "pointer";
      sprite.ringRef = new Graphics();
      sprite.addChild(sprite.ringRef);

      if (item.label) {
        const tag = new Text({
          text: item.label,
          style: new TextStyle({
            fontFamily: "Noto Serif SC, serif",
            fontSize: 14,
            fill: "#5b3b19",
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

    layers[item.layer].addChild(sprite);
  });

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

  const onResize = () => {
    const m = layoutWorld();
    maxCam = m.maxCam;
    updateNpcDecor();
    setCamera(cameraX);
  };
  window.addEventListener("resize", onResize);

  app.canvas.addEventListener("pointerdown", (e) => {
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

  return {
    app,
    maxCam,
    setCamera,
    setCameraByProgress,
    getCameraProgress: () => (maxCam ? cameraX / maxCam : 0),
    destroy: () => {
      window.removeEventListener("resize", onResize);
      app.destroy(true, { children: true, texture: false });
    },
  };
}
