export default function DialogPanel({ dialog, result, monkWarn, onChoice, onContinue, onClose }) {
  return (
    <div className={`dialog-panel ${monkWarn ? "risk-hint" : ""}`}>
      <div className="dialog-top">
        <div className="dialog-speaker">{result?.speaker || dialog.speaker}</div>
        <button type="button" className="dialog-close" onClick={onClose}>
          ×
        </button>
      </div>
      {!result ? (
        <>
          <p className="dialog-text">{dialog.text}</p>
          <div className="dialog-choices">
            {dialog.choices.map((c) => (
              <button
                key={c.t}
                type="button"
                className={`dialog-choice ${monkWarn && c.score ? "risk" : ""}`}
                onClick={() => onChoice(c)}
              >
                {monkWarn && c.score ? <span className="risk-tag">时间缝</span> : null}
                {c.t}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="dialog-text">{dialog.text}</p>
          <div className={`dialog-result ${result.danger ? "danger" : ""}`}>{result.r}</div>
          <button type="button" className="dialog-choice" onClick={onContinue}>
            {result.final ? "进入结算" : "继续逛街"}
          </button>
        </>
      )}
    </div>
  );
}
