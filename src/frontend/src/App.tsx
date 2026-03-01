import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  addPost,
  createCoupleSpace,
  getCouple,
  getOrCreateUserId,
  getPostsByCoupleId,
  getProfile,
  getUserCoupleId,
  joinCoupleSpace,
  newPostId,
  saveProfile,
  seedSamplePostsIfNeeded,
  updatePostHearts,
} from "./lib/storage";
import type {
  AppPage,
  CoupleSetupMode,
  CoupleSpace,
  Post,
  Profile,
} from "./types/iyawo";

import CoupleSetupPage from "./components/CoupleSetupPage";
import FeedPage from "./components/FeedPage";
import ProfilePage from "./components/ProfilePage";
import ProfileSetupPage from "./components/ProfileSetupPage";
import WelcomePage from "./components/WelcomePage";

export default function App() {
  const [page, setPage] = useState<AppPage>("welcome");
  const [coupleMode, setCoupleMode] = useState<CoupleSetupMode>("create");

  const [userId] = useState<string>(() => getOrCreateUserId());
  const [profile, setProfile] = useState<Profile | null>(() =>
    getProfile(userId),
  );
  const [couple, setCouple] = useState<CoupleSpace | null>(() => {
    const coupleId = getUserCoupleId(userId);
    return coupleId ? getCouple(coupleId) : null;
  });
  const [posts, setPosts] = useState<Post[]>([]);

  // Initialize page based on stored state (intentional run-once)
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount to set initial page
  useEffect(() => {
    if (profile && couple) {
      seedSamplePostsIfNeeded(couple.coupleId);
      setPosts(getPostsByCoupleId(couple.coupleId));
      setPage("feed");
    } else if (profile && !couple) {
      setPage("couple-setup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load posts when couple changes
  useEffect(() => {
    if (couple) {
      seedSamplePostsIfNeeded(couple.coupleId);
      setPosts(getPostsByCoupleId(couple.coupleId));
    }
  }, [couple]);

  // ── Handlers ──

  const handleStartStory = () => {
    setCoupleMode("create");
    if (profile) {
      setPage("couple-setup");
    } else {
      setPage("profile-setup");
    }
  };

  const handleJoinLove = () => {
    setCoupleMode("join");
    if (profile) {
      setPage("couple-setup");
    } else {
      setPage("profile-setup");
    }
  };

  const handleProfileComplete = (
    displayName: string,
    partnerNickname: string,
  ) => {
    const newProfile: Profile = { userId, displayName, partnerNickname };
    saveProfile(newProfile);
    setProfile(newProfile);
    setPage("couple-setup");
  };

  const handleCreateCouple = useCallback(() => {
    if (!profile) return;
    const newCouple = createCoupleSpace(userId, profile.displayName);
    setCouple(newCouple);
  }, [userId, profile]);

  const handleJoinCouple = useCallback(
    (code: string): string | null => {
      if (!profile) return "Profile not found";
      const joined = joinCoupleSpace(userId, profile.displayName, code);
      if (!joined) return "Code not found. Ask your love to double-check 💝";
      setCouple(joined);
      return null;
    },
    [userId, profile],
  );

  const handleCoupleReady = () => {
    setPage("feed");
  };

  const handleHeart = useCallback(
    (postId: string) => {
      const updated = updatePostHearts(postId, userId);
      if (couple) {
        setPosts(updated.filter((p) => p.coupleId === couple.coupleId));
      }
    },
    [userId, couple],
  );

  const handleAddPost = useCallback(
    (imageDataUrl: string, caption: string) => {
      if (!profile || !couple) return;
      const newPost: Post = {
        postId: newPostId(),
        coupleId: couple.coupleId,
        imageDataUrl,
        caption,
        senderUserId: userId,
        senderName: profile.displayName,
        timestamp: Date.now(),
        hearts: 0,
        heartedBy: [],
      };
      addPost(newPost);
      setPosts(getPostsByCoupleId(couple.coupleId));
      toast.success("Your moment has been shared ♥", {
        style: {
          background: "oklch(0.13 0.04 330)",
          border: "1px solid oklch(0.50 0.12 25 / 0.30)",
          color: "oklch(0.90 0.02 60)",
        },
      });
    },
    [userId, profile, couple],
  );

  const handleUpdateProfile = useCallback(
    (displayName: string, partnerNickname: string) => {
      if (!profile) return;
      const updated: Profile = { ...profile, displayName, partnerNickname };
      saveProfile(updated);
      setProfile(updated);
    },
    [profile],
  );

  const handleCopyInviteCode = (_code: string) => {
    toast.success("Invite code copied! Share it with your love ♥", {
      style: {
        background: "oklch(0.13 0.04 330)",
        border: "1px solid oklch(0.50 0.12 25 / 0.30)",
        color: "oklch(0.90 0.02 60)",
      },
    });
  };

  // ── Render ──

  return (
    <div
      className="app-container grain-overlay"
      style={{
        background: "oklch(0.09 0.025 330)",
        boxShadow: "0 0 80px oklch(0 0 0 / 0.6)",
      }}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "Outfit, sans-serif",
            fontSize: "14px",
          },
        }}
      />

      {page === "welcome" && (
        <WelcomePage
          onStartStory={handleStartStory}
          onJoinLove={handleJoinLove}
        />
      )}

      {page === "profile-setup" && (
        <ProfileSetupPage
          mode={coupleMode}
          onComplete={handleProfileComplete}
          onBack={() => setPage("welcome")}
        />
      )}

      {page === "couple-setup" && profile && (
        <CoupleSetupPage
          mode={coupleMode}
          userId={userId}
          displayName={profile.displayName}
          couple={coupleMode === "create" ? couple : null}
          onCreateCouple={handleCreateCouple}
          onJoinCouple={handleJoinCouple}
          onReady={handleCoupleReady}
          onBack={() => setPage(profile ? "welcome" : "profile-setup")}
        />
      )}

      {page === "feed" && profile && (
        <FeedPage
          posts={posts}
          profile={profile}
          couple={couple}
          onHeart={handleHeart}
          onAddPost={handleAddPost}
          onNavigateProfile={() => setPage("profile")}
        />
      )}

      {page === "profile" && profile && (
        <ProfilePage
          profile={profile}
          couple={couple}
          posts={posts}
          onUpdateProfile={handleUpdateProfile}
          onBack={() => setPage("feed")}
          onCopyInviteCode={handleCopyInviteCode}
        />
      )}
    </div>
  );
}
