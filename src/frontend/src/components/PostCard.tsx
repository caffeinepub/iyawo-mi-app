import { useState } from "react";
import type { Post } from "../types/iyawo";

interface PostCardProps {
  post: Post;
  currentUserId: string;
  partnerNickname: string;
  onHeart: (postId: string) => void;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function formatDateFull(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({
  post,
  currentUserId,
  partnerNickname,
  onHeart,
}: PostCardProps) {
  const [heartAnimating, setHeartAnimating] = useState(false);
  const isHearted = post.heartedBy.includes(currentUserId);
  const isOwn = post.senderUserId === currentUserId;

  const handleHeart = () => {
    setHeartAnimating(true);
    onHeart(post.postId);
    setTimeout(() => setHeartAnimating(false), 500);
  };

  const senderLabel = isOwn ? "You" : partnerNickname;

  return (
    <article
      className="animate-fade-in-up"
      style={{
        animationFillMode: "both",
        borderRadius: "1.5rem",
        overflow: "hidden",
        /* Card construction: outer glow ring + glass layer */
        background: "oklch(0.11 0.035 330 / 0.85)",
        border: "1px solid oklch(0.42 0.10 25 / 0.28)",
        boxShadow: [
          "0 2px 1px oklch(0.80 0.08 30 / 0.06) inset",
          "0 -1px 1px oklch(0 0 0 / 0.20) inset",
          "0 8px 32px oklch(0.55 0.16 15 / 0.10)",
          "0 2px 8px oklch(0 0 0 / 0.35)",
        ].join(", "),
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        transition: "box-shadow 0.35s ease, border-color 0.35s ease",
      }}
    >
      {/* ── Sender header ── */}
      <div
        className="flex items-center gap-3 px-5 pt-5 pb-4"
        style={{
          borderBottom: "1px solid oklch(0.30 0.05 330 / 0.50)",
        }}
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: isOwn
              ? "linear-gradient(145deg, oklch(0.76 0.14 28), oklch(0.60 0.20 12))"
              : "linear-gradient(145deg, oklch(0.58 0.14 290), oklch(0.46 0.18 270))",
            color: "oklch(0.97 0.01 60)",
            boxShadow: isOwn
              ? "0 2px 8px oklch(0.65 0.18 20 / 0.40), inset 0 1px 0 oklch(0.90 0.06 35 / 0.20)"
              : "0 2px 8px oklch(0.50 0.14 280 / 0.40), inset 0 1px 0 oklch(0.80 0.06 300 / 0.20)",
            letterSpacing: "0.01em",
          }}
        >
          {(isOwn ? "You" : partnerNickname).charAt(0).toUpperCase()}
        </div>

        {/* Sender info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-sans font-semibold leading-none"
            style={{ color: "oklch(0.93 0.02 58)" }}
          >
            {senderLabel}
          </p>
          <p
            className="text-xs font-sans mt-1"
            style={{
              color: "oklch(0.52 0.04 330)",
              fontStyle: "italic",
              letterSpacing: "0.01em",
            }}
          >
            {formatTimeAgo(post.timestamp)} · {formatDateFull(post.timestamp)}
          </p>
        </div>
      </div>

      {/* ── Photo — full-bleed with editorial inner frame ── */}
      <div className="relative" style={{ background: "oklch(0.07 0.02 300)" }}>
        <img
          src={post.imageDataUrl}
          alt={post.caption || `Shared by ${senderLabel}`}
          className="w-full block"
          style={{
            maxHeight: "440px",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
          loading="lazy"
        />

        {/* Bottom gradient — creates seamless merge into caption area */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, oklch(0.08 0.03 330 / 0.85) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Inner frame shadow — gives photo depth/dimensionality */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow:
              "inset 0 0 0 1px oklch(0 0 0 / 0.25), inset 0 2px 6px oklch(0 0 0 / 0.15)",
          }}
          aria-hidden="true"
        />

        {/* Caption overlaid on bottom of photo */}
        {post.caption && (
          <div
            className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10"
            style={{
              background:
                "linear-gradient(to top, oklch(0.08 0.03 330 / 0.92) 0%, transparent 100%)",
            }}
          >
            <p
              className="font-serif-elegant text-base leading-relaxed"
              style={{
                color: "oklch(0.94 0.02 58)",
                fontStyle: "italic",
                fontWeight: 400,
                textShadow: "0 1px 3px oklch(0 0 0 / 0.6)",
              }}
            >
              {post.caption}
            </p>
          </div>
        )}
      </div>

      {/* ── Actions row ── */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          borderTop: "1px solid oklch(0.22 0.04 330 / 0.60)",
        }}
      >
        {/* Heart — gesture-like treatment */}
        <button
          type="button"
          onClick={handleHeart}
          className="group flex items-center gap-2.5 transition-all"
          style={{ WebkitTapHighlightColor: "transparent" }}
          aria-label={`${isHearted ? "Remove heart from" : "Heart"} this moment`}
        >
          <span
            className={`transition-transform ${heartAnimating ? "animate-heart-burst" : "group-hover:scale-110"}`}
            style={{
              fontSize: "22px",
              color: isHearted ? "oklch(0.72 0.24 15)" : "oklch(0.48 0.06 330)",
              display: "inline-block",
              lineHeight: 1,
              filter: isHearted
                ? "drop-shadow(0 0 6px oklch(0.65 0.22 15 / 0.50))"
                : "none",
              transition: "color 0.2s ease, filter 0.2s ease",
            }}
            aria-hidden="true"
          >
            {isHearted ? "♥" : "♡"}
          </span>
          <span
            className="text-sm font-sans tabular-nums"
            style={{
              color: isHearted ? "oklch(0.78 0.16 20)" : "oklch(0.52 0.04 330)",
              fontWeight: isHearted ? 600 : 400,
              transition: "color 0.2s ease",
            }}
          >
            {post.hearts}
          </span>
        </button>

        {/* Faint date label */}
        <p
          className="text-xs font-sans"
          style={{
            color: "oklch(0.40 0.03 330)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {new Date(post.timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </article>
  );
}
