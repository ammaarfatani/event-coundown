import { useEffect, useRef, useState } from "react";

export const useCountdown = (targetDate) => {
  const targetTime = new Date(targetDate).getTime();

  const startRef = useRef(Date.now());
  const totalDurationRef = useRef(
    Math.max(targetTime - startRef.current, 1)
  );

  const [timeLeft, setTimeLeft] = useState(
    Math.max(targetTime - Date.now(), 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(targetTime - Date.now(), 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  if (timeLeft <= 0) {
    return { expired: true };
  }

  const progress =
    1 - timeLeft / totalDurationRef.current;

  return {
    expired: false,
    days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeLeft / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((timeLeft / 1000 / 60) % 60),
    seconds: Math.floor((timeLeft / 1000) % 60),
    timeLeft,
    progress: Math.min(Math.max(progress, 0), 1),
  };
};
