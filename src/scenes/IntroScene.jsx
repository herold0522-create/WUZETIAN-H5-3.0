import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ASSETS } from "../data/assetManifest";
import { ZHOU_STROKES } from "../data/sceneLayout";
import { useGameStore } from "../store/useGameStore";

export default function IntroScene() {
  const rootRef = useRef(null);
  const scrollWrapRef = useRef(null);
  const paperRef = useRef(null);
  const scrollBottomRef = useRef(null);
  const brushRef = useRef(null);
  const zhouRef = useRef(null);
  const narrativeRef = useRef(null);
  const enterRef = useRef(null);
  const [ready, setReady] = useState(false);
  const setScene = useGameStore((s) => s.setScene);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      tl.set([brushRef.current, zhouRef.current, narrativeRef.current, enterRef.current], { autoAlpha: 0 })
        .set(paperRef.current, { scaleY: 0.02, transformOrigin: "center top" })
        .set(scrollBottomRef.current, { y: -40 })
        .fromTo(scrollWrapRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .to(paperRef.current, { scaleY: 1, duration: 1.1 }, "-=0.1")
        .to(scrollBottomRef.current, { y: 0, duration: 1.1 }, "<")
        .fromTo(
          brushRef.current,
          { autoAlpha: 0, x: 80, y: -60, rotate: 22 },
          { autoAlpha: 1, x: 0, y: 0, rotate: -8, duration: 0.7 },
          "-=0.5"
        )
        .to(zhouRef.current, { autoAlpha: 1, duration: 0.2 });

      ZHOU_STROKES.forEach((d, i) => {
        const path = zhouRef.current?.querySelector(`path:nth-child(${i + 1})`);
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, duration: 0.24, ease: "power1.inOut" }, i === 0 ? "+=0.08" : "-=0.06");
        tl.to(
          brushRef.current,
          { x: (i % 2 ? 10 : -8) + i * 2, y: i * 4 - 2, rotate: i % 2 ? 4 : -6, duration: 0.2 },
          "<"
        );
      });

      tl.to(brushRef.current, { autoAlpha: 0, duration: 0.35 })
        .fromTo(
          zhouRef.current,
          { filter: "drop-shadow(0 0 0px #e4c36a)" },
          { filter: "drop-shadow(0 0 18px #e4c36a)", duration: 0.5 }
        )
        .to(narrativeRef.current, { autoAlpha: 1, duration: 0.4 })
        .to(enterRef.current, { autoAlpha: 1, duration: 0.4, onComplete: () => setReady(true) });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="intro-scene" ref={rootRef}>
      <div className="intro-scroll-wrap" ref={scrollWrapRef}>
        <img className="intro-scroll-part intro-scroll-top" src={ASSETS.intro.scrollTop} alt="" />
        <div className="intro-scroll-paper" ref={paperRef}>
          <img className="intro-scroll-part intro-scroll-paper-img" src={ASSETS.intro.scrollPaper} alt="" />
          <svg className="intro-zhou" ref={zhouRef} viewBox="0 0 240 240">
            {ZHOU_STROKES.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#1a1208" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </svg>
        </div>
        <img ref={scrollBottomRef} className="intro-scroll-part intro-scroll-bottom" src={ASSETS.intro.scrollBottom} alt="" />
      </div>
      <img ref={brushRef} className="intro-brush" src={ASSETS.intro.brush} alt="" />
      <div className="intro-narrative" ref={narrativeRef}>
        <p>长安三年。这片土地上第一个、也是唯一一个女皇帝，正君临天下。</p>
        <p>而你——不知怎的，站在了她的街头。</p>
      </div>
      <button ref={enterRef} type="button" className="btn-enter" disabled={!ready} onClick={() => setScene("street")}>
        点击 · 入城
      </button>
    </div>
  );
}
