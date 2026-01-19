import { useCountdown } from "../hooks/useCountdown";

export default function CountdownTimer({ date }) {
  const timer = useCountdown(date);

  if (timer.expired) {
    return (
      <span className="text-red-400 font-semibold animate-pulse">
        Event Expired ❌
      </span>
    );
  }

  let color = "text-green-400";
  if (timer.timeLeft < 3600000) color = "text-red-400";
  else if (timer.timeLeft < 86400000) color = "text-yellow-400";

  return (
    <div className={`flex gap-2 text-sm font-mono ${color}`}>
      <span>{timer.days}d</span>
      <span>{timer.hours}h</span>
      <span>{timer.minutes}m</span>
      <span>{timer.seconds}s</span>
    </div>
  );
}
