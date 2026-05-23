import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

const TimeFlash = forwardRef(function TimeFlash(_, ref) {
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play(title, sub) {
      if (!overlayRef.current) return;
      titleRef.current.textContent = title;
      subRef.current.textContent = sub || "时间缝";
      gsap
        .timeline()
        .set(overlayRef.current, { display: "grid", opacity: 0 })
        .to(overlayRef.current, { opacity: 1, duration: 0.08 })
        .fromTo(
          overlayRef.current.querySelector(".time-flash-card"),
          { scale: 0.92 },
          { scale: 1, duration: 0.18 }
        )
        .to(overlayRef.current, { opacity: 0, duration: 0.38, delay: 0.42 })
        .set(overlayRef.current, { display: "none" });
      if (navigator.vibrate) navigator.vibrate([30, 40, 20]);
    },
  }));

  return (
    <div className="time-flash" ref={overlayRef}>
      <div className="time-flash-card">
        <b ref={titleRef}>时间缝</b>
        <small ref={subRef}>未来一闪即灭</small>
      </div>
    </div>
  );
});

export default TimeFlash;
