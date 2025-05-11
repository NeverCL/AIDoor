import BackNavBar from "@/components/BackNavBar";
import { useRequest, useModel, history } from "@umijs/max";
import api from "@/services/api";
import { useParams } from "@umijs/max";
import { Input, Button, Toast } from "antd-mobile";
import { getImageUrl } from "@/utils";
import { useEffect, useState, useRef } from "react";

export default () => {
    const { id } = useParams();
    const { user } = useModel('global');
    const publisherId = parseInt(id || "0");

    const [messageText, setMessageText] = useState("");
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // 获取聊天消息列表
    const {
        data: messagesData,
        loading: messagesLoading,
        run: getMessages,
        refresh: refreshMessages
    } = useRequest(
        () => api.chatMessage.getMessagesUserMessages({
            PublisherId: publisherId,
            Page: 1,
            Limit: 50
        }),
        {
            manual: true,
            onError: (error) => {
                Toast.show({
                    content: '获取消息失败',
                });
            }
        }
    );

    // 获取对话发布者列表
    const {
        data: publishersData,
        loading: publishersLoading
    } = useRequest(
        () => api.chatMessage.getMessagesUserPublishers(),
        {
            onError: (error) => {
                Toast.show({
                    content: '获取发布者信息失败',
                });
            }
        }
    );

    // 标记消息为已读
    const { run: markAllAsRead } = useRequest(
        () => api.chatMessage.putMessagesUserMarkAllReadPublisherId({ publisherId }),
        {
            manual: true,
            onError: (error) => {
                console.error('标记已读失败', error);
            }
        }
    );

    // 发送消息
    const { run: sendMessage } = useRequest(
        (content: string) => api.chatMessage.postMessagesSendToPublisher({
            publisherId,
            content
        }),
        {
            manual: true,
            onSuccess: () => {
                setMessageText("");
                refreshMessages();
            },
            onError: (error) => {
                Toast.show({
                    content: '发送消息失败',
                });
            }
        }
    );

    // 获取当前对话发布者的信息
    const currentPublisher = publishersData?.find((p: API.ConversationPublisherDto) => p.publisherId === publisherId);

    // 初始化加载消息及标记已读
    useEffect(() => {
        if (publisherId) {
            getMessages();
            markAllAsRead();
        }
    }, [publisherId]);

    // 消息列表滚动到底部
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messagesData]);

    // 处理发送消息
    const handleSendMessage = () => {
        if (!messageText.trim()) {
            return;
        }
        sendMessage(messageText);
    };

    return (
        <BackNavBar title={currentPublisher?.name || "聊天"}>
            <div
                ref={messagesContainerRef}
                className="flex-1 flex flex-col *:mt-4 overflow-y-auto p-2"
            >
                {messagesLoading ? (
                    <div className="text-center">加载中...</div>
                ) : messagesData?.data?.length === 0 ? (
                    <div className="text-center text-gray-500">暂无消息，开始聊天吧</div>
                ) : (
                    // 对消息进行排序，按时间从旧到新（早的在上，新的在下）
                    [...(messagesData?.data || [])].sort((a, b) => {
                        const dateA = new Date(a.createdAt || 0);
                        const dateB = new Date(b.createdAt || 0);
                        return dateA.getTime() - dateB.getTime();
                    }).map((message) => {
                        const isMe = message.senderType === 0; // 0 = 用户发送，1 = 发布者发送
                        return (
                            <div key={message.id}>
                                <div className={`flex items-center ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className="w-10 h-10 rounded-full bg-gray-300 mx-2">
                                        <img
                                            src={getImageUrl(isMe ? message.userAvatar : message.publisherAvatar)}
                                            alt="avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    <div className={`p-2 rounded-lg ${isMe ? 'bg-blue-500 text-white' : 'bg-secondary'}`}>
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {/* 输入框 */}
            <div className="flex items-center m-2 p-2 bg-secondary rounded-lg shadow-sm">
                <div className="flex-1 mr-2">
                    <Input
                        placeholder="请输入消息..."
                        style={{ '--adm-color-text': 'black' } as React.CSSProperties}
                        className="rounded-full px-4 py-2 border-none !bg-white"
                        value={messageText}
                        onChange={setMessageText}
                    />
                </div>
                <Button
                    color="primary"
                    className="!rounded-full !px-4"
                    onClick={handleSendMessage}
                >
                    发送
                </Button>
            </div>
        </BackNavBar>
    )
}
