import FloatingHearts from "./FloatingHearts";

interface WelcomePageProps {
  onStartStory: () => void;
  onJoinLove: () => void;
}

export default function WelcomePage({
  onStartStory,
  onJoinLove,
}: WelcomePageProps) {
  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden">
      {/* ── Cinematic Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/romantic-bg.dim_1200x800.jpg')",
          opacity: 0.55,
          transform: "scale(1.05)",
        }}
        aria-hidden="true"
      />

      {/* Multi-layer atmospheric overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            /* Deep vignette edges */
            "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 30%, oklch(0.05 0.02 300 / 0.85) 100%)",
            /* Top darkening */
            "linear-gradient(180deg, oklch(0.06 0.02 300 / 0.90) 0%, transparent 25%)",
            /* Bottom darkening for CTAs */
            "linear-gradient(0deg, oklch(0.06 0.02 300 / 0.97) 0%, oklch(0.06 0.02 300 / 0.75) 30%, transparent 55%)",
            /* Center spotlight */
            "radial-gradient(ellipse 70% 55% at 50% 42%, oklch(0.22 0.06 20 / 0.20) 0%, transparent 70%)",
          ].join(", "),
        }}
        aria-hidden="true"
      />

      {/* Floating Hearts */}
      <FloatingHearts />

      {/* ── Top eyebrow ── */}
      <div className="relative z-10 pt-14 text-center px-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3" aria-hidden="true">
          <div
            style={{
              width: "40px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, oklch(0.72 0.14 25 / 0.6))",
            }}
          />
          <span
            className="text-xs tracking-[0.35em] uppercase font-sans"
            style={{ color: "oklch(0.72 0.14 25 / 0.9)" }}
          >
            exclusively for two
          </span>
          <div
            style={{
              width: "40px",
              height: "1px",
              background:
                "linear-gradient(90deg, oklch(0.72 0.14 25 / 0.6), transparent)",
            }}
          />
        </div>
      </div>

      {/* ── Center Hero ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center gap-6 -mt-8">
        {/* Big Love Heart Image */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulse glow rings */}
          <div
            className="absolute rounded-full"
            style={{
              width: "clamp(320px, 88vw, 420px)",
              height: "clamp(320px, 88vw, 420px)",
              background:
                "radial-gradient(circle, oklch(0.65 0.24 18 / 0.22) 0%, transparent 65%)",
              animation: "pulse-heart 3s ease-in-out infinite",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "clamp(360px, 96vw, 480px)",
              height: "clamp(360px, 96vw, 480px)",
              background:
                "radial-gradient(circle, oklch(0.58 0.20 15 / 0.10) 0%, transparent 60%)",
              animation: "pulse-heart 3s ease-in-out infinite 1s",
            }}
            aria-hidden="true"
          />
          {/* Heart image — large and dominant */}
          <img
            src="/assets/generated/love-heart-hero-big.dim_800x800.jpg"
            alt="Love Heart"
            style={{
              width: "clamp(260px, 75vw, 360px)",
              height: "clamp(260px, 75vw, 360px)",
              objectFit: "cover",
              borderRadius: "50%",
              boxShadow: [
                "0 0 80px oklch(0.62 0.24 16 / 0.65)",
                "0 0 160px oklch(0.52 0.20 12 / 0.35)",
                "0 12px 48px oklch(0 0 0 / 0.55)",
                "inset 0 1px 0 oklch(0.88 0.08 30 / 0.15)",
              ].join(", "),
              border: "2px solid oklch(0.68 0.18 25 / 0.45)",
            }}
          />
        </div>

        {/* App wordmark — luxury editorial treatment */}
        <div className="flex flex-col items-center gap-3">
          <h1
            className="font-display leading-none tracking-tight"
            style={{
              fontSize: "clamp(3.5rem, 15vw, 5.5rem)",
              fontWeight: 300,
              background:
                "linear-gradient(135deg, oklch(0.92 0.04 55) 0%, oklch(0.85 0.14 30) 35%, oklch(0.78 0.18 20) 55%, oklch(0.88 0.10 40) 80%, oklch(0.82 0.12 25) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              letterSpacing: "-0.02em",
            }}
          >
            Iyawo Mi
          </h1>

          {/* Decorative divider */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <div
              style={{
                width: "28px",
                height: "1px",
                background: "oklch(0.65 0.12 25 / 0.5)",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                color: "oklch(0.70 0.12 25 / 0.8)",
                letterSpacing: "0.18em",
                fontFamily: "'Fraunces', serif",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              our sacred space
            </span>
            <div
              style={{
                width: "28px",
                height: "1px",
                background: "oklch(0.65 0.12 25 / 0.5)",
              }}
            />
          </div>
        </div>

        {/* Tagline */}
        <p
          className="font-serif-elegant text-lg leading-loose max-w-[280px]"
          style={{
            color: "oklch(0.82 0.04 55 / 0.85)",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          A private world only the two of you will ever know.
        </p>
      </div>

      {/* ── Bottom CTAs ── */}
      <div className="relative z-10 w-full px-7 pb-12 flex flex-col gap-3">
        {/* Primary CTA — shimmer treatment */}
        <button
          type="button"
          onClick={onStartStory}
          className="relative w-full overflow-hidden rounded-2xl font-sans font-semibold text-base tracking-wide"
          style={{
            padding: "1.1rem 1.5rem",
            background:
              "linear-gradient(135deg, oklch(0.76 0.14 28) 0%, oklch(0.64 0.20 14) 55%, oklch(0.58 0.22 8) 100%)",
            color: "oklch(0.97 0.01 60)",
            boxShadow: [
              "0 4px 24px oklch(0.62 0.20 15 / 0.45)",
              "0 1px 0 oklch(0.85 0.10 35 / 0.25) inset",
              "0 -1px 0 oklch(0.40 0.12 10 / 0.30) inset",
            ].join(", "),
            border: "1px solid oklch(0.75 0.14 28 / 0.35)",
          }}
        >
          {/* Shimmer overlay */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.08) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
            }}
            aria-hidden="true"
          />
          <span className="relative">✦ Start Our Story</span>
        </button>

        {/* Secondary CTA */}
        <button
          type="button"
          onClick={onJoinLove}
          className="w-full rounded-2xl font-sans font-medium text-base tracking-wide"
          style={{
            padding: "1.05rem 1.5rem",
            background: "oklch(0.95 0.01 60 / 0.06)",
            color: "oklch(0.85 0.06 40)",
            border: "1px solid oklch(0.70 0.10 28 / 0.35)",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s ease",
          }}
        >
          Enter a Code
        </button>

        {/* Footer */}
        <p
          className="text-center text-xs mt-1 font-sans"
          style={{ color: "oklch(0.42 0.03 330)" }}
        >
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.52 0.08 25)" }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
