export const settleTexts = {
  polite: {
    title: "礼请入宫",
    body: "上官婉儿判你「市井有奇人，似能前知，无害」。宫里来人不是锁拿，是相请。你整衣随行，虽被暗中盯防，到底体面。",
    voice: "车马辚辚。你不知这一程，是福是祸。",
  },
  normal: {
    title: "受刑押殿",
    body: "官兵围住你：「言语悖逆，来历不明，拿下！」你以「能窥见未来」换来见驾，半死，被拖上大殿。",
    voice: "你不知挨了多少棍。他们说，先看看你这「未来」，扛不扛得住现在。",
  },
  severe: {
    title: "严刑关押",
    body: "你早被盯死。严刑逼供，反复审问，关押多日。直到宫里下令提人，你被拖出牢门时几乎认不出自己。",
    voice: "你不知挨了多少棍。他们说，先看看你这「未来」，扛不扛得住现在。",
  },
};

export function buildShareCard(state) {
  const tierLine = {
    polite: "从容入宫",
    normal: "挨了顿打才见到她",
    severe: "被关押多日才见到她",
  }[state.endingTier];
  const pct = Math.floor(20 + Math.random() * 60);
  return {
    title: "我见到了武则天",
    lines: [
      `我穿越成武周长安的市民，${tierLine}。`,
      "她问我：后世女子，可为官否？",
      "我说：能——还能与男子并立，国由民做主。",
      "她不信，考我诗书——我背出了她十四岁写的《如意娘》。",
      "良久，她说：朕已无继承人，若此为真，便罢了。",
      `我替她在无字碑落下的判词：「${state.playerInscription || "……"}」`,
      `你是第 ${state.visitCount} 位见到她的人 · 你的「破绽」少于 ${pct}% 的人`,
    ],
  };
}
