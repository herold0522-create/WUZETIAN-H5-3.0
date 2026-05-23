const BASE = import.meta.env.BASE_URL;

export function asset(path) {
  return `${BASE}${path.replace(/^\//, "")}`;
}

function cut(category, id) {
  return asset(`assets/cutout/${category}/${id}.png`);
}

function bg(id) {
  return asset(`assets/cutout/bg/${id}.png`);
}

function intro(id) {
  return asset(`assets/cutout/intro/${id}.png`);
}

/** Correct role → cutout mapping (from cutout-manifest.json) */
export const ASSETS = {
  intro: {
    brush: intro("brush"),
    scrollTop: intro("scroll-top"),
    scrollPaper: intro("scroll-paper"),
    scrollBottom: intro("scroll-bottom"),
  },
  bg: {
    groundScroll: bg("ground-scroll"),
    mountainTexture: bg("mountain-texture"),
    palaceHall: bg("palace-hall"),
    steleBg: bg("stele-bg"),
    steleFrame: bg("stele-frame"),
    steleCloseup: bg("stele-closeup"),
    // qianli layered (generated or replaceable)
    qianliSky: asset("assets/bg/qianli/sky.png"),
    qianliFar: asset("assets/bg/qianli/far-mountains.png"),
    qianliMid: asset("assets/bg/qianli/mid-mountains.png"),
  },
  buildings: {
    farCity: cut("buildings", "far-city"),
    farPagoda: cut("buildings", "far-pagoda"),
    gongyuan: cut("buildings", "gongyuan"),
    teahouse: cut("buildings", "teahouse"),
    office: cut("buildings", "office"),
    grotto: cut("buildings", "grotto"),
    inn: cut("buildings", "inn"),
    teaBuilding: cut("buildings", "tea-building"),
  },
  props: {
    bridge: cut("props", "bridge"),
    show: cut("props", "show"),
    hubing: cut("props", "hubing"),
    veggie: cut("props", "veggie"),
    bookstall: cut("props", "bookstall"),
    sancaiStall: cut("props", "sancai-stall"),
    well: cut("props", "well"),
    horse: cut("props", "horse"),
    scrolls: cut("props", "scrolls"),
    willow: cut("props", "willow"),
    flag: cut("props", "flag"),
    pushcart: cut("props", "pushcart"),
  },
  npc: {
    scholar: cut("npc", "scholar"),
    waiter: cut("npc", "waiter"),
    merchant: cut("npc", "merchant"),
    camelman: cut("npc", "camelman"),
    lady: cut("npc", "lady"),
    waner: cut("npc", "waner"),
    sancaiVendor: cut("npc", "sancai-vendor"),
    child: cut("npc", "child"),
    stonemason: cut("npc", "stonemason"),
    monk: cut("npc", "monk"),
    bookman: cut("npc", "scholar"),
    peddler: cut("npc", "peddler"),
    dancer: cut("npc", "dancer"),
    storyteller: cut("npc", "storyteller"),
    farmer: cut("npc", "farmer"),
  },
  fg: {
    lanterns: cut("fg", "lanterns"),
    fgWillow: cut("fg", "fg-willow"),
    fgAwning: cut("fg", "fg-awning"),
    fgLantern: cut("fg", "fg-lantern"),
  },
  palace: {
    hall: bg("palace-hall"),
    steleBg: bg("stele-bg"),
    stele: bg("stele-frame"),
  },
};

/** Resolve scene item texture from category + id keys */
export function tex(category, id) {
  const bucket = ASSETS[category];
  return bucket?.[id] ?? "";
}
