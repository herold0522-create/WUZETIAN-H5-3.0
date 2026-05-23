import { useEffect } from "react";
import gsap from "gsap";
import { settleTexts } from "../data/endings";
import { useGameStore } from "../store/useGameStore";

export default function SettleScene() {
  const endingTier = useGameStore((s) => s.endingTier);
  const setScene = useGameStore((s) => s.setScene);
  const data = settleTexts[endingTier];

  useEffect(() => {
    gsap.from(".settle-card", { y: 40, autoAlpha: 0, duration: 0.5 });
  }, []);

  return (
    <div className="settle-scene">
      <div className="settle-card">
        <h2>{data.title}</h2>
        <p>{data.body}</p>
        <p className="settle-voice">{data.voice}</p>
        <button type="button" className="btn-enter" onClick={() => setScene("palace")}>
          入殿
        </button>
      </div>
    </div>
  );
}
