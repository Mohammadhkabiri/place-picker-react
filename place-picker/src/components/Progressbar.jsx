import { useState, useEffect } from "react";

export default function Progressbar({Timer}) {
  const [remainingTime, setRemainingTime] = useState(3000);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 10);
    }, 10);
    return () => clearInterval(timer);
  });

  return <progress value={remainingTime} max={Timer} />;
}
