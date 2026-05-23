export default function HUD({ score, monkWarn, onFinish }) {
  const label =
    score >= 3 ? "｜危" : score >= 2 ? "｜蹊跷" : score >= 1 ? "｜似有奇能" : "｜沉得住气";

  return (
    <div className="hud">
      <div className="hud-seal">
        <span className="hud-mark">周</span>
        <div>
          <b>长安街市</b>
          <small>{monkWarn ? "线索：改周十三年＝公元703" : "长安三年 · 线索未明"}</small>
        </div>
      </div>
      <div className="hud-meters">
        <button type="button" className="btn-gold" onClick={onFinish}>
          收手见婉儿
        </button>
        <div className="hud-score">
          破绽 <b>{score}</b>
          <span>{label}</span>
          <div className="hud-bar">
            <i style={{ width: `${Math.min(100, (score / 6) * 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
