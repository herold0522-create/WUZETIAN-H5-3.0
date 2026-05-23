import { useState } from "react";
import { ASSETS } from "../data/assets";
import { audienceChoices } from "../data/exam";
import { useGameStore } from "../store/useGameStore";

export default function PalaceScene() {
  const [phase, setPhase] = useState("question");
  const [reaction, setReaction] = useState("");
  const setAudienceChoice = useGameStore((s) => s.setAudienceChoice);
  const setScene = useGameStore((s) => s.setScene);

  const onPick = (c) => {
    setAudienceChoice(c.id);
    setReaction(c.reaction);
    setPhase("doubt");
  };

  return (
    <div className="palace-scene" style={{ backgroundImage: `url(${ASSETS.palace.hall})` }}>
      <div className="palace-overlay">
        {phase === "question" && (
          <>
            <p className="palace-line">都说你能窥见未来。</p>
            <p className="palace-line emphasis">朕不信鬼神。但朕——想问你一件事。</p>
            <p className="palace-line">后世……女子，可为官否？</p>
            <div className="dialog-choices">
              {audienceChoices.map((c) => (
                <button key={c.id} type="button" className="dialog-choice" onClick={() => onPick(c)}>
                  {c.t}
                </button>
              ))}
            </div>
          </>
        )}
        {phase === "doubt" && (
          <>
            <p className="palace-line">{reaction}</p>
            <p className="palace-line">你说的，正是朕拿命去争的东西。</p>
            <p className="palace-line">正因如此，朕更不敢信你。</p>
            <p className="palace-line">你若真来自那样的后世——便证给朕看。朕的大唐，后世可还记得？</p>
            <button type="button" className="btn-enter" onClick={() => setScene("exam")}>
              请陛下以诗文相考
            </button>
          </>
        )}
      </div>
    </div>
  );
}
