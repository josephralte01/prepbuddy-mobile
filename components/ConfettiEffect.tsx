import React, { useRef, useEffect } from "react";
import ConfettiCannon from "react-native-confetti-cannon";

export default function ConfettiEffect({ trigger }: { trigger: boolean }) {
  const confettiRef = useRef(null);

  useEffect(() => {
    if (trigger && confettiRef.current) {
      confettiRef.current.start();
    }
  }, [trigger]);

  if (!trigger) return null;

  return (
    <ConfettiCannon
      ref={confettiRef}
      count={100}
      origin={{ x: -10, y: 0 }}
      autoStart={true}
      fadeOut={true}
      fallSpeed={3000}
    />
  );
}
