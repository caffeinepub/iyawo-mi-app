import { useMemo } from "react";

interface HeartParticle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingHearts() {
  const hearts = useMemo<HeartParticle[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 20,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.35,
    }));
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            bottom: "-5%",
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            animation: `float-up ${heart.duration}s ease-in-out ${heart.delay}s infinite`,
            color: `oklch(${0.65 + Math.random() * 0.15} 0.18 ${10 + Math.random() * 20})`,
            filter: "blur(0.5px)",
          }}
        >
          ♥
        </div>
      ))}
      {/* Large ambient hearts */}
      <div
        className="absolute bottom-10 left-1/4 text-6xl"
        style={{
          opacity: 0.06,
          animation: "float-up 12s ease-in-out 1s infinite",
          color: "oklch(0.72 0.14 25)",
        }}
      >
        ♥
      </div>
      <div
        className="absolute bottom-20 right-1/4 text-8xl"
        style={{
          opacity: 0.04,
          animation: "float-up 15s ease-in-out 3s infinite",
          color: "oklch(0.65 0.18 15)",
        }}
      >
        ♥
      </div>
    </div>
  );
}
