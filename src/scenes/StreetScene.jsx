import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { dialogs } from "../data/dialogs";
import { sceneLayout } from "../data/sceneLayout";
import { createStreetWorld } from "../pixi/createStreetWorld";
import DialogPanel from "../components/DialogPanel";
import HUD from "../components/HUD";
import TimeFlash from "../components/TimeFlash";

export default function StreetScene() {
  const containerRef = useRef(null);
  const worldRef = useRef(null);
  const flashRef = useRef(null);
  const [dialog, setDialog] = useState(null);
  const [dialogResult, setDialogResult] = useState(null);
  const [railPct, setRailPct] = useState(0);

  const score = useGameStore((s) => s.score);
  const monkWarn = useGameStore((s) => s.monkWarn);
  const addScore = useGameStore((s) => s.addScore);
  const setMonkWarn = useGameStore((s) => s.setMonkWarn);
  const markVisited = useGameStore((s) => s.markVisited);
  const finalizeStreet = useGameStore((s) => s.finalizeStreet);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!containerRef.current) return;
      const world = await createStreetWorld(containerRef.current, sceneLayout, (dialogId, npcId) => {
        markVisited(npcId);
        setDialogResult(null);
        setDialog(dialogs[dialogId]);
      });
      if (mounted) worldRef.current = world;
    })();
    return () => {
      mounted = false;
      worldRef.current?.destroy();
    };
  }, [markVisited]);

  const onChoice = (choice) => {
    if (choice.score) addScore(choice.score);
    if (choice.monk) setMonkWarn();
    if (choice.flash) flashRef.current?.play(choice.flash, choice.sub);
    setDialogResult({ ...choice, speaker: dialog.speaker });
  };

  const onContinue = () => {
    const final = dialogResult?.final;
    setDialog(null);
    setDialogResult(null);
    if (final) finalizeStreet();
  };

  const onRailDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (worldRef.current) {
      worldRef.current.setCameraByProgress(pct);
      setRailPct(pct);
    }
  };

  return (
    <div className="street-scene">
      <div className="street-canvas" ref={containerRef} />
      <HUD score={score} monkWarn={monkWarn} onFinish={finalizeStreet} />
      <div className="street-hint">按住拖动探索街市，点击人物攀谈</div>
      <div className="street-rail" onPointerDown={onRailDown}>
        <div className="street-rail-track">
          <div className="street-rail-fill" style={{ width: `${railPct * 100}%` }} />
        </div>
      </div>
      {dialog && (
        <DialogPanel
          dialog={dialog}
          result={dialogResult}
          monkWarn={monkWarn}
          onChoice={onChoice}
          onContinue={onContinue}
          onClose={() => {
            setDialog(null);
            setDialogResult(null);
          }}
        />
      )}
      <TimeFlash ref={flashRef} />
    </div>
  );
}
