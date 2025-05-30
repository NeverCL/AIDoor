declare namespace API {
  type AccountCreateRequest = {
    username: string;
    password: string;
    isAdmin?: boolean;
  };

  type AccountInfoResponse = {
    id?: number;
    username?: string;
    isAdmin?: boolean;
    isActive?: boolean;
    createdAt?: string;
    lastLoginAt?: string;
  };

  type AccountListResponse = {
    data?: AccountInfoResponse[];
    total?: number;
    success?: boolean;
  };

  type AccountUpdateRequest = {
    username?: string;
    password?: string;
    isAdmin?: boolean;
    isActive?: boolean;
  };

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

  type BannerCreateDto = {
    title: string;
    bannerImageUrl: string;
    qrCodeImageUrl: string;
  };

  type BannerUpdateDto = {
    title: string;
    bannerImageUrl: string;
    qrCodeImageUrl: string;
    isActive?: boolean;
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
    userId?: number;
    userName?: string;
    userAvatar?: string;
    publisherId?: number;
    publisherName?: string;
    publisherAvatar?: string;
    content?: string;
    isRead?: boolean;
    createdAt?: string;
    readAt?: string;
    senderType?: MessageSenderType;
  };

  type CommentCreateDto = {
    content: string;
    contentId: number;
    targetType?: string;
    parentId?: number;
  };

  type ConversationPublisherDto = {
    publisherId?: number;
    name?: string;
    avatarUrl?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
  };

  type ConversationUserDto = {
    userId?: number;
    username?: string;
    avatarUrl?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
  };

  type CreatePrivateMessageDto = {
    publisherId: number;
    content: string;
  };

  type deleteAccountIdParams = {
    id: number;
  };

  type deleteAdminAppitemsApplicationsApplicationIdParams = {
    applicationId: number;
  };

  type deleteAdminAppitemsCategoriesCategoryIdParams = {
    categoryId: number;
  };

  type deleteAdminBannersIdParams = {
    id: number;
  };

  type deleteAdminSystemMessagesIdParams = {
    id: number;
  };

  type deleteCommentIdParams = {
    id: number;
  };

  type deleteMessagesPublisherDeleteMessageIdParams = {
    messageId: number;
  };

  type deleteMessagesUserDeleteMessageIdParams = {
    messageId: number;
  };

  type deletePublisherIdParams = {
    id: number;
  };

  type deleteSystemMessageIdParams = {
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

  type getAccountIdParams = {
    id: number;
  };

  type getAccountParams = {
    Current?: number;
    PageSize?: number;
    Username?: string;
    IsActive?: boolean;
  };

  type getAdminAppitemsApplicationsApplicationIdParams = {
    applicationId: number;
  };

  type getAdminAppitemsCategoriesCategoryIdParams = {
    categoryId: number;
  };

  type getAdminBannersIdParams = {
    id: number;
  };

  type getAdminSystemMessagesIdParams = {
    id: number;
  };

  type getAdminSystemMessagesParams = {
    Page?: number;
    Limit?: number;
    OnlyUnread?: boolean;
    Type?: string;
    MinPriority?: string;
  };

  type getAppItemIdParams = {
    id: number;
  };

  type getBannersIdParams = {
    id: number;
  };

  type getCommentParams = {
    Page?: number;
    Limit?: number;
    ContentId?: number;
    TargetType?: string;
    ParentId?: number;
  };

  type getMessagesPublisherMessagesParams = {
    Page?: number;
    Limit?: number;
    PublisherId?: number;
    UserId?: number;
    Unread?: boolean;
  };

  type getMessagesUserMessagesParams = {
    Page?: number;
    Limit?: number;
    PublisherId?: number;
    UserId?: number;
    Unread?: boolean;
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

  type getSystemMessageIdParams = {
    id: number;
  };

  type getSystemMessageParams = {
    Page?: number;
    Limit?: number;
    OnlyUnread?: boolean;
    Type?: string;
    MinPriority?: string;
  };

  type getUserAdminListParams = {
    pageSize?: number;
    pageIndex?: number;
    keyword?: string;
  };

  type getUserContentIdParams = {
    id: number;
  };

  type getUserContentParams = {
    Page?: number;
    Limit?: number;
    IsOwner?: boolean;
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

  type getUserRecordFootprintsParams = {
    Page?: number;
    Limit?: number;
    RecordType?: string;
  };

  type getUserRecordParams = {
    Page?: number;
    Limit?: number;
    RecordType?: string;
  };

  type LoginInput = {
    username: string;
    password: string;
    type?: string;
    autoLogin?: boolean;
  };

  type LoginResponse = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type MessagePriority = integer;

  type MessageSenderType = integer;

  type MessageType = integer;

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

  type PublisherCreateMessageDto = {
    userId: number;
    content: string;
  };

  type PublisherCreateUpdateRequest = {
    name?: string;
    avatarUrl?: string;
    description?: string;
    summary?: string;
    type?: PublisherType;
    website?: string;
    appLink?: string;
  };

  type PublisherType = integer;

  type putAccountIdParams = {
    id: number;
  };

  type putAdminAppitemsApplicationsApplicationIdParams = {
    applicationId: number;
  };

  type putAdminAppitemsCategoriesCategoryIdParams = {
    categoryId: number;
  };

  type putAdminBannersIdParams = {
    id: number;
  };

  type putAdminSystemMessagesIdParams = {
    id: number;
  };

  type putMessagesPublisherMarkAllReadUserIdParams = {
    userId: number;
  };

  type putMessagesPublisherMarkReadMessageIdParams = {
    messageId: number;
  };

  type putMessagesUserMarkAllReadPublisherIdParams = {
    publisherId: number;
  };

  type putMessagesUserMarkReadMessageIdParams = {
    messageId: number;
  };

  type putSystemMessageIdParams = {
    id: number;
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

  type SystemMessageCreateDto = {
    title: string;
    content: string;
    type?: MessageType;
    recipientId?: number;
    expireAt?: string;
    priority?: MessagePriority;
  };

  type SystemMessageUpdateDto = {
    isRead?: boolean;
  };

  type UpdateProfileRequest = {
    username: string;
    avatarUrl: string;
  };

  type UpdateUserStatusRequest = {
    userId: number;
    isActive: boolean;
  };

  type UserContentCreateDto = {
    title: string;
    content?: string;
    images: string[];
  };

  type UserFollowCreateDto = {
    followingId: number;
  };

  type UserLoginRequest = {
    phone: string;
    code: string;
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
