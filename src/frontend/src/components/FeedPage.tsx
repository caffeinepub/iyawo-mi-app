import { useState } from "react";
import type { CoupleSpace, Post, Profile } from "../types/iyawo";
import PostCard from "./PostCard";
import PostComposerModal from "./PostComposerModal";

interface FeedPageProps {
  posts: Post[];
  profile: Profile;
  couple: CoupleSpace | null;
  onHeart: (postId: string) => void;
  onAddPost: (imageDataUrl: string, caption: string) => void;
  onNavigateProfile: () => void;
}

export default function FeedPage({
  posts,
  profile,
  couple,
  onHeart,
  onAddPost,
  onNavigateProfile,
}: FeedPageProps) {
  const [composerOpen, setComposerOpen] = useState(false);

  const partnerName =
    couple?.partner2Id && couple.partner2Id !== profile.userId
      ? (couple.partner2Name ?? profile.partnerNickname)
      : couple?.partner1Id !== profile.userId
        ? (couple?.partner1Name ?? profile.partnerNickname)
        : profile.partnerNickname;

  return (
    <div className="relative min-h-dvh flex flex-col mesh-bg">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.35 0.08 25 / 0.15) 0%, transparent 50%)",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 px-5 pt-12 pb-4"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.025 330 / 0.98) 0%, oklch(0.10 0.028 330 / 0.94) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid oklch(0.28 0.06 330 / 0.50)",
          boxShadow: "0 1px 20px oklch(0 0 0 / 0.18)",
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/iyawo-logo-transparent.dim_400x400.png"
              alt="Iyawo Mi"
              className="w-8 h-8 object-contain"
              style={{
                filter: "drop-shadow(0 0 8px oklch(0.75 0.16 25 / 0.55))",
              }}
            />
            <div>
              <h1
                className="font-display leading-none"
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  background:
                    "linear-gradient(135deg, oklch(0.90 0.04 55), oklch(0.80 0.14 28))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Iyawo Mi
              </h1>
              <p
                className="text-xs font-sans"
                style={{
                  color: "oklch(0.62 0.10 25)",
                  fontStyle: "italic",
                  letterSpacing: "0.01em",
                  marginTop: "1px",
                }}
              >
                {couple ? `♥ ${partnerName}` : "our sacred space"}
              </p>
            </div>
          </div>

          {/* Profile Button */}
          <button
            type="button"
            onClick={onNavigateProfile}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.14 25), oklch(0.58 0.20 12))",
              color: "oklch(0.97 0.01 60)",
              boxShadow: "0 2px 12px oklch(0.65 0.18 20 / 0.35)",
            }}
            aria-label="View profile"
          >
            {profile.displayName.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      {/* Feed */}
      <main className="relative z-10 flex-1 px-4 py-6 pb-28">
        {posts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-64 gap-6 text-center px-8 mt-10">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.15 0.04 330)",
                border: "2px solid oklch(0.40 0.10 25 / 0.30)",
              }}
            >
              <span className="text-3xl animate-pulse-heart" aria-hidden="true">
                ♥
              </span>
            </div>
            <div>
              <h3
                className="font-display text-2xl font-semibold mb-2"
                style={{ color: "oklch(0.90 0.02 60)" }}
              >
                Your story begins here
              </h3>
              <p
                className="font-serif-elegant text-base leading-relaxed"
                style={{ color: "oklch(0.60 0.04 330)" }}
              >
                Share your first photo and let {profile.partnerNickname} see
                your beautiful world.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="btn-rose-gold px-8 py-3 rounded-2xl font-sans font-semibold text-sm"
            >
              Share First Moment ♥
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Couple banner if both connected */}
            {couple?.partner2Id && (
              <div className="flex items-center justify-center gap-3 py-3">
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.55 0.10 25 / 0.35))",
                  }}
                  aria-hidden="true"
                />
                <p
                  className="font-sans text-xs"
                  style={{
                    color: "oklch(0.65 0.08 30)",
                    fontStyle: "italic",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  ♥ you & {partnerName} ♥
                </p>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background:
                      "linear-gradient(90deg, oklch(0.55 0.10 25 / 0.35), transparent)",
                  }}
                  aria-hidden="true"
                />
              </div>
            )}

            {posts.map((post, i) => (
              <div key={post.postId} style={{ animationDelay: `${i * 0.08}s` }}>
                <PostCard
                  post={post}
                  currentUserId={profile.userId}
                  partnerNickname={partnerName}
                  onHeart={onHeart}
                />
              </div>
            ))}

            {/* Bottom spacing */}
            <div className="h-4" />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div
        className="fixed bottom-8 right-1/2 translate-x-1/2 z-40"
        style={{
          maxWidth: "430px",
          right: "auto",
          position: "fixed",
          bottom: "2rem",
        }}
      >
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "calc(430px - 2rem)",
            width: "calc(100% - 2rem)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="btn-rose-gold rounded-full font-sans font-semibold text-sm flex items-center gap-2 shadow-rose-glow"
            style={{
              padding: "0.875rem 1.5rem",
              boxShadow: "0 8px 30px oklch(0.60 0.18 15 / 0.45)",
            }}
            aria-label="Share a new photo"
          >
            <span className="text-lg leading-none" aria-hidden="true">
              📷
            </span>
            Share Moment
          </button>
        </div>
      </div>

      {/* Post Composer Modal */}
      <PostComposerModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={onAddPost}
        partnerNickname={partnerName}
      />
    </div>
  );
}
