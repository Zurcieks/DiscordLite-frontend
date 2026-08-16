export type GetAllFriendsResponse = {
  friends: FriendshipDto[];
};

export type GetFriendRequestsResponse = {
  incoming: FriendRequestDto[];
  outgoing: FriendRequestDto[];
};

export type FriendshipDto = {
  friendshipId: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
};

export type FriendRequestDto = {
  friendshipId: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
  isIncoming: boolean;
};

export type AddFriendRequest = {
  username: string;
};
export type AddFriendResponse = {
  message: string;
};
