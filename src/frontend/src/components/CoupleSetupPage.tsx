import { useEffect, useState } from "react";
import type { CoupleSpace } from "../types/iyawo";

interface CoupleSetupPageProps {
  mode: "create" | "join";
  userId: string;
  displayName: string;
  couple: CoupleSpace | null;
  onCreateCouple: () => void;
  onJoinCouple: (code: string) => string | null; // returns error or null
  onReady: () => void;
  onBack: () => void;
}

export default function CoupleSetupPage({
  mode,
  displayName,
  couple,
  onCreateCouple,
  onJoinCouple,
  onReady,
  onBack,
}: CoupleSetupPageProps) {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Auto-create on mount if mode === 'create' and no couple yet
  useEffect(() => {
    if (mode === "create" && !couple) {
      onCreateCouple();
    }
  }, [mode, couple, onCreateCouple]);

  const handleCopyCode = async () => {
    if (!couple) return;
    try {
      await navigator.clipboard.writeText(couple.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = couple.inviteCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsJoining(true);
    const result = onJoinCouple(joinCode);
    setIsJoining(false);
    if (result) {
      setError(result);
    }
  };

  return (
    <div className="relative min-h-dvh flex flex-col mesh-bg page-transition">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.45 0.12 20 / 0.12) 0%, transparent 65%)",
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
            {mode === "create" ? "Create Your Space" : "Join Your Love"}
          </p>
          <h2
            className="font-display text-xl font-bold"
            style={{ color: "oklch(0.95 0.02 60)" }}
          >
            {mode === "create" ? "Your Sacred Code" : "Enter the Code"}
          </h2>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 pt-4 pb-8 flex flex-col">
        {mode === "create" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            {/* Card */}
            <div
              className="glass-card w-full rounded-3xl p-8 text-center"
              style={{
                background: "oklch(0.12 0.04 330 / 0.80)",
                border: "1px solid oklch(0.50 0.12 25 / 0.25)",
              }}
            >
              <div
                className="font-display text-4xl mb-2"
                style={{ color: "oklch(0.72 0.14 25 / 0.5)" }}
              >
                ♥
              </div>
              <p
                className="font-sans text-sm mb-6"
                style={{ color: "oklch(0.68 0.04 330)" }}
              >
                Share this secret code with{" "}
                {displayName === "" ? "your love" : "your love"}. Only they can
                enter your sacred space.
              </p>

              {couple ? (
                <>
                  {/* The Code */}
                  <div
                    className="invite-code py-4 px-6 rounded-2xl mb-4 select-all"
                    style={{
                      background: "oklch(0.08 0.03 330)",
                      border: "1px solid oklch(0.60 0.14 25 / 0.30)",
                    }}
                  >
                    {couple.inviteCode}
                  </div>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="w-full py-3 rounded-xl font-sans text-sm font-medium transition-all"
                    style={{
                      background: copied
                        ? "oklch(0.45 0.14 145 / 0.20)"
                        : "oklch(0.72 0.14 25 / 0.15)",
                      border: `1px solid ${copied ? "oklch(0.55 0.14 145 / 0.50)" : "oklch(0.60 0.12 25 / 0.40)"}`,
                      color: copied
                        ? "oklch(0.75 0.14 145)"
                        : "oklch(0.82 0.10 30)",
                    }}
                  >
                    {copied ? "✓ Copied to clipboard!" : "📋 Copy Code"}
                  </button>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div
                    className="animate-pulse-heart text-4xl"
                    style={{ color: "oklch(0.72 0.14 25 / 0.4)" }}
                  >
                    ♥
                  </div>
                  <p
                    className="text-sm mt-2 font-sans"
                    style={{ color: "oklch(0.55 0.04 330)" }}
                  >
                    Creating your space...
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div
              className="w-full rounded-2xl p-5 space-y-3"
              style={{
                background: "oklch(0.14 0.03 330 / 0.6)",
                border: "1px solid oklch(0.28 0.05 330)",
              }}
            >
              <p
                className="font-sans text-xs uppercase tracking-widest"
                style={{ color: "oklch(0.60 0.10 25)" }}
              >
                How it works
              </p>
              {[
                ["1", "Share this code with your love"],
                ["2", "They open the app and tap 'Join My Love'"],
                ["3", "They enter this code to connect"],
                ["4", "You're both in your private space ♥"],
              ].map(([num, text]) => (
                <div key={num} className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{
                      background: "oklch(0.72 0.14 25 / 0.20)",
                      color: "oklch(0.82 0.12 25)",
                    }}
                  >
                    {num}
                  </span>
                  <span
                    className="text-sm font-sans"
                    style={{ color: "oklch(0.72 0.05 60)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Wait / Continue Button */}
            <button
              type="button"
              onClick={onReady}
              className="btn-rose-gold w-full py-4 rounded-2xl font-sans font-semibold text-base"
            >
              Enter Our Space ♥
            </button>

            <p
              className="text-xs text-center font-sans"
              style={{ color: "oklch(0.45 0.03 330)" }}
            >
              Your partner can join later. You can still explore the app.
            </p>
          </div>
        )}

        {mode === "join" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            {/* Decorative */}
            <div className="text-center">
              <div
                className="font-display text-6xl font-light"
                style={{ color: "oklch(0.72 0.14 25 / 0.4)" }}
                aria-hidden="true"
              >
                🔐
              </div>
              <p
                className="font-serif-elegant text-base mt-2"
                style={{ color: "oklch(0.72 0.06 60 / 0.8)" }}
              >
                Enter the secret code your love shared with you
              </p>
            </div>

            <form onSubmit={handleJoin} className="w-full space-y-4">
              <div>
                <label
                  htmlFor="joinCode"
                  className="block text-sm font-sans font-medium mb-2"
                  style={{ color: "oklch(0.82 0.08 30)" }}
                >
                  Invite Code
                </label>
                <input
                  id="joinCode"
                  type="text"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value.toUpperCase());
                    setError("");
                  }}
                  placeholder="e.g. ABC123"
                  className="input-romantic w-full text-center text-2xl tracking-[0.3em] font-display uppercase"
                  maxLength={6}
                  autoComplete="off"
                  autoCapitalize="characters"
                />
              </div>

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

              <button
                type="submit"
                disabled={isJoining || joinCode.length < 4}
                className="btn-rose-gold w-full py-4 rounded-2xl font-sans font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? "Finding your love..." : "Join Our Space ♥"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
