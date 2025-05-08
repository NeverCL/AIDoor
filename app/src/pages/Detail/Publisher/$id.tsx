import { useParams } from "@umijs/max";
import BackNavBar from "@/components/BackNavBar";
import { Avatar, Button, DotLoading, Tag, Rate, InfiniteScroll, Dialog, Toast, Tabs, List, Empty } from "antd-mobile";
import { useEffect, useState } from "react";
import { useRequest } from '@umijs/max';
import api from '@/services/api';
import dayjs from 'dayjs';
import { StarFill, MessageOutline } from 'antd-mobile-icons';

interface PublisherData {
    id: number;
    username: string;
    avatarUrl: string;
    description: string;
    createdAt: string;
    status: number;
    statusText: string;
    reviewNote?: string;
    reviewedAt?: string;
    type: number;
    typeText: string;
    website?: string;
    appLink?: string;
    userId?: number;
    stats: {
        likes: number;
        followers: number;
        following: number;
        rating: number;
    };
}

interface PublisherContent {
    id: number;
    title: string;
    imageUrl?: string;
    images?: string[];
    createdAt: string;
}

export default () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('works');
    const [contents, setContents] = useState<PublisherContent[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [ratingsPage, setRatingsPage] = useState(1);
    const [ratingsHasMore, setRatingsHasMore] = useState(true);
    const [ratings, setRatings] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const pageSize = 10;
    const [messageVisible, setMessageVisible] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    // 获取发布者详情
    const { data: publisherData, loading, refresh } = useRequest<PublisherData>(
        () => api.publisher.getPublisherId({ id: Number(id) }),
        {
            onSuccess: (data) => {
                // 发布者详情信息加载成功
            }
        }
    );

    // 获取用户对该发布者的评分
    const { data: userRating, run: getUserRating } = useRequest(
        () => api.publisher.getPublisherIdMyRating({ id: Number(id) }),
        {
            manual: true
        }
    );

    // 获取发布者评分列表
    const { run: loadRatings } = useRequest(
        (pageNum: number) => api.publisher.getPublisherIdRatings({
            id: Number(id),
            page: pageNum,
            pageSize
        }),
        {
            manual: true,
            onSuccess: (response) => {
                if (response && response.items) {
                    setRatings(prev =>
                        ratingsPage === 1 ? response.items : [...prev, ...response.items]
                    );
                    setRatingsHasMore(response.items.length === pageSize && response.page < response.totalPages);
                    setRatingsPage(prev => prev + 1);
                }
            }
        }
    );

    // 获取发布者内容列表 - 使用标准的用户内容API，后端需要添加用户ID过滤
    const { run: loadContents } = useRequest(
        (pageNum: number) => api.userContent.getUserContent({
            Page: pageNum,
            Limit: pageSize
            // 注意：后端需要支持按发布者筛选，这里假设后端已修改
            // 由于API不支持PublisherId参数，需要后端扩展
        }),
        {
            manual: true,
            onSuccess: (response) => {
                if (response && response.contents) {
                    const newContents = response.contents.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        imageUrl: item.images && item.images.length > 0 ? item.images[0] : undefined,
                        images: item.images,
                        createdAt: item.createdAt
                    }));

                    setContents(prev =>
                        page === 1 ? newContents : [...prev, ...newContents]
                    );
                    setHasMore(newContents.length === pageSize);
                    setPage(prev => prev + 1);
                }
            }
        }
    );

    // 检查是否已关注该发布者
    const { run: checkFollowStatus } = useRequest(
        () => api.userFollow.getUserFollowCheckId({ id: Number(id) }),
        {
            manual: true,
            onSuccess: (response) => {
                setIsFollowing(response?.isFollowing || false);
            }
        }
    );

    useEffect(() => {
        if (id) {
            setPage(1);
            setRatingsPage(1);
            loadContents(1);
            checkFollowStatus();
            getUserRating();
            loadRatings(1);
        }
    }, [id]);

    // 加载更多内容
    const loadMore = async () => {
        if (publisherData?.status !== 1) return; // 只有已审核通过的发布者才加载内容
        await loadContents(page);
    };

    // 加载更多评分
    const loadMoreRatings = async () => {
        if (publisherData?.status !== 1) return; // 只有已审核通过的发布者才加载评分
        await loadRatings(ratingsPage);
    };

    // 处理关注
    const handleFollow = async () => {
        try {
            if (isFollowing) {
                // 取消关注
                await api.userFollow.deleteUserFollowId({ id: Number(id) });
                Toast.show({
                    icon: 'success',
                    content: '已取消关注',
                });
                setIsFollowing(false);
            } else {
                // 关注发布者
                await api.userFollow.postUserFollow({ followingId: Number(id) });
                Toast.show({
                    icon: 'success',
                    content: '关注成功',
                });
                setIsFollowing(true);
            }
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: '操作失败，请重试',
            });
        }
    };

    // 处理评分 - 使用新的评分API
    const handleRate = async (value: number) => {
        try {
            await Dialog.confirm({
                content: `确定给该发布者 ${value} 星评分吗？`,
                onConfirm: async () => {
                    // 可以选择输入评价内容
                    let comment: string | null = null;

                    try {
                        // 尝试获取用户评论
                        comment = await new Promise<string | null>((resolve) => {
                            Dialog.show({
                                title: '评价内容',
                                content: (
                                    <div className="py-4">
                                        <textarea
                                            className="w-full border p-2 rounded"
                                            placeholder="请输入评价内容（可选）"
                                            rows={3}
                                            id="rating-comment"
                                        />
                                    </div>
                                ),
                                actions: [
                                    {
                                        key: 'skip',
                                        text: '跳过',
                                        onClick: () => resolve(null)
                                    },
                                    {
                                        key: 'submit',
                                        text: '提交评分',
                                        bold: true,
                                        onClick: () => {
                                            const textarea = document.getElementById('rating-comment') as HTMLTextAreaElement;
                                            resolve(textarea?.value || null);
                                        }
                                    }
                                ]
                            });
                        });
                    } catch (err) {
                        comment = null;
                    }

                    const ratingRequest: API.RatePublisherRequestDto = {
                        rating: value,
                        comment: comment || undefined
                    };

                    await api.publisher.postPublisherIdRate(
                        { id: Number(id) },
                        ratingRequest
                    );

                    // 刷新用户评分和发布者详情
                    getUserRating();
                    refresh();
                    // 重新加载评分列表
                    setRatingsPage(1);
                    loadRatings(1);

                    Toast.show({
                        icon: 'success',
                        content: '评分成功',
                    });
                },
            });
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: '评分失败，请重试',
            });
        }
    };

    // 发送私信
    const handleSendMessage = async () => {
        if (!messageContent.trim()) {
            Toast.show({
                content: '消息内容不能为空',
            });
            return;
        }

        try {
            setSendingMessage(true);

            if (!publisherData?.userId) {
                Toast.show({
                    content: '无法发送消息，该发布者未关联用户账号',
                });
                return;
            }

            const messageDto: API.CreatePrivateMessageDto = {
                receiverId: publisherData.userId,
                publisherId: publisherData.id,
                content: messageContent
            };

            await api.privateMessage.postPrivateMessage(messageDto);

            Toast.show({
                icon: 'success',
                content: '消息发送成功',
            });

            setMessageContent('');
            setMessageVisible(false);
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: '发送失败，请重试',
            });
        } finally {
            setSendingMessage(false);
        }
    };

    // 显示发送消息对话框
    const showMessageDialog = () => {
        if (!publisherData) {
            Toast.show({
                content: '加载发布者信息中，请稍后再试',
            });
            return;
        }

        setMessageVisible(true);
    };

    // 获取状态标签颜色
    const getStatusTagColor = (status: number) => {
        switch (status) {
            case 0: return 'warning';
            case 1: return 'success';
            case 2: return 'danger';
            default: return 'default';
        }
    };

    // 用户评分组件
    const UserRatingComponent = () => {
        if (!publisherData) return null;

        return (
            <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">我的评分</div>
                <div className="flex items-center">
                    <Rate
                        value={userRating?.value || 0}
                        onChange={handleRate}
                        allowClear={false}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                        {userRating?.value ? `${userRating.value}分` : '未评分'}
                    </span>
                </div>
                {userRating?.comment && (
                    <div className="mt-2 text-sm p-2 bg-gray-50 rounded">
                        "{userRating.comment}"
                    </div>
                )}
            </div>
        );
    };

    // 评分列表组件
    const RatingsListComponent = () => {
        if (!publisherData) return null;

        if (ratings.length === 0) {
            return <Empty description="暂无评分" />;
        }

        return (
            <List>
                {ratings.map((rating: any) => (
                    <List.Item
                        key={rating.id}
                        prefix={
                            <Avatar
                                src={rating.userAvatarUrl}
                                style={{ borderRadius: 20 }}
                            />
                        }
                        description={
                            <div>
                                <div className="flex items-center">
                                    <Rate
                                        value={rating.value}
                                        readOnly
                                        style={{ '--star-size': '14px' } as any}
                                    />
                                    <span className="ml-2 text-xs text-gray-400">
                                        {dayjs(rating.createdAt).format('YYYY-MM-DD')}
                                    </span>
                                </div>
                                {rating.comment && (
                                    <div className="mt-1 text-sm text-gray-600">
                                        {rating.comment}
                                    </div>
                                )}
                            </div>
                        }
                    >
                        {rating.userName}
                    </List.Item>
                ))}
                <InfiniteScroll loadMore={loadMoreRatings} hasMore={ratingsHasMore} />
            </List>
        );
    };

    // 加载状态
    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <DotLoading color='primary' />
                    <div className="mt-2 text-gray-500">加载中...</div>
                </div>
            </div>
        );
    }

    // 发布者不存在
    if (!publisherData) {
        return (
            <div className="h-screen flex flex-col">
                <BackNavBar title="发布者详情">发布者详情</BackNavBar>
                <div className="flex-1 flex justify-center items-center">
                    <Empty description="未找到该发布者" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white">
            <BackNavBar title="发布者详情">发布者详情</BackNavBar>
            <div className="flex-1 overflow-y-auto pb-20">
                {/* 基本信息 */}
                <div className="p-4">
                    <div className="flex items-start">
                        <Avatar src={publisherData.avatarUrl} style={{ '--size': '60px' }} />
                        <div className="ml-3 flex-1">
                            <div className="text-xl font-bold flex items-center">
                                {publisherData.username}
                                <Tag
                                    className="ml-2"
                                    color={getStatusTagColor(publisherData.status)}
                                >
                                    {publisherData.statusText}
                                </Tag>
                                <Tag className="ml-1" color="primary">
                                    {publisherData.typeText}
                                </Tag>
                            </div>
                            <div className="flex items-center mt-1">
                                <span className="flex items-center text-yellow-500">
                                    <StarFill fontSize={14} />
                                    <span className="ml-1">{publisherData.stats.rating.toFixed(1)}</span>
                                </span>
                                <span className="ml-3 text-gray-500 text-sm">
                                    {dayjs(publisherData.createdAt).format('YYYY年MM月DD日')} 加入
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="flex justify-around mt-4 text-center bg-gray-50 py-3 rounded-lg">
                        <div>
                            <div className="text-lg font-medium">{publisherData.stats.likes}</div>
                            <div className="text-xs text-gray-500">获赞</div>
                        </div>
                        <div>
                            <div className="text-lg font-medium">{publisherData.stats.followers}</div>
                            <div className="text-xs text-gray-500">粉丝</div>
                        </div>
                        <div>
                            <div className="text-lg font-medium">{publisherData.stats.following}</div>
                            <div className="text-xs text-gray-500">关注</div>
                        </div>
                    </div>

                    {/* 描述信息 */}
                    <div className="mt-4">
                        <div className="text-sm text-gray-600">{publisherData.description}</div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center mt-4">
                        <Button
                            color={isFollowing ? "default" : "primary"}
                            fill="solid"
                            onClick={handleFollow}
                            className="flex-1 mr-2"
                        >
                            {isFollowing ? '已关注' : '关注'}
                        </Button>
                        <Button
                            color="primary"
                            fill="outline"
                            onClick={showMessageDialog}
                            className="flex-1"
                        >
                            <div className="flex items-center justify-center">
                                <MessageOutline style={{ fontSize: 18 }} />
                                <span className="ml-1">发私信</span>
                            </div>
                        </Button>
                    </div>

                    {/* 外部链接 */}
                    {(publisherData.website || publisherData.appLink) && (
                        <div className="mt-4 flex flex-wrap">
                            {publisherData.website && (
                                <a
                                    href={publisherData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm mr-4"
                                >
                                    官方网站
                                </a>
                            )}
                            {publisherData.appLink && (
                                <a
                                    href={publisherData.appLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm"
                                >
                                    应用链接
                                </a>
                            )}
                        </div>
                    )}

                    {/* 用户评分组件 */}
                    <UserRatingComponent />
                </div>

                {/* 内容和评分标签页 */}
                <div className="mt-4">
                    <Tabs activeKey={activeTab} onChange={setActiveTab}>
                        <Tabs.Tab title="作品" key="works" />
                        <Tabs.Tab title="评分" key="ratings" />
                    </Tabs>

                    <div className="p-4">
                        {activeTab === 'works' ? (
                            contents.length > 0 ? (
                                <div className="flex flex-col space-y-4">
                                    {contents.map((content) => (
                                        <div
                                            key={content.id}
                                            className="bg-gray-50 rounded-lg p-3 shadow-sm"
                                            onClick={() => window.location.href = `/detail/content/${content.id}`}
                                        >
                                            {content.imageUrl && (
                                                <div className="mb-2">
                                                    <img
                                                        src={content.imageUrl}
                                                        alt={content.title}
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <div className="text-base font-medium">{content.title}</div>
                                                <div className="text-xs text-gray-500">
                                                    {dayjs(content.createdAt).format('YYYY-MM-DD')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                                </div>
                            ) : (
                                <Empty description="暂无内容" />
                            )
                        ) : (
                            <RatingsListComponent />
                        )}
                    </div>
                </div>
            </div>

            {/* 私信对话框 */}
            <Dialog
                visible={messageVisible}
                title="发送私信"
                content={
                    <div className="pt-4">
                        <textarea
                            className="w-full border p-2 rounded"
                            placeholder="请输入消息内容..."
                            rows={4}
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                        />
                    </div>
                }
                actions={[
                    {
                        key: 'cancel',
                        text: '取消',
                        onClick: () => setMessageVisible(false)
                    },
                    {
                        key: 'confirm',
                        text: sendingMessage ? '发送中...' : '发送',
                        bold: true,
                        disabled: sendingMessage || !messageContent.trim(),
                        onClick: handleSendMessage
                    }
                ]}
            />
        </div>
    );
}; 