declare namespace API {
    /** 系统消息DTO */
    type SystemMessageDto = {
        id: number;
        title: string;
        content: string;
        type: number;
        typeString: string;
        isRead: boolean;
        readAt?: string;
        expireAt?: string;
        priority: number;
        priorityString: string;
        createdAt: string;
    };

    /** 系统消息类型枚举 */
    enum MessageType {
        Notification = 0,
        Warning = 1,
        Error = 2,
        System = 3
    }

    /** 消息优先级枚举 */
    enum MessagePriority {
        Low = 0,
        Normal = 1,
        High = 2,
        Urgent = 3
    }

    /** 分页结果 */
    type PagedResult<T> = {
        totalCount: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
        messages: T[];
    };

    /** 操作结果 */
    type Result = {
        message: string;
        data?: any;
    };
} 