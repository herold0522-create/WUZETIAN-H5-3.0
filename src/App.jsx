import { useGameStore } from "./store/useGameStore";
import IntroScene from "./scenes/IntroScene";
import StreetScene from "./scenes/StreetScene";
import SettleScene from "./scenes/SettleScene";
import PalaceScene from "./scenes/PalaceScene";
import ExamScene from "./scenes/ExamScene";
import EndingScene from "./scenes/EndingScene";
import FailScene from "./scenes/FailScene";

const SCENES = {
  intro: IntroScene,
  street: StreetScene,
  settle: SettleScene,
  palace: PalaceScene,
  exam: ExamScene,
  ending: EndingScene,
  fail: FailScene,
};

export default function App() {
  const scene = useGameStore((s) => s.scene);
  const Scene = SCENES[scene] || IntroScene;

  return (
    <div className="app-root">
      <Scene />
      <div className="landscape-tip">
        <span>↻</span>
        <p>请横屏体验</p>
      </div>
    </div>
  );
}
