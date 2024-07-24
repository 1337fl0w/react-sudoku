import React, { useEffect, useState, useRef } from "react";

interface TimerProps {
  isActive: boolean;
  onTimeUpdate: (time: number) => void;
  initialTime: number;
}

const Timer: React.FC<TimerProps> = ({
  isActive,
  onTimeUpdate,
  initialTime,
}) => {
  const [seconds, setSeconds] = useState(initialTime);
  const secondsRef = useRef(initialTime);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive) {
      interval = window.setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
        onTimeUpdate(secondsRef.current);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval !== null) clearInterval(interval);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isActive, onTimeUpdate, seconds]);

  const formatTime = (time: number) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = `${Math.floor(time / 60)}`;
    const getMinutes = `0${Number(minutes) % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return <div>{formatTime(seconds)}</div>;
};

export default Timer;
