// ── Iyawo Mi App Types ──

export interface Profile {
  userId: string;
  displayName: string;
  partnerNickname: string;
}

export interface CoupleSpace {
  coupleId: string;
  inviteCode: string;
  partner1Id: string;
  partner1Name: string;
  partner2Id?: string;
  partner2Name?: string;
  createdAt: number;
}

export interface Post {
  postId: string;
  coupleId: string;
  imageDataUrl: string;
  caption: string;
  senderUserId: string;
  senderName: string;
  timestamp: number;
  hearts: number;
  heartedBy: string[];
}

export type AppPage =
  | "welcome"
  | "profile-setup"
  | "couple-setup"
  | "feed"
  | "profile";

export type CoupleSetupMode = "create" | "join";
