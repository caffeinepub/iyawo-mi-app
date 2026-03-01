import { useState } from "react";

interface ProfileSetupPageProps {
  mode: "create" | "join";
  onComplete: (displayName: string, partnerNickname: string) => void;
  onBack: () => void;
}

export default function ProfileSetupPage({
  mode,
  onComplete,
  onBack,
}: ProfileSetupPageProps) {
  const [displayName, setDisplayName] = useState("");
  const [partnerNickname, setPartnerNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Please enter your name, love 💝");
      return;
    }
    if (!partnerNickname.trim()) {
      setError("What do you call your special someone? 🌹");
      return;
    }
    onComplete(displayName.trim(), partnerNickname.trim());
  };

  const modeText = mode === "create" ? "Begin Your Story" : "Join Your Love";
  const suggestions = [
    "My King",
    "My Queen",
    "Baby",
    "My Love",
    "Sweetheart",
    "My Heart",
  ];

  return (
    <div className="relative min-h-dvh flex flex-col mesh-bg page-transition">
      {/* Background shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, oklch(0.40 0.08 25 / 0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, oklch(0.30 0.06 330 / 0.15) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 px-6 pt-14 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{
            background: "oklch(0.18 0.04 330 / 0.8)",
            border: "1px solid oklch(0.35 0.07 330)",
            color: "oklch(0.80 0.08 30)",
          }}
          aria-label="Go back"
        >
          ←
        </button>
        <div>
          <p
            className="text-xs uppercase tracking-widest font-sans"
            style={{ color: "oklch(0.65 0.10 25)" }}
          >
            Profile Setup
          </p>
          <h2
            className="font-display text-xl font-bold"
            style={{ color: "oklch(0.95 0.02 60)" }}
          >
            {modeText}
          </h2>
        </div>
      </header>

      {/* Main Form */}
      <main className="relative z-10 flex-1 px-6 pt-6 pb-8">
        {/* Decorative hearts */}
        <div className="text-center mb-8">
          <div
            className="font-display text-7xl font-light leading-none"
            style={{ color: "oklch(0.72 0.14 25 / 0.4)" }}
            aria-hidden="true"
          >
            ♥
          </div>
          <p
            className="font-serif-elegant text-base mt-2"
            style={{ color: "oklch(0.72 0.06 60 / 0.8)" }}
          >
            Tell us about you and your love
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Your Name */}
          <div className="space-y-2">
            <label
              htmlFor="displayName"
              className="block text-sm font-sans font-medium"
              style={{ color: "oklch(0.82 0.08 30)" }}
            >
              Your Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Adaeze, Chidi, Fatima..."
              className="input-romantic w-full"
              autoComplete="given-name"
              maxLength={40}
            />
          </div>

          {/* Partner Nickname */}
          <div className="space-y-3">
            <label
              htmlFor="partnerNickname"
              className="block text-sm font-sans font-medium"
              style={{ color: "oklch(0.82 0.08 30)" }}
            >
              What do you call your love?
            </label>
            <input
              id="partnerNickname"
              type="text"
              value={partnerNickname}
              onChange={(e) => {
                setPartnerNickname(e.target.value);
                setError("");
              }}
              placeholder="My King, Baby, My Queen..."
              className="input-romantic w-full"
              maxLength={30}
            />
            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPartnerNickname(s)}
                  className="px-3 py-1 rounded-full text-xs font-sans transition-all"
                  style={{
                    background:
                      partnerNickname === s
                        ? "oklch(0.72 0.14 25 / 0.30)"
                        : "oklch(0.20 0.04 330 / 0.8)",
                    border: `1px solid ${partnerNickname === s ? "oklch(0.72 0.14 25 / 0.60)" : "oklch(0.30 0.06 330)"}`,
                    color:
                      partnerNickname === s
                        ? "oklch(0.85 0.12 30)"
                        : "oklch(0.65 0.05 330)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-sm font-sans text-center py-2 px-4 rounded-xl"
              style={{
                background: "oklch(0.50 0.18 15 / 0.15)",
                border: "1px solid oklch(0.55 0.18 15 / 0.30)",
                color: "oklch(0.80 0.14 20)",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-rose-gold w-full py-4 rounded-2xl font-sans font-semibold text-base mt-4"
          >
            Continue ♥
          </button>
        </form>
      </main>
    </div>
  );
}
