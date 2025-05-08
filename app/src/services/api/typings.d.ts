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

  type CommentCreateDto = {
    content: string;
    contentId: number;
    targetType?: string;
    parentId?: number;
  };

  type deleteAdminAppitemsApplicationsApplicationIdParams = {
    applicationId: number;
  };

  type deleteAdminAppitemsCategoriesCategoryIdParams = {
    categoryId: number;
  };

  type deleteCommentIdParams = {
    id: number;
  };

  type deleteItemIdParams = {
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

  type DeveloperApplicationCreateDto = {
    name: string;
    logo: string[];
    description: string;
    website?: string;
    company?: string;
    category: string;
    userType: string;
    stage: string;
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

  type getCommentParams = {
    Page?: number;
    Limit?: number;
    ContentId?: number;
    TargetType?: string;
    ParentId?: number;
  };

  type getDeveloperApplicationIdParams = {
    id: number;
  };

  type getItemIdParams = {
    id: number;
  };

  type getItemParams = {
    Page?: number;
    Limit?: number;
  };

  type getPublisherAllParams = {
    page?: number;
    pageSize?: number;
    status?: string;
  };

  type getPublisherIdParams = {
    id: number;
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

  type putItemIdParams = {
    id: number;
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

  type PublisherRatingDto = {
    rating: number;
  };

  type postPublisherIdRateParams = {
    id: number;
  };

  type getPublisherIdMyRatingParams = {
    id: number;
  };
}
