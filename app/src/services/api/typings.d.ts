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

  type CategoryCreateDto = {
    name: string;
    displayOrder?: number;
  };

  type CategoryUpdateDto = {
    name: string;
    displayOrder?: number;
    isActive?: boolean;
  };

  type deleteAdminAppitemsApplicationsApplicationIdParams = {
    applicationId: number;
  };

  type deleteAdminAppitemsCategoriesCategoryIdParams = {
    categoryId: number;
  };

  type deleteItemIdParams = {
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

  type getItemIdParams = {
    id: number;
  };

  type getItemParams = {
    Page?: number;
    Limit?: number;
  };

  type ItemCreateDto = {
    title: string;
    imageUrl: string;
    userId: number;
  };

  type ItemUpdateDto = {
    title?: string;
    imageUrl?: string;
  };

  type LoginRequest = {
    phone: string;
    code: string;
  };

  type putAdminAppitemsApplicationsApplicationIdParams = {
    applicationId: number;
  };

  type putAdminAppitemsCategoriesCategoryIdParams = {
    categoryId: number;
  };

  type putItemIdParams = {
    id: number;
  };

  type RegisterRequest = {
    name: string;
    phone: string;
    code: string;
    password?: string;
  };

  type SendCodeRequest = {
    phone: string;
  };

  type UpdateProfileRequest = {
    username: string;
    avatarUrl: string;
  };
}
