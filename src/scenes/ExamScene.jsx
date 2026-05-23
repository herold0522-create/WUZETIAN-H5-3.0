import { useEffect, useState } from "react";
import { examQuestions } from "../data/exam";
import { useGameStore } from "../store/useGameStore";

export default function ExamScene() {
  const examIndex = useGameStore((s) => s.examIndex);
  const answerExam = useGameStore((s) => s.answerExam);
  const [msg, setMsg] = useState("");
  const [answered, setAnswered] = useState(false);
  const q = examQuestions[examIndex];

  useEffect(() => {
    setMsg("");
    setAnswered(false);
  }, [examIndex]);

  const onAnswer = (idx) => {
    const res = answerExam(idx === q.answer);
    if (res.ok) {
      setMsg(q.correctMsg);
      setAnswered(true);
    } else if (res.retry) setMsg("答错了。再给你一次机会。");
  };

  const onNext = () => {
    setMsg("");
    setAnswered(false);
  };

  return (
    <div className="exam-scene">
      <div className="exam-card">
        <h2>自证 · 考核 {examIndex + 1}/3</h2>
        <p className="exam-q">{q.q}</p>
        {!answered ? (
          <div className="dialog-choices">
            {q.options.map((opt, idx) => (
              <button key={opt} type="button" className="dialog-choice" onClick={() => onAnswer(idx)}>
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            ))}
          </div>
        ) : null}
        {msg ? <p className="exam-msg">{msg}</p> : null}
        {answered && examIndex < 2 ? (
          <button type="button" className="btn-enter" onClick={onNext}>
            下一题
          </button>
        ) : null}
      </div>
    </div>
  );
}
