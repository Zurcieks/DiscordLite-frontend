export type GetConversationResponse = {
  conversations: ConversationDto[];
};

export type ConversationDto = {
  conversationId: string;
  type: ConversationType;
  displayName: string;
  avatarUrl: string | null;
};
export enum ConversationType {
  Direct = 0,
  Group = 1,
}
