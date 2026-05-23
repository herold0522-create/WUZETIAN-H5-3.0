export default function ShareCard({ data }) {
  const onSave = () => {
    const text = [data.title, ...data.lines].join("\n");
    navigator.clipboard?.writeText(text);
    alert("分享文案已复制到剪贴板");
  };

  return (
    <div className="share-card">
      <h3>{data.title}</h3>
      {data.lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <button type="button" className="btn-gold" onClick={onSave}>
        复制分享卡
      </button>
    </div>
  );
}
