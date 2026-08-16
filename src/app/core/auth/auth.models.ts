export type AuthRequest = {
  username: string;
  password: string;
};

export type AuthResponse = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  accessToken: string;
};

export type RefreshResponse = {
  accessToken: string;
};
