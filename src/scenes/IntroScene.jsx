import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ASSETS } from "../data/assets";
import { ZHOU_STROKES } from "../data/sceneLayout";
import { useGameStore } from "../store/useGameStore";

export default function IntroScene() {
  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const paperRef = useRef(null);
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
        .fromTo(scrollRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .to(paperRef.current, { scaleY: 1, duration: 1.1 }, "-=0.1")
        .fromTo(
          brushRef.current,
          { autoAlpha: 0, x: 120, y: -80, rotate: 25 },
          { autoAlpha: 1, x: 0, y: 0, rotate: 0, duration: 0.7 },
          "-=0.4"
        )
        .to(zhouRef.current, { autoAlpha: 1, duration: 0.2 });

      ZHOU_STROKES.forEach((d, i) => {
        const path = zhouRef.current?.querySelector(`path:nth-child(${i + 1})`);
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, duration: 0.22, ease: "power1.inOut" }, i === 0 ? "+=0.1" : "-=0.05");
        tl.to(
          brushRef.current,
          { x: i % 2 ? 8 : -6, y: i * 3, rotate: i % 2 ? 6 : -4, duration: 0.18 },
          "<"
        );
      });

      tl.to(brushRef.current, { autoAlpha: 0, duration: 0.3 })
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
      <div className="intro-scroll-wrap" ref={scrollRef}>
        <div className="intro-scroll-rod intro-scroll-rod-top" />
        <div className="intro-scroll-paper" ref={paperRef}>
          <img
            className="intro-scroll-img"
            src={ASSETS.intro.source}
            alt=""
            style={{ objectPosition: "right center", clipPath: "inset(0 0 0 42%)" }}
          />
          <svg className="intro-zhou" ref={zhouRef} viewBox="0 0 240 240">
            {ZHOU_STROKES.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#1a1208" strokeWidth="12" strokeLinecap="round" />
            ))}
          </svg>
        </div>
        <div className="intro-scroll-rod intro-scroll-rod-bottom" />
      </div>
      <img
        ref={brushRef}
        className="intro-brush"
        src={ASSETS.intro.source}
        alt=""
        style={{ objectPosition: "left center", clipPath: "inset(0 58% 0 0)" }}
      />
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
