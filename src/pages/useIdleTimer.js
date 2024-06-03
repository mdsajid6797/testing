import React, { useState } from "react";
import { useIdleTimer } from "react-idle-timer";

function useIdle({ onIdle, idleTime }) {
  const [isIdle, setIsIdle] = useState(null);

  //handles what happens when the user is idle
  const handleOnIdle = (event) => {
    setIsIdle(true); //set the state to true
    const currentTime = new Date();
    const formattedCurrentTime = currentTime.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    });

    onIdle(); //then call onIdle function
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * idleTime,
    onIdle: handleOnIdle,
    debounce: 500,
  });
  return {
    getRemainingTime,
    getLastActiveTime,
    isIdle,
  };
}

export default useIdle;