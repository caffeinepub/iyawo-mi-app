// ── localStorage helpers for Iyawo Mi App ──
import type { CoupleSpace, Post, Profile } from "../types/iyawo";

const KEYS = {
  myUserId: "iyawo_myUserId",
  profile: (userId: string) => `iyawo_profile_${userId}`,
  couple: (coupleId: string) => `iyawo_couple_${coupleId}`,
  userCouple: (userId: string) => `iyawo_usercouple_${userId}`,
  invite: (code: string) => `iyawo_invite_${code}`,
  posts: "iyawo_posts",
} as const;

function genId(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── User ID ──
export function getOrCreateUserId(): string {
  let id = localStorage.getItem(KEYS.myUserId);
  if (!id) {
    id = genId();
    localStorage.setItem(KEYS.myUserId, id);
  }
  return id;
}

// ── Profile ──
export function getProfile(userId: string): Profile | null {
  const raw = localStorage.getItem(KEYS.profile(userId));
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(KEYS.profile(profile.userId), JSON.stringify(profile));
}

// ── Couple Space ──
export function getCouple(coupleId: string): CoupleSpace | null {
  const raw = localStorage.getItem(KEYS.couple(coupleId));
  return raw ? JSON.parse(raw) : null;
}

export function saveCouple(couple: CoupleSpace): void {
  localStorage.setItem(KEYS.couple(couple.coupleId), JSON.stringify(couple));
}

export function getUserCoupleId(userId: string): string | null {
  return localStorage.getItem(KEYS.userCouple(userId));
}

export function setUserCoupleId(userId: string, coupleId: string): void {
  localStorage.setItem(KEYS.userCouple(userId), coupleId);
}

// ── Invite Code ──
export function getCoupleByInviteCode(code: string): CoupleSpace | null {
  const coupleId = localStorage.getItem(KEYS.invite(code));
  if (!coupleId) return null;
  return getCouple(coupleId);
}

export function setInviteCode(code: string, coupleId: string): void {
  localStorage.setItem(KEYS.invite(code), coupleId);
}

// ── Create Couple Space ──
export function createCoupleSpace(
  userId: string,
  displayName: string,
): CoupleSpace {
  const coupleId = genId();
  const inviteCode = genCode();
  const couple: CoupleSpace = {
    coupleId,
    inviteCode,
    partner1Id: userId,
    partner1Name: displayName,
    createdAt: Date.now(),
  };
  saveCouple(couple);
  setInviteCode(inviteCode, coupleId);
  setUserCoupleId(userId, coupleId);
  return couple;
}

// ── Join Couple Space ──
export function joinCoupleSpace(
  userId: string,
  displayName: string,
  inviteCode: string,
): CoupleSpace | null {
  const couple = getCoupleByInviteCode(inviteCode.toUpperCase().trim());
  if (!couple) return null;
  if (couple.partner1Id === userId) return couple; // already in this couple
  if (couple.partner2Id) return null; // couple full

  const updated: CoupleSpace = {
    ...couple,
    partner2Id: userId,
    partner2Name: displayName,
  };
  saveCouple(updated);
  setUserCoupleId(userId, updated.coupleId);
  return updated;
}

// ── Posts ──
export function getAllPosts(): Post[] {
  const raw = localStorage.getItem(KEYS.posts);
  return raw ? JSON.parse(raw) : [];
}

export function saveAllPosts(posts: Post[]): void {
  localStorage.setItem(KEYS.posts, JSON.stringify(posts));
}

export function getPostsByCoupleId(coupleId: string): Post[] {
  return getAllPosts().filter((p) => p.coupleId === coupleId);
}

export function addPost(post: Post): void {
  const posts = getAllPosts();
  posts.unshift(post);
  saveAllPosts(posts);
}

export function updatePostHearts(postId: string, userId: string): Post[] {
  const posts = getAllPosts();
  const updated = posts.map((p) => {
    if (p.postId !== postId) return p;
    const alreadyHearted = p.heartedBy.includes(userId);
    return {
      ...p,
      hearts: alreadyHearted ? p.hearts - 1 : p.hearts + 1,
      heartedBy: alreadyHearted
        ? p.heartedBy.filter((id) => id !== userId)
        : [...p.heartedBy, userId],
    };
  });
  saveAllPosts(updated);
  return updated;
}

// ── New Post ID ──
export function newPostId(): string {
  return genId();
}

// ── Seed Sample Posts (for demo) ──
export function seedSamplePostsIfNeeded(coupleId: string): void {
  const existing = getPostsByCoupleId(coupleId);

  // Inject the latest reply photo if it hasn't been added yet
  const replyPostId = "iyawo_reply_52a085ff";
  const all = getAllPosts();
  const alreadyHasReply = all.some((p) => p.postId === replyPostId);
  if (!alreadyHasReply) {
    const replyPost: Post = {
      postId: replyPostId,
      coupleId,
      imageDataUrl:
        "/assets/uploads/52a085ff-063d-434d-9fd6-835b6662e7e7-1.jpeg",
      caption:
        "Sending you all my love across the miles, my heart 💋 Missing you every single day.",
      senderUserId: "demo_partner",
      senderName: "My Love",
      timestamp: Date.now() - 1800000,
      hearts: 18,
      heartedBy: [],
    };
    saveAllPosts([replyPost, ...all]);
  }

  if (existing.length > 0) return;

  const samplePosts: Post[] = [
    {
      postId: genId(),
      coupleId,
      imageDataUrl:
        "/assets/uploads/52a085ff-063d-434d-9fd6-835b6662e7e7-1.jpeg",
      caption:
        "Sending you all my love across the miles, my heart 💋 Missing you every single day.",
      senderUserId: "demo_partner",
      senderName: "My Love",
      timestamp: Date.now() - 1800000,
      hearts: 18,
      heartedBy: [],
    },
    {
      postId: genId(),
      coupleId,
      imageDataUrl:
        "/assets/uploads/8e579193-5cd7-4250-b776-6ed6f13971a5-1.jpeg",
      caption:
        "Good morning, beautiful soul. Every sunrise makes me think of you ☀️",
      senderUserId: "demo_partner",
      senderName: "My Love",
      timestamp: Date.now() - 86400000,
      hearts: 7,
      heartedBy: [],
    },
    {
      postId: genId(),
      coupleId,
      imageDataUrl:
        "/assets/uploads/8e579193-5cd7-4250-b776-6ed6f13971a5-1.jpeg",
      caption:
        "The distance between us is just a temporary chapter in our forever story 💫",
      senderUserId: "demo_partner",
      senderName: "My Love",
      timestamp: Date.now() - 172800000,
      hearts: 24,
      heartedBy: [],
    },
  ];

  const allPosts = getAllPosts();
  const toAdd = samplePosts.filter(
    (_s) =>
      !allPosts.some(
        (a) => a.coupleId === coupleId && a.senderUserId === "demo_partner",
      ),
  );
  if (toAdd.length > 0) {
    saveAllPosts([...toAdd, ...allPosts]);
  }
}
