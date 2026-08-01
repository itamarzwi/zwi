import { useEffect, useState } from 'react';

import useMousePosition from './useMousePosition';

const useSmoothMousePosition = (smoothingFactor = 0.06) => {
  const rawMousePosition = useMousePosition();
  const [smoothedPosition, setSmoothedPosition] = useState(() => ({
    x: rawMousePosition.current.x,
    y: rawMousePosition.current.x,
  }));

  useEffect(() => {
    const smoothPosition = () => {
      setSmoothedPosition((prev) => {
        const curr = rawMousePosition.current;

        if (Math.abs(curr.x - prev.x) < 10 && Math.abs(curr.y - prev.y) < 10) {
          return curr;
        }

        return {
          x: lerp(prev.x, curr.x, smoothingFactor),
          y: lerp(prev.y, curr.y, smoothingFactor),
        };
      });
    };

    const intervalId = setInterval(smoothPosition, 7); // support max 144hz
    return () => clearInterval(intervalId);
  }, [rawMousePosition, smoothingFactor]);

  return smoothedPosition;
};

const lerp = (prev: number, cur: number, factor: number) => (1 - factor) * prev + factor * cur;

export default useSmoothMousePosition;
