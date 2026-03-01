import { useState } from "react";
import type { CoupleSpace, Post, Profile } from "../types/iyawo";

interface ProfilePageProps {
  profile: Profile;
  couple: CoupleSpace | null;
  posts: Post[];
  onUpdateProfile: (displayName: string, partnerNickname: string) => void;
  onBack: () => void;
  onCopyInviteCode: (code: string) => void;
}

export default function ProfilePage({
  profile,
  couple,
  posts,
  onUpdateProfile,
  onBack,
  onCopyInviteCode,
}: ProfilePageProps) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [partnerNickname, setPartnerNickname] = useState(
    profile.partnerNickname,
  );
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const ownPosts = posts.filter(
    (p) => p.coupleId === couple?.coupleId && p.senderUserId === profile.userId,
  );
  const totalHearts = posts
    .filter((p) => p.coupleId === couple?.coupleId)
    .reduce((sum, p) => sum + p.hearts, 0);

  const partnerName =
    couple?.partner2Id && couple.partner2Id !== profile.userId
      ? (couple.partner2Name ?? profile.partnerNickname)
      : couple?.partner1Id !== profile.userId
        ? (couple?.partner1Name ?? profile.partnerNickname)
        : profile.partnerNickname;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    onUpdateProfile(
      displayName.trim(),
      partnerNickname.trim() || profile.partnerNickname,
    );
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopy = async () => {
    if (!couple) return;
    try {
      await navigator.clipboard.writeText(couple.inviteCode);
    } catch {
      const el = document.createElement("textarea");
      el.value = couple.inviteCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    onCopyInviteCode(couple.inviteCode);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative min-h-dvh flex flex-col mesh-bg page-transition">
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 10%, oklch(0.40 0.10 300 / 0.12) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 px-5 pt-14 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{
            background: "oklch(0.18 0.04 330 / 0.8)",
            border: "1px solid oklch(0.35 0.07 330)",
            color: "oklch(0.80 0.08 30)",
          }}
          aria-label="Go back to feed"
        >
          ←
        </button>
        <div>
          <h2
            className="font-display text-xl font-bold"
            style={{ color: "oklch(0.95 0.02 60)" }}
          >
            Your Profile
          </h2>
          <p
            className="text-xs font-sans"
            style={{ color: "oklch(0.65 0.10 25)" }}
          >
            Iyawo Mi
          </p>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-5 py-4 pb-12 space-y-5">
        {/* Profile Card */}
        <div
          className="glass-card rounded-3xl p-6 text-center"
          style={{
            background: "oklch(0.12 0.04 330 / 0.80)",
          }}
        >
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.14 25), oklch(0.55 0.20 12))",
                color: "oklch(0.97 0.01 60)",
                boxShadow: "0 4px 20px oklch(0.65 0.18 20 / 0.35)",
              }}
            >
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          </div>

          {!editing ? (
            <>
              <h3
                className="font-display text-2xl font-bold"
                style={{ color: "oklch(0.95 0.02 60)" }}
              >
                {profile.displayName}
              </h3>
              <p
                className="text-sm font-sans mt-1"
                style={{ color: "oklch(0.65 0.10 25)" }}
              >
                In love with {partnerName} ♥
              </p>
              {saved && (
                <p
                  className="text-xs font-sans mt-2"
                  style={{ color: "oklch(0.72 0.14 145)" }}
                >
                  ✓ Profile saved!
                </p>
              )}
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-4 px-6 py-2 rounded-full text-sm font-sans font-medium transition-all"
                style={{
                  background: "oklch(0.72 0.14 25 / 0.15)",
                  border: "1px solid oklch(0.60 0.12 25 / 0.40)",
                  color: "oklch(0.82 0.10 30)",
                }}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 mt-2 text-left">
              <div>
                <label
                  htmlFor="editName"
                  className="block text-xs font-sans font-medium mb-1"
                  style={{ color: "oklch(0.72 0.08 30)" }}
                >
                  Your Name
                </label>
                <input
                  id="editName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-romantic w-full"
                  maxLength={40}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label
                  htmlFor="editNickname"
                  className="block text-xs font-sans font-medium mb-1"
                  style={{ color: "oklch(0.72 0.08 30)" }}
                >
                  Partner's Nickname
                </label>
                <input
                  id="editNickname"
                  type="text"
                  value={partnerNickname}
                  onChange={(e) => setPartnerNickname(e.target.value)}
                  className="input-romantic w-full"
                  maxLength={30}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-rose-gold flex-1 py-3 rounded-xl font-sans font-semibold text-sm"
                >
                  Save ♥
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setDisplayName(profile.displayName);
                    setPartnerNickname(profile.partnerNickname);
                  }}
                  className="flex-1 py-3 rounded-xl font-sans font-medium text-sm transition-all"
                  style={{
                    background: "oklch(0.18 0.04 330 / 0.8)",
                    border: "1px solid oklch(0.30 0.06 330)",
                    color: "oklch(0.65 0.04 330)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stats */}
        <div
          className="glass-card rounded-3xl p-5"
          style={{ background: "oklch(0.12 0.04 330 / 0.80)" }}
        >
          <h4
            className="text-xs uppercase tracking-widest font-sans font-medium mb-4"
            style={{ color: "oklch(0.65 0.10 25)" }}
          >
            Your Love Stats
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Your Posts", value: ownPosts.length, icon: "📷" },
              {
                label: "Total Posts",
                value: posts.filter((p) => p.coupleId === couple?.coupleId)
                  .length,
                icon: "♥",
              },
              { label: "Hearts Given", value: totalHearts, icon: "💕" },
            ].map(({ label, value, icon }) => (
              <div key={label}>
                <div className="text-2xl mb-1" aria-hidden="true">
                  {icon}
                </div>
                <div
                  className="font-display text-2xl font-bold"
                  style={{ color: "oklch(0.88 0.12 25)" }}
                >
                  {value}
                </div>
                <div
                  className="text-xs font-sans mt-1"
                  style={{ color: "oklch(0.55 0.04 330)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Couple Connection */}
        {couple && (
          <div
            className="glass-card rounded-3xl p-5"
            style={{ background: "oklch(0.12 0.04 330 / 0.80)" }}
          >
            <h4
              className="text-xs uppercase tracking-widest font-sans font-medium mb-4"
              style={{ color: "oklch(0.65 0.10 25)" }}
            >
              Your Sacred Space
            </h4>

            {/* Connection Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* You */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.14 25), oklch(0.58 0.20 12))",
                    color: "oklch(0.97 0.01 60)",
                  }}
                >
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    className="text-sm font-sans font-semibold"
                    style={{ color: "oklch(0.88 0.02 60)" }}
                  >
                    {profile.displayName}
                  </p>
                  <p
                    className="text-xs font-sans"
                    style={{ color: "oklch(0.55 0.04 330)" }}
                  >
                    You
                  </p>
                </div>
              </div>

              <span
                style={{ color: "oklch(0.72 0.14 25)", fontSize: "20px" }}
                aria-hidden="true"
              >
                ♥
              </span>

              {/* Partner */}
              <div className="flex items-center gap-3 flex-row-reverse">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: couple.partner2Id
                      ? "linear-gradient(135deg, oklch(0.55 0.14 300), oklch(0.45 0.18 280))"
                      : "oklch(0.22 0.04 330)",
                    color: couple.partner2Id
                      ? "oklch(0.97 0.01 60)"
                      : "oklch(0.45 0.03 330)",
                    border: couple.partner2Id
                      ? "none"
                      : "2px dashed oklch(0.35 0.06 330)",
                  }}
                >
                  {couple.partner2Name
                    ? couple.partner2Name.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-sans font-semibold"
                    style={{ color: "oklch(0.88 0.02 60)" }}
                  >
                    {couple.partner2Name ?? "Waiting..."}
                  </p>
                  <p
                    className="text-xs font-sans"
                    style={{
                      color: couple.partner2Id
                        ? "oklch(0.55 0.10 145)"
                        : "oklch(0.55 0.04 330)",
                    }}
                  >
                    {couple.partner2Id ? "✓ Connected" : "Not joined yet"}
                  </p>
                </div>
              </div>
            </div>

            {/* Invite Code */}
            {!couple.partner2Id && (
              <div className="mt-3">
                <p
                  className="text-xs font-sans mb-2"
                  style={{ color: "oklch(0.60 0.05 330)" }}
                >
                  Share this code with {profile.partnerNickname} to connect:
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 py-2 px-4 rounded-xl text-center font-display text-lg tracking-[0.25em]"
                    style={{
                      background: "oklch(0.08 0.03 330)",
                      border: "1px solid oklch(0.45 0.10 25 / 0.30)",
                      color: "oklch(0.85 0.12 30)",
                    }}
                  >
                    {couple.inviteCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="py-2 px-4 rounded-xl text-sm font-sans font-medium transition-all flex-shrink-0"
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
                    {copied ? "✓" : "📋"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Photos Grid */}
        {ownPosts.length > 0 && (
          <div>
            <h4
              className="text-xs uppercase tracking-widest font-sans font-medium mb-3"
              style={{ color: "oklch(0.65 0.10 25)" }}
            >
              Your Moments
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {ownPosts.slice(0, 9).map((post) => (
                <div
                  key={post.postId}
                  className="aspect-square rounded-xl overflow-hidden"
                >
                  <img
                    src={post.imageDataUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p
          className="text-center text-xs font-sans pb-4"
          style={{ color: "oklch(0.35 0.03 330)" }}
        >
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.45 0.08 25)" }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </main>
    </div>
  );
}
