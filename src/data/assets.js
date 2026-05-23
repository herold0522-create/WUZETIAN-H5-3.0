const BASE = import.meta.env.BASE_URL;

export function asset(path) {
  return `${BASE}${path.replace(/^\//, "")}`;
}

export const ASSETS = {
  intro: { source: asset('assets/intro/scroll-brush-source.png') },
  street: {
    bg: asset('assets/street/3.1 街市长卷背景（无建筑无人）　.png'),
    mountain: asset('assets/street/S2 碑石质感贴图　.png'),
    fgCloud: asset('assets/street/G1 前景灯笼.png'),
    fgWillow: asset('assets/street/G2 前景柳枝.png'),
  },
  buildings: {
    teahouse: asset('assets/street/A5 铁匠铺.png'),
    inn: asset('assets/street/A1酒肆.png'),
    pharmacy: asset('assets/street/A3 药铺.png'),
    sancaiStall: asset('assets/street/B3 唐三彩陶器摊.png'),
    hubing: asset('assets/street/B1 胡饼食摊.png'),
    bookstall: asset('assets/street/B8 卖艺场子.png'),
  },
  npc: {
    waiter: asset('assets/street/C1 ★动 挑担小贩.png'),
    waner: asset('assets/street/C2 卖饼胡商.png'),
    lady: asset('assets/street/C4 唐仕女.png'),
    monk: asset('assets/street/C9 行脚僧.png'),
    storyteller: asset('assets/street/C10 说书先生.png'),
    merchant: asset('assets/street/C11 ★动 杂耍艺人.png'),
    stonemason: asset('assets/street/C6 ★动 街头乐师.png'),
    child: asset('assets/street/C8 ★动 顽童.png'),
    bookman: asset('assets/street/C3 ★动 推车货郎.png'),
  },
  palace: {
    hall: asset('assets/street/3.3 建筑 · 茶肆.png'),
    steleBg: asset('assets/street/7.2 碑林背景.png'),
    stele: asset('assets/street/7.3 分享卡 · 金石边框.png'),
  },
};
