import BackNavBar from '@/components/BackNavBar';
import { history, useModel } from '@umijs/max';
import { List } from 'antd-mobile';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getMessagesUserPublishers, getMessagesPublisherUsers } from '@/services/api/chatMessage';

export default () => {

    const navigateToDetail = (type: string) => {
        history.push(`/my/message-detail?type=${type}`);
    };

    const navigate = (path: string) => {
        history.push(path);
    };

    const { user } = useModel('global');
    const isPublisher = user?.isDevMode; // 判断是否为发布者模式

    const [messageLoading, setMessageLoading] = useState(false);
    const [publishers, setPublishers] = useState<API.ConversationPublisherDto[]>([]);
    const [users, setUsers] = useState<API.ConversationUserDto[]>([]);

    // 获取私信列表 - 根据身份不同调用不同接口
    const fetchMessages = async () => {
        setMessageLoading(true);
        try {
            if (isPublisher) {
                // 发布者获取用户列表
                const data = await getMessagesPublisherUsers();
                // 按最后消息时间倒序排序，最新的在最上面
                const sortedData = data.sort((a, b) => {
                    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
                    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
                    return timeB - timeA;
                });
                setUsers(sortedData);
            } else {
                // 用户获取发布者列表
                const data = await getMessagesUserPublishers();
                // 按最后消息时间倒序排序，最新的在最上面
                const sortedData = data.sort((a, b) => {
                    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
                    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
                    return timeB - timeA;
                });
                setPublishers(sortedData);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setMessageLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [isPublisher]);

    return (
        <>
            <BackNavBar title="消息通知">
                <div className="p-2">
                    <List className="bg-white rounded-lg">
                        <List.Item
                            prefix={
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-500 text-lg">关</span>
                                </div>
                            }
                            onClick={() => navigateToDetail('follow')}
                            description="查看谁关注了你"
                        >
                            关注记录
                        </List.Item>
                        <List.Item
                            prefix={
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-500 text-lg">互</span>
                                </div>
                            }
                            onClick={() => navigateToDetail('interaction')}
                            description="查看点赞、评论、收藏等互动"
                        >
                            互动记录
                        </List.Item>
                        <List.Item
                            prefix={
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <span className="text-yellow-500 text-lg">评</span>
                                </div>
                            }
                            onClick={() => navigateToDetail('rating')}
                            description="查看作品评分情况"
                        >
                            评分记录
                        </List.Item>
                    </List>
                </div>

                {/* 私信列表 */}
                <div className="text-lg font-bold">私信</div>

                <div className="p-2 overflow-y-auto">
                    <div className="flex flex-col gap-2 mb-28">
                        {
                            messageLoading ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : isPublisher ? (
                                // 发布者模式显示用户列表
                                users.length > 0 ? (
                                    users.map((user) => (
                                        <div key={user.userId} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => navigate(`/chat/user/${user.userId}`)}>
                                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt={user.username || '未知用户'} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl text-primary">{user.username ? user.username.charAt(0) : '?'}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-base font-bold flex items-center gap-1">
                                                    {user.username || '未知用户'}
                                                    {user.unreadCount && user.unreadCount > 0 && (
                                                        <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                                                            {user.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-52">{user.lastMessage || '无消息内容'}</div>
                                            </div>
                                            <div className="text-xs text-gray-500">{user.lastMessageTime ? dayjs(user.lastMessageTime).format('YYYY-MM-DD HH:mm') : ''}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">暂无私信</div>
                                )
                            ) : (
                                // 用户模式显示发布者列表
                                publishers.length > 0 ? (
                                    publishers.map((publisher) => (
                                        <div key={publisher.publisherId} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => navigate(`/chat/${publisher.publisherId}`)}>
                                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                                                {publisher.avatarUrl ? (
                                                    <img src={publisher.avatarUrl} alt={publisher.name || '未知发布者'} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl text-primary">{publisher.name ? publisher.name.charAt(0) : '?'}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-base font-bold flex items-center gap-1">
                                                    {publisher.name || '未知发布者'}
                                                    {publisher.unreadCount && publisher.unreadCount > 0 && (
                                                        <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                                                            {publisher.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-52">{publisher.lastMessage || '无消息内容'}</div>
                                            </div>
                                            <div className="text-xs text-gray-500">{publisher.lastMessageTime ? dayjs(publisher.lastMessageTime).format('YYYY-MM-DD HH:mm') : ''}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">暂无私信</div>
                                )
                            )
                        }
                    </div>
                </div>
            </BackNavBar>
        </>
    );
}; 