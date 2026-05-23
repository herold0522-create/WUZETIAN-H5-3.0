import { useGameStore } from "../store/useGameStore";

export default function FailScene() {
  const resetGame = useGameStore((s) => s.resetGame);
  return (
    <div className="fail-scene">
      <div className="settle-card">
        <h2>未能自证</h2>
        <p>……终究是个为活命胡诌的。拖下去。</p>
        <p>我没能证明自己。她终究没等到她想要的答案。</p>
        <button type="button" className="btn-enter" onClick={resetGame}>
          重来
        </button>
      </div>
    </div>
  );
}
