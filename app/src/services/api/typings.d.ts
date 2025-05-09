declare namespace API {
  type ApplicationCreateDto = {
    title: string;
    description?: string;
    content?: string;
    imageUrl?: string;
    link?: string;
    displayOrder?: number;
    categoryId: number;
  };

  type ApplicationUpdateDto = {
    title: string;
    description?: string;
    content?: string;
    imageUrl?: string;
    link?: string;
    displayOrder?: number;
    isActive?: boolean;
    categoryId: number;
  };

  type AppVisitDto = {
    appId: number;
    title: string;
    imageUrl?: string;
    link?: string;
  };

  type CategoryCreateDto = {
    name: string;
    displayOrder?: number;
  };

  type CategoryUpdateDto = {
    name: string;
    displayOrder?: number;
    isActive?: boolean;
  };

  type ChatMessageDto = {
    id?: number;
    senderId?: number;
    senderName?: string;
    senderAvatar?: string;
    receiverId?: number;
    receiverName?: string;
    receiverAvatar?: string;
    content?: string;
    isRead?: boolean;
    createdAt?: string;
    readAt?: string;
  };

  type CommentCreateDto = {
    content: string;
    contentId: number;
    targetType?: string;
    parentId?: number;
  };

  type ConversationPartnerDto = {
    userId?: number;
    username?: string;
    avatarUrl?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
  };

  type CreatePrivateMessageDto = {
    receiverId: number;
    content: string;
  };

  type deleteAdminAppitemsApplicationsApplicationIdParams = {
    applicationId: number;
  };

  type deleteAdminAppitemsCategoriesCategoryIdParams = {
    categoryId: number;
  };

  type deleteChatMessageMessageIdParams = {
    messageId: number;
  };

  type deleteCommentIdParams = {
    id: number;
  };

  type deletePublisherIdParams = {
    id: number;
  };

  type deleteUserContentIdParams = {
    id: number;
  };

  type deleteUserFollowIdParams = {
    id: number;
  };

  type deleteUserRecordClearRecordTypeParams = {
    recordType: RecordType;
  };

  type deleteUserRecordIdParams = {
    id: number;
  };

  type getAdminAppitemsApplicationsApplicationIdParams = {
    applicationId: number;
  };

  type getAdminAppitemsCategoriesCategoryIdParams = {
    categoryId: number;
  };

  type getAppItemIdParams = {
    id: number;
  };

  type getChatMessageParams = {
    Page?: number;
    Limit?: number;
    PartnerId?: number;
    Unread?: boolean;
  };

  type getCommentParams = {
    Page?: number;
    Limit?: number;
    ContentId?: number;
    TargetType?: string;
    ParentId?: number;
  };

  type getPublisherAllParams = {
    page?: number;
    pageSize?: number;
    status?: string;
  };

  type getPublisherIdMyRatingParams = {
    id: number;
  };

  type getPublisherIdParams = {
    id: number;
  };

  type getPublisherIdRatingsParams = {
    id: number;
    page?: number;
    pageSize?: number;
  };

  type getPublisherPendingParams = {
    page?: number;
    pageSize?: number;
  };

  type getUserContentIdParams = {
    id: number;
  };

  type getUserContentParams = {
    Page?: number;
    Limit?: number;
  };

  type getUserFollowCheckIdParams = {
    id: number;
  };

  type getUserFollowParams = {
    Page?: number;
    Limit?: number;
  };

  type getUserRecordContentIdParams = {
    id: number;
  };

  type getUserRecordParams = {
    Page?: number;
    Limit?: number;
    RecordType?: string;
  };

  type LoginRequest = {
    phone: string;
    code: string;
  };

  type PagedResultOfChatMessageDto = {
    data?: ChatMessageDto[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };

  type postPublisherIdRateParams = {
    id: number;
  };

  type postPublisherIdRefreshStatsParams = {
    id: number;
  };

  type postPublisherIdReviewParams = {
    id: number;
  };

  type PublisherCreateUpdateRequest = {
    name?: string;
    avatarUrl?: string;
    description?: string;
    type?: PublisherType;
    website?: string;
    appLink?: string;
  };

  type PublisherType = integer;

  type putAdminAppitemsApplicationsApplicationIdParams = {
    applicationId: number;
  };

  type putAdminAppitemsCategoriesCategoryIdParams = {
    categoryId: number;
  };

  type putChatMessageMessageIdReadParams = {
    messageId: number;
  };

  type putChatMessageReadAllPartnerIdParams = {
    partnerId: number;
  };

  type RatePublisherRequestDto = {
    rating: number;
    comment?: string;
  };

  type RecordType = integer;

  type RegisterRequest = {
    name: string;
    phone: string;
    code: string;
    password?: string;
  };

  type ReviewPublisherRequest = {
    approved?: boolean;
    reviewNote?: string;
  };

  type SendCodeRequest = {
    phone: string;
  };

  type UpdateProfileRequest = {
    username: string;
    avatarUrl: string;
  };

  type UserContentCreateDto = {
    title: string;
    content?: string;
    images: string[];
  };

  type UserFollowCreateDto = {
    followingId: number;
  };

  type UserRecordCreateDto = {
    recordType: RecordType;
    title: string;
    imageUrl?: string;
    targetId?: number;
    targetType?: string;
    notes?: string;
  };
}
