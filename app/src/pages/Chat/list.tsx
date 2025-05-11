import BackNavBar from "@/components/BackNavBar"
import api from "@/services/api"
import { getImageUrl } from "@/utils";
import { history, useRequest } from "@umijs/max"
import { Avatar, Empty, Loading, List } from "antd-mobile";
import dayjs from "dayjs";

export default () => {
    // 使用新的API获取用户与发布者的聊天列表
    const { data: publishers, loading } = useRequest(api.chatMessage.getMessagesUserPublishers);

    const navigateToChat = (publisherId: number) => {
        history.push(`/chat/${publisherId}`);
    };

    return (
        <BackNavBar title="聊天列表">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loading />
                </div>
            ) : publishers && publishers.length > 0 ? (
                <List className="my-2">
                    {publishers.map((publisher: API.ConversationPublisherDto) => (
                        <List.Item
                            key={publisher.publisherId}
                            prefix={
                                <Avatar
                                    src={getImageUrl(publisher.avatarUrl)}
                                    className="w-12 h-12"
                                />
                            }
                            description={
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500 truncate max-w-48">
                                        {publisher.lastMessage || '暂无消息'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {publisher.lastMessageTime ?
                                            dayjs(publisher.lastMessageTime).format('MM-DD HH:mm') : ''}
                                    </span>
                                </div>
                            }
                            extra={
                                publisher.unreadCount && publisher.unreadCount > 0 ? (
                                    <div className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                                        {publisher.unreadCount}
                                    </div>
                                ) : null
                            }
                            onClick={() => navigateToChat(publisher.publisherId || 0)}
                        >
                            <div className="font-medium">{publisher.name || '未知发布者'}</div>
                        </List.Item>
                    ))}
                </List>
            ) : (
                <Empty
                    className="h-full flex flex-col justify-center"
                    description="暂无聊天记录"
                />
            )}
        </BackNavBar>
    )
}
