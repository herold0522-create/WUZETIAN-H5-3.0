import { useEffect } from "react";
import { ASSETS } from "../data/assets";
import { buildShareCard } from "../data/endings";
import { useGameStore } from "../store/useGameStore";
import ShareCard from "../components/ShareCard";

export default function EndingScene() {
  const playerInscription = useGameStore((s) => s.playerInscription);
  const setInscription = useGameStore((s) => s.setInscription);
  const persistVisit = useGameStore((s) => s.persistVisit);
  const resetGame = useGameStore((s) => s.resetGame);
  const state = useGameStore();

  useEffect(() => {
    persistVisit();
  }, [persistVisit]);

  return (
    <div className="ending-scene" style={{ backgroundImage: `url(${ASSETS.palace.steleBg})` }}>
      <div className="ending-overlay">
        <p className="palace-line">若千年之后，真如你所言——那便罢了。</p>
        <p className="palace-line">你既来自后世——便由你，替朕落下第一笔。</p>
        <div className="stele-wrap" style={{ backgroundImage: `url(${ASSETS.palace.stele})` }}>
          <input
            className="stele-input"
            maxLength={6}
            placeholder="题字（≤6字）"
            value={playerInscription}
            onChange={(e) => setInscription(e.target.value)}
          />
          <p className="stele-preview">{playerInscription || "无字碑"}</p>
        </div>
        <ShareCard data={buildShareCard(state)} />
        <button type="button" className="btn-enter" onClick={resetGame}>
          再逛一次
        </button>
      </div>
    </div>
  );
}
