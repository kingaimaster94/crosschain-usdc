import { useEffect, useState } from "react";
import { useReward } from "react-rewards";

const useConfetti = (
  id: string,
  shouldStartConfetti: boolean,
  maxRestart = 3
) => {
  const [confettiCount, setConfettiCount] = useState(0);
  const { reward, isAnimating } = useReward(id, "confetti", {
    elementCount: 100,
    onAnimationComplete: () => {
      setConfettiCount(confettiCount + 1);
    },
  });

  useEffect(() => {
    if (shouldStartConfetti && !isAnimating && confettiCount < maxRestart) {
      reward();
    }
  }, [confettiCount, isAnimating, maxRestart, reward, shouldStartConfetti]);
};

export default useConfetti;
